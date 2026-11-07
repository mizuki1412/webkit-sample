/**
 * 报文加密前端对接模块（对应 go-frame restkit 的 middleware.DecryptRequest / EncryptResponse）。
 *
 * 协议（与 go-frame pkg/library/cryptokit/rsa_aes.go、pkg/service/restkit/middleware/payload_crypto.go 一致）：
 *   公钥下发  GET /payload/publicKey → {result:0, data:{publicKey:"<PKIX PEM>"}}
 *   密钥头    X-Enc-Key: base64( RSA( base64(64B 密钥材料) ) )，64B = AESKey(32B) + MACKey(32B)，每请求随机生成；
 *             内层 base64 是因 jsencrypt 按 charCode 处理入参，二进制密钥不可直传
 *   加密体    {"body":"base64( IV(16B) || AES-256-CBC-PKCS7(明文) || HMAC-SHA256(32B) )"}，MAC 覆盖 IV||密文
 *
 * RSA 取 PKCS1v15（jsencrypt），AES-CBC+HMAC 取 crypto-js——明文 HTTP（非安全上下文）拿不到
 * WebCrypto，纯 JS 实现任何环境可用；后端 RSADecrypt 先试 OAEP 后回退 PKCS1v15，两种实现均兼容。
 *
 * 用法（app 启动时按需开启，未开启时 request() 行为不变）：
 *   import {payloadCryptoEnable} from "/web-frame/backend/go-frame"
 *   payloadCryptoEnable({exclude: ["/common/"]})
 *
 * 开启后web-frame/request 的 request() 经 RequestConfig.payloadCodec 钩子自动：
 * JSON 请求体加密为信封 + 携带 X-Enc-Key；响应头带 X-Enc-Payload: 1 时自动解密；
 * 上传(multipart)/下载(blob) 请求自动跳过。服务端重启换钥（未配置 crypto.rsaPrivateKey
 * 时自动生成临时密钥）导致的「报文解密失败」会自动清公钥缓存并重试一次，无需手动刷新页面。
 */
import axios from "axios"
import {RequestConfig} from "../../request"

// 请求头：RSA 公钥加密的 AES 密钥材料（base64），请求/响应加密共用
export const EncKeyHeader = "X-Enc-Key"
// 响应头：标记响应体已按信封格式加密
export const EncPayloadHeader = "X-Enc-Payload"

// 认证加密密钥材料总长（go-frame cryptokit.AuthAESKeyLen）：AES-256 密钥(32B) + HMAC-SHA256 密钥(32B)
const AUTH_AES_KEY_LEN = 64
// 后端 decryptKeyMaterial / AuthAESDecrypt 失败时 JsonError 的文案，用于密钥轮换自愈识别
const DECRYPT_FAIL_MSG = "报文解密失败"

const state = {
  enabled: false,
  publicKeyUrl: "/payload/publicKey",
  // (string|RegExp)[]：string 按前缀匹配，命中则该 url 不走加密
  exclude: [],
}

/**
 * 开启报文加密对接
 * @param opts publicKeyUrl 公钥下发端点（默认 /payload/publicKey，对应后端 restkit.PayloadPublicKeyPath）
 *             exclude 排除的 url 前缀/正则（上传下载已按 content-type/responseType 自动跳过，无需配）
 */
export function payloadCryptoEnable(opts = {}) {
  state.enabled = true
  if (opts.publicKeyUrl) state.publicKeyUrl = opts.publicKeyUrl
  if (opts.exclude) state.exclude = opts.exclude
  // 注入核心 request 的加密钩子（核心层不感知 go-frame 信封协议细节）
  RequestConfig.payloadCodec = goFramePayloadCodec
}

export function payloadCryptoDisable() {
  state.enabled = false
  RequestConfig.payloadCodec = null
}

// RequestConfig.payloadCodec 契约（见web-frame/request/index.js）的 go-frame 实现
const goFramePayloadCodec = {
  encKeyHeader: EncKeyHeader,
  match: payloadCryptoMatch,
  begin: payloadCryptoBegin,
  encryptBody: payloadCryptoEncryptBody,
  decryptResponse: payloadCryptoDecryptResponse,
  isDecryptFail: payloadCryptoIsDecryptFailResp,
  clearKeys: payloadCryptoClearPublicKey,
}

