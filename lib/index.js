const crypto = require("crypto")
const axios = require("axios")

class Qsms {
  constructor(appid, appkey) {
    this.appId = appid
    this.appKey = appkey
    this.singleSmsUrl = "https://yun.tim.qq.com/v5/tlssmssvr/sendsms"
    this.multiSmsUrl = "https://yun.tim.qq.com/v5/tlssmssvr/sendmultisms2"
    this.sendvoiceUrl = "https://yun.tim.qq.com/v5/tlsvoicesvr/sendvoice"
    this.sendvoicepromptUrl = "https://yun.tim.qq.com/v5/tlsvoicesvr/sendvoiceprompt"
  }

  static getRandom() {
    const random = Math.floor(Math.random() * 99999)
    const time = Math.floor(Date.now() / 1000)
    return {
      random,
      time
    }
  }

  getSig(random, time, phoneNumbers) {
    const strPhonenumbers = phoneNumbers.join(",")
    const toSign = `appkey=${this.appKey}&random=${random}&time=${time}&mobile=${strPhonenumbers}`
    return crypto.createHash("sha256").update(toSign, "utf-8").digest('hex')
  }

  singleSend({
    phoneNumber,
    msg,
    msgType = 0,
    nationCode = "86",
    extend = "",
    ext = ""
  }) {

    const {
      random,
      time
    } = Qsms.getRandom()

    const nationcode = nationCode.toString()
    const mobile = phoneNumber.toString()
    const type = Number(msgType)
    const sig = this.getSig(random, time, [mobile])
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
    const {
      random,
      time
    } = Qsms.getRandom()
    const nationcode = nationCode.toString()
    tpl_id = Number(tpl_id)
    const mobile = phoneNumber.toString()
    const sig = this.getSig(random, time, [mobile])
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
    const {
      random,
      time
    } = Qsms.getRandom()
    const sig = this.getSig(random, time, [...phoneNumbers])
    const type = Number(msgType)
    const nationcode = nationCode.toString()
    const tel = phoneNumbers.map(item => {
      return {
        nationcode,
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
    const {
      random,
      time
    } = Qsms.getRandom()
    const sig = this.getSig(random, time, [...phoneNumbers])
    const nationcode = nationCode.toString()
    tpl_id = Number(tpl_id)
    const tel = phoneNumbers.map(item => {
      return {
        nationcode,
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

  sendVoicePrompt({
    phoneNumber,
    promptfile,
    prompttype = 2,
    nationCode = "86",
    playtimes = 2,
    ext = ""
  }) {
    const {
      random,
      time
    } = Qsms.getRandom()
    const mobile = phoneNumber.toString()
    const nationcode = nationCode.toString()
    const sig = this.getSig(random, time, [mobile])
    const tel = {
      nationcode,
      mobile
    }
    const voiceBody = {
      tel,
      prompttype,
      promptfile,
      playtimes,
      sig,
      time,
      ext
    }
    return axios({
      method: 'POST',
      url: `${this.sendvoicepromptUrl}?sdkappid=${this.appId}&random=${random}`,
      data: JSON.stringify(voiceBody)
    })
  }

  sendVoice({
    phoneNumber,
    msg,
    playtimes = 2,
    nationCode = "86",
    ext = ""
  }) {
    const {
      random,
      time
    } = Qsms.getRandom()
    const mobile = phoneNumber.toString()
    const nationcode = nationCode.toString()
    const sig = this.getSig(random, time, [mobile])
    const tel = {
      nationcode,
      mobile
    }
    const voiceBody = {
      tel,
      msg,
      playtimes,
      sig,
      time,
      ext
    }
    return axios({
      method: 'POST',
      url: `${this.sendvoiceUrl}?sdkappid=${this.appId}&random=${random}`,
      data: JSON.stringify(voiceBody)
    })
  }
}


module.exports = Qsms