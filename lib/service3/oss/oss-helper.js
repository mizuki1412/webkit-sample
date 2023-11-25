import {ElMessage} from "element-plus"
import {generateUUID} from "../../utils"
import {configKit} from "../../store"
import {StsGet} from "../../api/common"
import {uploadProcess} from "../../store/global-message";
// todo 打包后出现 is not a constructor
// import * as OSS from 'ali-oss'

const sts = {
  client: null,
  expire: undefined,
}

// stsGet:Function
// 注意bucket需要默认设置为私有
async function ossClient() {
  if (!sts.expire || sts.expire.getTime() < new Date().getTime()) {
    const data = await StsGet()
    try {
      sts.client = new OSS({
        region: data.region,
        accessKeyId: data.accessKey,
        accessKeySecret: data.accessKeySecret,
        stsToken: data.stsToken,
        bucket: data.bucket,
      })
      sts.expire = new Date(data.expiration)
    } catch (e) {
      console.log(e)
    }
  }
  return sts.client
}

export async function putObjectCommon(file, folder) {
  let pre = "common/"
  if (folder) {
    pre = pre + folder + "/"
  }
  const key =
    pre + generateUUID() + file.name.substring(file.name.lastIndexOf("."))
  await putObject(key, file, true)
  return key
}

export async function putObjectPrivate(file, folder) {
  let pre = "private/"
  if (folder) {
    pre = folder
    if (pre.lastIndexOf("/") !== pre.length - 1) pre += "/"
  }
  const key =
    pre + generateUUID() + file.name.substring(file.name.lastIndexOf("."))
  await putObject(key, file)
  return key
}

export async function putObjectUserPrivate(uid, file) {
  const key =
    "user/" +
    uid +
    "/" +
    generateUUID() +
    file.name.substring(file.name.lastIndexOf("."))
  await putObject(key, file)
  return key
}

export async function putObject(key, file, pub) {
  const client = await ossClient()
  const options = {
    // 获取分片上传进度、断点和返回值。
    progress: (p, cpt, res) => {
      uploadProcess.show = true
      uploadProcess.process = parseFloat((p*100).toFixed(1))
    },
    // 设置并发上传的分片数量。
    parallel: 8,
    // 设置分片大小。默认值为1 MB，最小值为100 KB。
    partSize: 5 * 1024 * 1024,
  };
  try {
    let res
    if(file.size>50*1024*1024){
      res = await client.multipartUpload(key, file, options)
      uploadProcess.show = false
      uploadProcess.process = 0
    }else{
      res = await client.put(key, file)
    }
    if (pub) {
      await client.putACL(key, "public-read")
    }
    return res
  } catch (e) {
    ElMessage.error("上传失败")
    throw e
  }
}

export async function privateUrl(key) {
  const client = await ossClient()
  return client.signatureUrl(key)
}

export function publicUrl(key) {
  return configKit.ossUrlPrefix + key
}
