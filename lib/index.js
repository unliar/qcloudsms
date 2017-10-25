const crypto = require("crypto")
const axios = require("axios")

class Qsms {
  constructor(appid, appkey) {
    this.appId = appid
    this.appKey = appkey
    this.singleSmsUrl = "https://yun.tim.qq.com/v5/tlssmssvr/sendsms"
    this.multiSmsUrl = "https://yun.tim.qq.com/v5/tlssmssvr/sendmultisms2"

  }
  getSig(random, curTime, phoneNumbers) {
    const strPhonenumbers = phoneNumbers.join(",")
    const toSign = `appkey=${this.appKey}&random=${random}&time=${curTime}&mobile=${strPhonenumbers}`
    return crypto.createHash("sha256").update(toSign, "utf-8").digest('hex')
  }
  /**
   * 单发短信接口
    
   * @param {string} phoneNumber 手机号 
   * @param {string} msg 短信正文，如果需要带签名，签名请使用【】标注
   * @param {number} msgType 短信类型，0 普通短信，1 营销短信。默认值:0
   * @param {string} nationCode 国家码,默认值:"86"
   * @param {string} extend 扩展字段，默认值:""
   * @param {string} ext 此字段腾讯云后台服务器会按原样在应答中,默认值:""
   */

  singleSend({
    phoneNumber,
    msg,
    msgType = 0,
    nationCode = "86",
    extend = "",
    ext = ""
  }) {
    const random = Math.floor(Math.random() * 99999)
    const time = Math.floor(Date.now() / 1000)
    nationCode = nationCode.toString()
    const mobile = phoneNumber.toString()
    const type = Number(msgType)
    const sig = this.getSig(random, time, [mobile])
    const smsBody = {
      tel: {
        nationCode,
        mobile
      },
      type,
      msg,
      sig,
      time,
      extend,
      ext
    }
    return axios({
      method: "POST",
      url: `${this.singleSmsUrl}?sdkappid=${this.appId}&random=${random}`,
      data: JSON.stringify(smsBody)
    })


  }

  singleSendWithParams({
    phoneNumber,
    tpl_id,
    params,
    sign,
    nationCode = "86",
    ext = "",
    extend = ""

  }) {
    const random = Math.floor(Math.random() * 99999)
    const time = Math.floor(Date.now() / 1000)
    nationCode = nationCode.toString()
    tpl_id = Number(tpl_id)
    const mobile = phoneNumber.toString()
    const sig = this.getSig(random, time, [mobile])
    const smsBody = {
      tel: {
        nationCode,
        mobile
      },
      sign,
      tpl_id,
      params,
      sig,
      time,
      extend,
      ext
    }
    return axios({
      method: "POST",
      url: `${this.singleSmsUrl}?sdkappid=${this.appId}&random=${random}`,
      data: JSON.stringify(smsBody)
    })
  }

  multiSend({
    phoneNumbers,
    msg,
    msgType = 0,
    nationCode = "86",
    extend = "",
    ext = ""
  }) {
    const random = Math.floor(Math.random() * 99999)
    const time = Math.floor(Date.now() / 1000)
    const sig = this.getSig(random, time, [...phoneNumbers])
    const type = Number(msgType)
    const tel = phoneNumbers.map(item => {
      return {
        nationCode,
        mobile: item.toString()
      }
    })
    const smsBody = {
      tel,
      type,
      msg,
      sig,
      time,
      extend,
      ext
    }
    return axios({
      method: "POST",
      url: `${this.multiSmsUrl}?sdkappid=${this.appId}&random=${random}`,
      data: JSON.stringify(smsBody)
    })
  }
  multiSendWithParams({
    phoneNumbers,
    tpl_id,
    params,
    sign,
    nationCode = "86",
    ext = "",
    extend = ""
  }) {
    const random = Math.floor(Math.random() * 99999)
    const time = Math.floor(Date.now() / 1000)
    const sig = this.getSig(random, time, [...phoneNumbers])
    nationCode = nationCode.toString()
    tpl_id = Number(tpl_id)
    const tel = phoneNumbers.map(item => {
      return {
        nationCode,
        mobile: item.toString()
      }
    })
    const smsBody = {
      tel,
      sign,
      tpl_id,
      sig,
      params,
      time,
      extend,
      ext
    }
    return axios({
      method: "POST",
      url: `${this.multiSmsUrl}?sdkappid=${this.appId}&random=${random}`,
      data: JSON.stringify(smsBody)
    })
  }
}


module.exports = Qsms