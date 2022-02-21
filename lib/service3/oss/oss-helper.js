import {ElMessage} from "element-plus";
import {generateUUID} from "../../utils";
import {configKit} from "../../store";
import {StsGet} from "../../dao/common";
import * as OSS from 'ali-oss'

const sts = {
  client: null,
  expire: undefined,
};

// stsGet:Function
// 注意bucket需要默认设置为私有
async function ossClient() {
  if (!sts.expire || sts.expire.getTime() < new Date().getTime()) {
    const data = await StsGet();
    try {
      sts.client = new OSS({
        region: data.region,
        accessKeyId: data.accessKey,
        accessKeySecret: data.accessKeySecret,
        stsToken: data.stsToken,
        bucket: data.bucket,
      });
      sts.expire = new Date(data.expiration);
    } catch (e) {
      ElMessage.error('oss init error');
    }
  }
  return sts.client;
}

export async function putObjectCommon(file, folder) {
  let pre = 'common/';
  if (folder) {
    pre = pre + folder + '/';
  }
  const key = pre + generateUUID() + file.name.substring( file.name.lastIndexOf('.'));
  await putObject(key, file, true);
  return key;
}

export async function putObjectUserPrivate(uid, file) {
  const key = 'user/' + uid + '/' + generateUUID() + file.name.substring( file.name.lastIndexOf('.'));
  await putObject(key, file);
  return key;
}

export async function putObject(key, file, pub) {
  const client = await ossClient();
  try {
    const res = await client.put(key, file);
    if (pub) { await client.putACL(key, 'public-read'); }
    return res;
  } catch (e) {
    ElMessage.error('上传失败');
    throw e;
  }
}

export async function privateUrl(key) {
  const client = await ossClient();
  return client.signatureUrl(key);
}

export function publicUrl(key) {
  return configKit.ossUrlPrefix + key;
}
