const crypto = require("crypto");
const axios = require("axios");

class Qsms {
  /**
   * 腾讯云短信的sdk包
   *
   * @param {number} appid 腾讯云的短信应用id
   * @param {string} appkey 腾讯云短信应用key
   */
  constructor(appid, appkey) {
    this.appId = appid;
    this.appKey = appkey;
    this.singleSmsUrl = "https://yun.tim.qq.com/v5/tlssmssvr/sendsms";
    this.multiSmsUrl = "https://yun.tim.qq.com/v5/tlssmssvr/sendmultisms2";
    this.sendvoiceUrl = "https://yun.tim.qq.com/v5/tlsvoicesvr/sendvoice";
    this.sendvoicepromptUrl =
      "https://yun.tim.qq.com/v5/tlsvoicesvr/sendvoiceprompt";
    this.getStatusUrl = "https://yun.tim.qq.com/v5/tlssmssvr/pullstatus";
  }
  /**
   * 获取一个随机数和当前时间戳(秒)组成对象
   * @returns {object} obj
   * @returns {number} obj.time
   * @returns {number} obj.random
   *
   */
  static getRandom() {
    const random = Math.floor(Math.random() * 99999);
    const time = Math.floor(Date.now() / 1000);
    return {
      random,
      time
    };
  }
  /**
   * 生成请求的随机凭证
   *
   * @param {number} random 随机数
   * @param {number} time 当前时间戳
   * @param {array} phoneNumbers 手机号组成的数组
   * @returns {string}
   */
  getSig(random, time, phoneNumbers) {
    const strPhonenumbers = phoneNumbers.join(",");
    const toSign = `appkey=${this.appKey}&random=${random}&time=${time}&mobile=${strPhonenumbers}`;
    return crypto
      .createHash("sha256")
      .update(toSign, "utf-8")
      .digest("hex");
  }
  /**
   * 普通单发短信
   *
   * @param {Object} obj
   * @param {string} obj.phoneNumber 手机号
   * @param {string} obj.msg 短信内容
   * @param {string} [obj.nationCode = "86"] 手机号区域代码 默认86
   * @param {number} [obj.msgType = 0] 短信类型默认0普通短信,1为营销短信
   * @param {string} [obj.extend = ''] 短信码号扩展号，格式为纯数字串，其他格式无效。
   * @param {string} [obj.ext = ''] 用户的 session 内容，腾讯 server 回包中会原样返回，可选字段，不需要就填空
   * @returns {Promise}
   */
  singleSend({
    phoneNumber,
    msg,
    msgType = 0,
    nationCode = "86",
    extend = "",
    ext = ""
  }) {
    const { random, time } = Qsms.getRandom();

    const nationcode = nationCode.toString();
    const mobile = phoneNumber.toString();
    const type = Number(msgType);
    const sig = this.getSig(random, time, [mobile]);
    const smsBody = {
      tel: {
        nationcode,
        mobile
      },
      type,
      msg,
      sig,
      time,
      extend,
      ext
    };
    return axios({
      method: "POST",
      url: `${this.singleSmsUrl}?sdkappid=${this.appId}&random=${random}`,
      data: JSON.stringify(smsBody)
    });
  }

  /**
   * 参数模板单发短信
   *
   * @param {Object} obj
   * @param {string} obj.phoneNumber 手机号
   * @param {number} obj.tpl_id 短信模板id
   * @param {array}  obj.params 模板参数组成的数组
   * @param {string} obj.sign 短信签名比如
   * @param {string} [obj.nationCode = "86"] 手机号区域代码 默认86
   * @param {string} [obj.extend = ''] 短信码号扩展号，格式为纯数字串，其他格式无效。
   * @param {string} [obj.ext = ''] 用户的 session 内容，腾讯 server 回包中会原样返回，可选字段，不需要就填空
   * @returns {Promise}
   */
  singleSendWithParams({
    phoneNumber,
    tpl_id,
    params,
    sign,
    nationCode = "86",
    ext = "",
    extend = ""
  }) {
    const { random, time } = Qsms.getRandom();
    const nationcode = nationCode.toString();
    tpl_id = Number(tpl_id);
    const mobile = phoneNumber.toString();
    const sig = this.getSig(random, time, [mobile]);
    const smsBody = {
      tel: {
        nationcode,
        mobile
      },
      sign,
      tpl_id,
      params,
      sig,
      time,
      extend,
      ext
    };
    return axios({
      method: "POST",
      url: `${this.singleSmsUrl}?sdkappid=${this.appId}&random=${random}`,
      data: JSON.stringify(smsBody)
    });
  }

