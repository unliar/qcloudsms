const Qsms = require("./index")
const qsms = new Qsms(989, 'bfeiuhdhhadhhe77777202aa')

/*
demo请求成功 示例中的res.data.result===0
{
  result: 0,
  errmsg: 'OK',
  ext: '',
  callid: '。...' 
}
demo请求失败,res.data.result===错误码,错误码链接如下
https://cloud.tencent.com/document/product/382/3771
*/

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
//语音验证码
qsms.sendVoice({
  phoneNumber: 17603070437,
  msg: "876123"
}).then(res => console.log(res.data))

//语音通知
qsms.sendVoicePrompt({
  phoneNumber: 17603070235,
  promptfile: "您好雷锋，您的参会申请已经审核通过，请于11点按时参加会议，期待您的到来。"
}).then(res => console.log(res.data))