/// payloadCryptoActive: 模块开关状态
export function payloadCryptoActive() {
  return state.enabled
}

/// payloadCryptoMatch: 该 url 是否需要加密（已开启且未命中 exclude）
export function payloadCryptoMatch(url) {
  if (!state.enabled) return false
  for (const item of state.exclude || []) {
    if (item instanceof RegExp) {
      if (item.test(url)) return false
    } else if (typeof item === "string" && url.indexOf(item) === 0) {
      return false
    }
  }
  return true
}

// —— 加密库按需加载：动态 import 使 crypto-js/jsencrypt 只在开启加密时才进 chunk，不占主包体积 ——

let lib = null
let libPromise = null

function loadLib() {
  if (!libPromise) {
    // 按子路径引入（CBC/PKCS7 是 cipher-core 默认配置，随 aes.js 一并加载），避免 crypto-js 全量进包
    libPromise = Promise.all([
      import("crypto-js/core"),
      import("crypto-js/enc-base64"),
      import("crypto-js/enc-utf8"),
      import("crypto-js/aes"),
      import("crypto-js/hmac-sha256"),
      import("jsencrypt"),
    ])
      .then(([core, encBase64, encUtf8, aes, hmac, jsencrypt]) => {
        lib = {
          CryptoJS: core.default,
          Base64: encBase64.default,
          Utf8: encUtf8.default,
          AES: aes.default,
          HmacSHA256: hmac.default,
          JSEncrypt: jsencrypt.JSEncrypt || jsencrypt.default,
        }
        return lib
      })
      .catch((e) => {
        libPromise = null // 失败不缓存，下次重试
        throw e
      })
  }
  return libPromise
}

// —— 编码工具 ——

function randomBytes(n) {
  const bytes = new Uint8Array(n)
  globalThis.crypto.getRandomValues(bytes)
  return bytes
}

function bytesToBase64(bytes) {
  let bin = ""
  for (let i = 0; i < bytes.length; i++) {
    bin += String.fromCharCode(bytes[i])
  }
  return btoa(bin)
}

function bytesToWordArray(bytes) {
  const words = []
  for (let i = 0; i < bytes.length; i++) {
    words[i >>> 2] = (words[i >>> 2] || 0) | (bytes[i] << (24 - (i % 4) * 8))
  }
  return lib.CryptoJS.lib.WordArray.create(words, bytes.length)
}

function wordArrayToBytes(wordArray) {
  const words = wordArray.words
  const sigBytes = wordArray.sigBytes
  const bytes = new Uint8Array(sigBytes)
  for (let i = 0; i < sigBytes; i++) {
    bytes[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff
  }
  return bytes
}

// 常量时间比较，防 MAC 校验时序侧信道（与后端 hmac.Equal 对齐）
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a[i] ^ b[i]
  }
  return diff === 0
}

function assertLib() {
  if (!lib) throw new Error("报文加密库未初始化，须先调用 payloadCryptoBegin")
}

// —— 公钥获取与缓存 ——

let pubKeyPromise = null

function fetchPublicKey() {
  if (!pubKeyPromise) {
    pubKeyPromise = axios
      .get(state.publicKeyUrl)
      .then((resp) => {
        const pem = resp.data && resp.data.data && resp.data.data.publicKey
        if (!pem || typeof pem !== "string" || pem.indexOf("-----BEGIN") < 0) {
          throw new Error("报文加密公钥格式错误")
        }
        return pem
      })
      .catch((e) => {
        pubKeyPromise = null // 失败不缓存，下次重取
        throw e
      })
  }
  return pubKeyPromise
}

/// payloadCryptoClearPublicKey: 清公钥缓存（密钥轮换自愈用，下个请求重新拉取）
export function payloadCryptoClearPublicKey() {
  pubKeyPromise = null
}

// —— 协议核心 ——

/// payloadCryptoEnsureLib: 预加载加密库（payloadCryptoBegin 内部已调用；
/// 单测/预热场景可单独调用，返回 Promise<lib>）
export function payloadCryptoEnsureLib() {
  return loadLib()
}