  /**
   * 普通群发短信
   *
   * @param {Object} obj
   * @param {array} obj.phoneNumbers 手机号组成的数组
   * @param {string} obj.msg 短信内容
   * @param {number} [obj.msgType = 0] 短信类型默认0普通短信,1为营销短信
   * @param {string} [obj.nationCode = "86"] 手机号区域代码 默认86
   * @param {string} [obj.extend = ''] 短信码号扩展号，格式为纯数字串，其他格式无效。
   * @param {string} [obj.ext = ''] 用户的 session 内容，腾讯 server 回包中会原样返回，可选字段，不需要就填空
   * @returns {Promise}
   */
  multiSend({
    phoneNumbers,
    msg,
    msgType = 0,
    nationCode = "86",
    extend = "",
    ext = ""
  }) {
    const { random, time } = Qsms.getRandom();
    const sig = this.getSig(random, time, [...phoneNumbers]);
    const type = Number(msgType);
    const nationcode = nationCode.toString();
    const tel = phoneNumbers.map(item => {
      return {
        nationcode,
        mobile: item.toString()
      };
    });
    const smsBody = {
      tel,
      type,
      msg,
      sig,
      time,
      extend,
      ext
    };
    return axios({
      method: "POST",
      url: `${this.multiSmsUrl}?sdkappid=${this.appId}&random=${random}`,
      data: JSON.stringify(smsBody)
    });
  }

  /**
   * 参数模板群发短信
   *
   * @param {Object} obj
   * @param {array}  obj.phoneNumbers 手机号组成的数组
   * @param {number} obj.tpl_id 短信模板id
   * @param {array}  obj.params 模板参数组成的数组
   * @param {string} obj.sign 短信签名比如
   * @param {string} [obj.nationCode = "86"] 手机号区域代码 默认86
   * @param {string} [obj.extend = ''] 短信码号扩展号，格式为纯数字串，其他格式无效。
   * @param {string} [obj.ext = ''] 用户的 session 内容，腾讯 server 回包中会原样返回，可选字段，不需要就填空
   * @returns {Promise}
   */
  multiSendWithParams({
    phoneNumbers,
    tpl_id,
    params,
    sign,
    nationCode = "86",
    ext = "",
    extend = ""
  }) {
    const { random, time } = Qsms.getRandom();
    const sig = this.getSig(random, time, [...phoneNumbers]);
    const nationcode = nationCode.toString();
    tpl_id = Number(tpl_id);
    const tel = phoneNumbers.map(item => {
      return {
        nationcode,
        mobile: item.toString()
      };
    });
    const smsBody = {
      tel,
      sign,
      tpl_id,
      sig,
      params,
      time,
      extend,
      ext
    };
    return axios({
      method: "POST",
      url: `${this.multiSmsUrl}?sdkappid=${this.appId}&random=${random}`,
      data: JSON.stringify(smsBody)
    });
  }

  /**
   * 发送语音通知
   *
   * @param {Object} obj
   * @param {string} obj.phoneNumber 手机号
   * @param {string} obj.promptfile 语音内容
   * @param {string} [obj.nationCode = "86"] 手机号区域代码 默认86
   * @param {number} [obj.prompttype = 2] 语音类型 目前固定为2
   * @param {string} [obj.playtimes = 2] 播放次数。
   * @param {string} [obj.ext = ''] 用户的 session 内容，腾讯 server 回包中会原样返回，可选字段，不需要就填空
   * @returns {Promise}
   */
  sendVoicePrompt({
    phoneNumber,
    promptfile,
    prompttype = 2,
    nationCode = "86",
    playtimes = 2,
    ext = ""
  }) {
    const { random, time } = Qsms.getRandom();
    const mobile = phoneNumber.toString();
    const nationcode = nationCode.toString();
    const sig = this.getSig(random, time, [mobile]);
    const tel = {
      nationcode,
      mobile
    };
    const voiceBody = {
      tel,
      prompttype,
      promptfile,
      playtimes,
      sig,
      time,
      ext
    };
    return axios({
      method: "POST",
      url: `${this.sendvoicepromptUrl}?sdkappid=${this.appId}&random=${random}`,
      data: JSON.stringify(voiceBody)
    });
  }

  /**
   * 发送语音验证码
   *
   * @param {Object} obj
   * @param {string} obj.phoneNumber 手机号
   * @param {string} obj.msg 语音验证码
   * @param {string} [obj.nationCode = "86"] 手机号区域代码 默认86
   * @param {string} [obj.playtimes = 2] 播放次数。
   * @param {string} [obj.ext = ''] 用户的 session 内容，腾讯 server 回包中会原样返回，可选字段，不需要就填空
   * @returns {Promise}
   */
  sendVoice({ phoneNumber, msg, playtimes = 2, nationCode = "86", ext = "" }) {
    const { random, time } = Qsms.getRandom();
    const mobile = phoneNumber.toString();
    const nationcode = nationCode.toString();
    const sig = this.getSig(random, time, [mobile]);
    const tel = {
      nationcode,
      mobile
    };
    const voiceBody = {
      tel,
      msg,
      playtimes,
      sig,
      time,
      ext
    };
    return axios({
      method: "POST",
      url: `${this.sendvoiceUrl}?sdkappid=${this.appId}&random=${random}`,
      data: JSON.stringify(voiceBody)
    });
  }
}

module.exports = Qsms;
