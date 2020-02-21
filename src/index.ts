import { createHash } from "crypto";
// 单发地址
const singleSmsUrl = "https://yun.tim.qq.com/v5/tlssmssvr/sendsms";
// 多发地址
const multiSmsUrl = "https://yun.tim.qq.com/v5/tlssmssvr/sendmultisms2";
// 语音单消息地址
const sendvoiceUrl = "https://yun.tim.qq.com/v5/tlsvoicesvr/sendvoice";
// 语音推广地址
const sendvoicepromptUrl =
  "https://yun.tim.qq.com/v5/tlsvoicesvr/sendvoiceprompt";
const getStatusUrl = "https://yun.tim.qq.com/v5/tlssmssvr/pullstatus";

interface SendRequest {
  phoneNumbers: string[];
  msg: string;
  msgType: number;
  nationCode: string;
  extend: string;
  ext: string;
}

/**
 * 获取一个随机数和当前时间戳(秒)组成对象
 */
const getRandom = () => {
  const randomNum = Math.floor(Math.random() * 99999);
  const timestamp = Math.floor(Date.now() / 1000);
  return {
    randomNum,
    timestamp
  };
};
/**
 *
 * @param appId 腾讯云的短信应用id
 * @param appKey 腾讯云短信应用key
 */
const QCloudSMS = (appId: string, appKey: string) => {
  /**
   * 生成请求的所及凭证
   * @param phoneNumbers 手机号组成的数组
   */
  const getSig = (phoneNumbers: string[]) => {
    const str = phoneNumbers.join(",");
    const r = getRandom();
    const toSign = `appkey=${appKey}&random=${r.randomNum}&time=${r.timestamp}&mobile=${str}`;
    return createHash("sha256")
      .update(toSign, "utf8")
      .digest("hex");
  };
};

export default QCloudSMS;