/// payloadCryptoBegin: 每请求生成 64B 随机密钥材料并经 RSA 公钥加密为 X-Enc-Key 头值
// 返回 {key: Uint8Array(64), encKey: string}；key 同时用于请求体加密与响应解密（同挂时共用一把）
export async function payloadCryptoBegin() {
  await loadLib()
  const pem = await fetchPublicKey()
  const key = randomBytes(AUTH_AES_KEY_LEN)
  const rsa = new lib.JSEncrypt()
  rsa.setPublicKey(pem)
  // 内层 base64：jsencrypt 按 charCode 处理入参，二进制密钥不可直传（后端解出 base64 串后补一次解码）
  const encKey = rsa.encrypt(bytesToBase64(key))
  if (!encKey) throw new Error("报文加密密钥生成失败")
  return {key, encKey}
}

function splitAuthAESKey(key) {
  if (!key || key.length !== AUTH_AES_KEY_LEN) {
    throw new Error("密钥材料长度须为 64 字节")
  }
  return {aesKey: bytesToWordArray(key.subarray(0, 32)), macKey: bytesToWordArray(key.subarray(32, 64))}
}

/// payloadCryptoEncryptBody: 明文字符串 → 加密信封 JSON 串 {"body":"base64(IV||密文||MAC)"}
export function payloadCryptoEncryptBody(key, plaintext) {
  assertLib()
  const {CryptoJS, AES, Utf8, Base64, HmacSHA256} = lib
  const {aesKey, macKey} = splitAuthAESKey(key)
  // AES-256-CBC-PKCS7（cipher-core 默认 mode/padding 即 CBC/Pkcs7，此处显式声明与后端对齐）
  const iv = bytesToWordArray(randomBytes(16))
  const encrypted = AES.encrypt(Utf8.parse(plaintext), aesKey, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  const body = iv.clone().concat(encrypted.ciphertext) // IV||密文
  const mac = HmacSHA256(body, macKey) // MAC 覆盖 IV||密文
  return JSON.stringify({body: Base64.stringify(body.clone().concat(mac))})
}

/// payloadCryptoDecryptBody: 信封 body 字段（base64）→ 明文字符串，MAC 校验失败抛错
export function payloadCryptoDecryptBody(key, b64Body) {
  assertLib()
  const {CryptoJS, AES, Utf8, Base64, HmacSHA256} = lib
  const {aesKey, macKey} = splitAuthAESKey(key)
  const all = wordArrayToBytes(Base64.parse(b64Body))
  if (all.length < 16 + 32) throw new Error("加密报文长度不足")
  const iv = all.subarray(0, 16)
  const ct = all.subarray(16, all.length - 32)
  const mac = all.subarray(all.length - 32)
  if (ct.length === 0 || ct.length % 16 !== 0) throw new Error("加密报文长度非块对齐")
  const checked = bytesToWordArray(iv).clone().concat(bytesToWordArray(ct))
  if (!timingSafeEqual(wordArrayToBytes(HmacSHA256(checked, macKey)), mac)) {
    throw new Error("报文完整性校验失败")
  }
  // 先验 MAC 再解密（encrypt-then-MAC，与后端一致，防 padding oracle 面）。
  // decrypt 入参须为 CipherParams（内部取 param.ciphertext，裸 WordArray 会解出空）
  const plain = AES.decrypt(lib.CryptoJS.lib.CipherParams.create({ciphertext: bytesToWordArray(ct)}), aesKey, {
    iv: bytesToWordArray(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  return plain.toString(Utf8)
}

/// payloadCryptoDecryptResponse: 按响应头 X-Enc-Payload 就地解密 response.data（原对象被替换）
// 非 1（如 panic 时 Recover 补写的明文错误信封）不动，交给既有错误处理
export function payloadCryptoDecryptResponse(response, enc) {
  if (!enc || !response || !response.headers) return
  const flag = response.headers[EncPayloadHeader.toLowerCase()]
  if (String(flag) !== "1") return
  const body = response.data && response.data.body
  if (typeof body !== "string") return
  const plain = payloadCryptoDecryptBody(enc.key, body)
  try {
    response.data = JSON.parse(plain)
  } catch {
    response.data = plain
  }
}

/// payloadCryptoIsDecryptFailResp: 响应是否为后端「报文解密失败」（密钥对不上，多为服务端重启换钥）
export function payloadCryptoIsDecryptFailResp(data) {
  return (
    !!data &&
    data.result !== 0 &&
    typeof data.message === "string" &&
    data.message.indexOf(DECRYPT_FAIL_MSG) >= 0
  )
}
