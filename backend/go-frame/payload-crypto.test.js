import {describe, expect, it} from "vitest"

import {
  EncKeyHeader,
  EncPayloadHeader,
  payloadCryptoDecryptBody,
  payloadCryptoDecryptResponse,
  payloadCryptoDisable,
  payloadCryptoEnable,
  payloadCryptoEncryptBody,
  payloadCryptoEnsureLib,
  payloadCryptoIsDecryptFailResp,
  payloadCryptoMatch,
} from "./payload-crypto"
import {JSEncrypt} from "jsencrypt"

// 固定测试向量：go-frame tmpinterop 一次性生成（cryptokit.AuthAESEncrypt，
// key 为 64B 确定性材料，明文含中文/emoji 区外字符/HTML 特殊字符），固化以锁定
// 前后端协议兼容——后端协议变更时此用例会失败。
const goVector = {
  keyB64: "CxIZICcuNTxDSlFYX2ZtdHuCiZCXnqWss7rByM/W3eTr8vkABw4VHCMqMTg/Rk1UW2JpcHd+hYyTmqGor7a9xA==",
  plain: '{"result":0,"message":"","data":{"username":"测试用户é中","list":[{"id":1,"name":"中文&<script>"}],"total":3},"total":3}',
  bodyB64:
    "4GQtQSvi3GV8MfNX7mvfVQiArX8oKldez9wjJCiY+tydkJzPiHc5aN/Mgmb/YLJ75PNvkX9ExIYO4HPnXdfXXtFPevf3J+8iSxGLwUj/To3f50FbFie5ygJSTBSVdDnUT0Cvs2+FOyGDBYnt+sOkHCJOdOGgGFFda9slfuyQFrdkBasyeTnu7jsJgQLpPBGtMJooo/v6fPMNqNpygsEs8Vm4xDroc41WlYcBXUgMeGPyjVTWWfz1sjcfxl4SHOy5",
}

// 一次性生成的测试专用 RSA 密钥对（仅用于本测试，非生产密钥）
const testPubPem = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6lzip2ehFfgM71W+LPBB
tWj5NGRLnDIN9gLFhySrIaayEtPCWXIDgYiYz0SKmWw834RKknfTu+vybzIsTdLv
zH1qEWduNiO58okq1ifXEy2OZQ2GqgH9LQakK++2u1UZvTLyES5yBLJ0xv4zM31T
1BJfbEJnFKGVP0MDS7adNA0Lph9fOlwMEsshJpC9u/SypdaosjHxbKSKgImEu2TT
Qk5QCom7QejWLTitQAIsZ3GSMnt94pFTXSsqSB1/Hu/YpbvH3BbNHTEzWCyiz2IG
qlnKfaglMDdI46aqBPjldm6w49cv2sEU46gYjrx6eJMTsbOrpijxZoLqVzdFS6CN
0QIDAQAB
-----END PUBLIC KEY-----`
const testPrivPem = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDqXOKnZ6EV+Azv
Vb4s8EG1aPk0ZEucMg32AsWHJKshprIS08JZcgOBiJjPRIqZbDzfhEqSd9O76/Jv
MixN0u/MfWoRZ242I7nyiSrWJ9cTLY5lDYaqAf0tBqQr77a7VRm9MvIRLnIEsnTG
/jMzfVPUEl9sQmcUoZU/QwNLtp00DQumH186XAwSyyEmkL279LKl1qiyMfFspIqA
iYS7ZNNCTlAKibtB6NYtOK1AAixncZIye33ikVNdKypIHX8e79ilu8fcFs0dMTNY
LKLPYgaqWcp9qCUwN0jjpqoE+OV2brDj1y/awRTjqBiOvHp4kxOxs6umKPFmgupX
N0VLoI3RAgMBAAECggEAGcvdkDWiOoEnff8/GUKHc7Nj8steCImjQG1FAWoc2Bhk
Hhm8Q7d+q/cKyDha1SZf0O6GfXa+Zz9CW9D2+sikEoB0zgjyIvgYaJoxN99XbMn6
lCRCqrCLWzW8Q7B1ZEtVXkj0R3CIUPy08+OuY8ArcPq7ZswsUniyrS2azZkCgWRU
ST6aRTqmxKIAQtivkWAc5iZ+5X3gC30P4IGyZ2SHw46dlqL4RQhugpIKmFZdG7rJ
U1EnATdaPBKGTOU/cmA2d9msZYkuq0O0LFZ+rkS14eagcznXvtMR3GMt2zWBt5+C
qdM5BXO1wNfkzRgB+8pqOrBUneVY8lWciRODsFqw7QKBgQDzvuOX7KwTaIeC977d
r6iRQ47EnfIr3fpsdTaSmirEM1a5v2xX0f2mhEaWyDcuNf/HKG1zRp5eOjZ5TCEl
Q6q0Mq/Y6+pXgtLppI8mJsZ+HPO0lyXusrXRCt15S/6FqeA/hc22EAiUdS74kf8w
wLCiwNaIo4QIMVJ6+R5SAsq9fwKBgQD2JTw+yU6vvRTA617X3yrwb7R7r2NP1H1a
kSEuxqO8svfgrfcQg1Ramb+8aLxPBSWrQwgsqi3RBKVHeY8bL5cdIvfoxIO0rF8K
kQ+8D46HDU3Gh8e/P/nLzre4sxX/nA9EQwLJJ6+HGHNRR+LzNIpY0SoxxvdU/CDH
C9uTb4D8rwKBgAxv4Q0PdnhHDSMRoRuOqvs+hzphFMpIOU7vbClu1F/Ofs5bhhu1
C0xD05Y+ARLKjpKK7YrEP7BvJ/hoegh8u2kWbQKUhxCQDFL/oo4/zEEDGSxNyhGz
7LMN6t8VkZcgY+DZ4vU3PDjXAd6NFIhYTKsBS/EM5t/EJIFB1No6aj3hAoGANZpm
REYSnLLQkjKvtNMkxreM1mKbfgcIRXDViRo5Dh7rXEKGS1JOTGyvFJi6aXr1eRZf
8VoeICai163hPEpg3jd/RXGGPRJMoEB27L12jHKZPWLUXRHRlFCwMcjOQZv6tyLg
uG2sC/+HHWxKQCxw9GaYib6KnjdJ7A7pAnKF5IECgYEA8tum1Y7KTF68qgaOBuoP
VbXQfDoJ9uz91czDSnRi/ARV6K7N0e5uW6aH2qLU33YRzAw/FdYdqBUr3Qtsda4T
EfAw3N4IJBClqJsofBDovOYh7WxHEv64VgjDLnEubMJqFEXdryUU2S5OAUo6rEV1
o0uHmm7X3+IxK0sm2GOLfto=
-----END PRIVATE KEY-----`

