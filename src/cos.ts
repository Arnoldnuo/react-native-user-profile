/* eslint-disable prettier/prettier */
// import Cos from 'react-native-cos-sdk';
import COS from 'cos-js-sdk-v5';

interface UploadAvatarOptions {
  avatarFile: string,
  cosTmpCredential_url: string,
  bucket: string,
  region: string,
  jwt: string,
}

const getCosTmpCredential = async (url: string, jwt: string) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${jwt}`);
  const requestOptions = { method: "GET", headers: myHeaders };
  const response = await fetch(url, requestOptions)
  return (await response.json()).data;
};

export const uploadAvatarToCos = async (options: UploadAvatarOptions) => {
  const { cosTmpCredential_url, jwt, avatarFile, bucket, region } = options;
  const cosCred = await getCosTmpCredential(cosTmpCredential_url, jwt);
  const coskey = `${cosCred.avatarCosKeyPrefix}.${avatarFile.split('.').at(-1)}`
  const response = await fetch(avatarFile);
  const content = await response.blob();

  const cosClient = new COS({
    getAuthorization: (options, callback) => {
      callback({
        TmpSecretId: cosCred.credentials.tmpSecretId,
        TmpSecretKey: cosCred.credentials.tmpSecretKey,
        SecurityToken: cosCred.credentials.sessionToken,
        StartTime: cosCred.startTime, // 时间戳，单位秒，如：1580000000
        ExpiredTime: cosCred.expiredTime, // 时间戳，单位秒，如：1580000000
        ScopeLimit: true, // 细粒度控制权
      });
    },
    // @ts-ignore
    Request: (opt, callback) => {
      const { method, url, headers, qs, body, onProcess } = opt;
      (async () => {
        try {
          const response = await fetch(url, { method, headers, body: content });
          callback({ statusCode: response.status, error: response.ok ? null : '请求异常' });
        } catch (error) {
          console.log('auth-api cos Request error:', error);
        }
      })();
    }
  });
  try {
    const result = await cosClient.putObject({
      Bucket: bucket,
      Region: region,
      Key: coskey,
      Body: content
    });
    if (result.statusCode === 200) {
      return coskey;
    }
  } catch (error) {
    console.log('auth-api putObject error:', error);
  }
  return null;
};
