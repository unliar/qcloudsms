const Qsms = require("./index")
const qsms = new Qsms(99999999, 'key')
//单发短信
qsms.singleSend({
  phoneNumber: 17603070232,
  msg: '您的验证码6789，此验证码10分钟内有效，请勿向他人泄露'
}).then(res => console.log(res.data))
//群发短信
qsms.multiSend({
  phoneNumbers: [17603070232, 17788770692],
  msg: '您的验证码6789，此验证码10分钟内有效，请勿向他人泄露'
}).then(res => console.log(res.data))
//参数单发
qsms.singleSendWithParams({
  phoneNumber: 17603070231,
  params: [12345],
  tpl_id: 42866,
  sign: '格x汇'
}).then(res => console.log(res.data))
//参数群发
qsms.multiSendWithParams({
  phoneNumbers: [17603070231, 17788770692],
  params: [12345],
  tpl_id: 42866,
  sign: '格x汇'
}).then(res => console.log(res.data))