function b64ToBytes(b64) {
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

describe("payload-crypto", () => {
  const key = b64ToBytes(goVector.keyB64)

  it("常量与 go-frame 中间件定义一致", () => {
    expect(EncKeyHeader).toBe("X-Enc-Key")
    expect(EncPayloadHeader).toBe("X-Enc-Payload")
  })

  it("解密 go-frame AuthAESEncrypt 固定向量（协议兼容锚点）", async () => {
    await payloadCryptoEnsureLib()
    expect(payloadCryptoDecryptBody(key, goVector.bodyB64)).toBe(goVector.plain)
  })

  it("加密/解密往返", async () => {
    await payloadCryptoEnsureLib()
    const plain = '{"username":"测试用户","pwd":"p@ss\'\\"<>&","n":123}'
    const env = JSON.parse(payloadCryptoEncryptBody(key, plain))
    expect(typeof env.body).toBe("string")
    // 信封格式：base64(IV(16)||密文||MAC(32))，密文块对齐
    const raw = b64ToBytes(env.body)
    expect(raw.length).toBeGreaterThan(48)
    expect((raw.length - 48) % 16).toBe(0)
    expect(payloadCryptoDecryptBody(key, env.body)).toBe(plain)
  })

  it("MAC 篡改被拒绝", async () => {
    await payloadCryptoEnsureLib()
    const env = JSON.parse(payloadCryptoEncryptBody(key, "hello"))
    const bytes = b64ToBytes(env.body)
    bytes[bytes.length - 1] ^= 0xff
    const tampered = btoa(String.fromCharCode(...bytes))
    expect(() => payloadCryptoDecryptBody(key, tampered)).toThrow(/完整性/)
  })

  it("密钥材料长度非法报错", async () => {
    await payloadCryptoEnsureLib()
    expect(() => payloadCryptoEncryptBody(new Uint8Array(32), "x")).toThrow(/64/)
  })

  it("jsencrypt 解析 PKIX/SPKI 公钥并回环密钥材料", async () => {
    const material = b64ToBytes(goVector.keyB64)
    const inner = btoa(String.fromCharCode(...material))
    const rsa = new JSEncrypt()
    rsa.setPublicKey(testPubPem)
    const encKey = rsa.encrypt(inner)
    expect(encKey).toBeTruthy()
    const rsaPriv = new JSEncrypt()
    rsaPriv.setPrivateKey(testPrivPem)
    expect(rsaPriv.decrypt(encKey)).toBe(inner)
  })

  it("payloadCryptoMatch 按 exclude 过滤", () => {
    payloadCryptoEnable({exclude: ["/common/", /^\/sse/]})
    expect(payloadCryptoMatch("/user/login")).toBe(true)
    expect(payloadCryptoMatch("/common/upload")).toBe(false)
    expect(payloadCryptoMatch("/sse/stream")).toBe(false)
    payloadCryptoDisable()
    expect(payloadCryptoMatch("/user/login")).toBe(false)
  })

  it("payloadCryptoDecryptResponse 按 X-Enc-Payload 头解密", async () => {
    await payloadCryptoEnsureLib()
    const envBody = JSON.parse(payloadCryptoEncryptBody(key, JSON.stringify({result: 0, message: "", data: {a: 1}})))
    const resp = {headers: {[EncPayloadHeader.toLowerCase()]: "1"}, data: envBody}
    payloadCryptoDecryptResponse(resp, {key})
    expect(resp.data).toEqual({result: 0, message: "", data: {a: 1}})
    // 无标记头（panic 明文错误信封）不处理
    const plain = {headers: {}, data: {result: 500, message: "boom"}}
    payloadCryptoDecryptResponse(plain, {key})
    expect(plain.data.message).toBe("boom")
    // 无 enc 上下文直接跳过
    const noEnc = {headers: {[EncPayloadHeader.toLowerCase()]: "1"}, data: {body: "x"}}
    expect(() => payloadCryptoDecryptResponse(noEnc, null)).not.toThrow()
  })

  it("payloadCryptoIsDecryptFailResp 识别后端解密失败文案", () => {
    expect(payloadCryptoIsDecryptFailResp({result: 500, message: "报文解密失败"})).toBe(true)
    expect(payloadCryptoIsDecryptFailResp({result: 0, message: "报文解密失败"})).toBe(false)
    expect(payloadCryptoIsDecryptFailResp({result: 500, message: "其他错误"})).toBe(false)
    expect(payloadCryptoIsDecryptFailResp(null)).toBe(false)
  })
})
