# qcloudsms
a qcloudsms sdk  with es6 class and promise
一个参考腾讯云官方规则封装的更加优雅的短信发送sdk,[官方Demo](https://github.com/qcloudsms/qcloudsms/tree/master/demo/js)

## start 开始使用

```
1、install 安装

npm install qcloudsms --save

2、require 导入

const Qsms=require("qcloudsms")

3、init 初始化

const qsms=new Qsms(idnumber,'key')

4,send SMS 调用接口发送短信

.......

```

## methods
```
//demo public import
const Qsms=require("qcloudsms")
const qsms=new Qsms(idnumber,'key')
```
1. singeSend({
      phoneNumber,
      msg,
      msgType = 0,
      nationCode = "86",
      extend = "",
      ext = ""
    }) 

```
  /**
   * 单发短信
   * @param {string} phoneNumber 手机号 
   * @param {string} msg 短信正文，如果需要带签名，签名请使用【】标注
   * @param {number} msgType 短信类型，0 普通短信，1 营销短信。默认值:0
   * @param {string} nationCode 国家码,默认值:"86"
   * @param {string} extend 扩展字段，默认值:""
   * @param {string} ext 此字段腾讯云后台服务器会按原样在应答中,默认值:""
   */
   
//demo

 qsms.singleSend({
    phoneNumber,
    msg,
    msgType = 0,
    nationCode = "86",
    extend = "",
    ext = ""
  }).then(res=>{
    console.log(res.data)
    if(res.data.result===0){
      // do success
    }else{
      //errors
      //find your error code in this list
      //https://cloud.tencent.com/document/product/382/3771
    }
  })

```

2. singleSendWithParams({
      phoneNumber,
      tpl_id,
      params,
      sign,
      nationCode = "86",
      ext = "",
      extend = ""
    })
  ```
  /**
    * 模板单发短信
    * @param {string} phoneNumber 手机号
    * @param {number} tpl_id 短信模板参数， 详情：https://console.qcloud.com/sms/smsContent 
    * @param {array} params 模板参数数组,元素个数请不要超过模板参数个数
    * @param {string} sign 短信签名
    * @param {string} nationCode 国家码,默认值:"86"
    * @param {string} extend 扩展字段，默认值:""
    * @param {string} ext 此字段腾讯云后台服务器会按原样在应答中,默认值:""
  */

  //demo

    qsms.singleSendWithParam({
        phoneNumber: 176030703,
        params: [12345],
        tpl_id: 4266,
        sign: '远浅君'
      }).then(res => {
            console.log(res.data)
            if(res.data.result===0){
              //  do success
            }else{
              //errors
              //find your error code in this list
              //https://cloud.tencent.com/document/product/382/3771
            }
        })  
  ```
  3. multiSend({
        phoneNumbers,
        msg,
        msgType = 0,
        nationCode = "86",
        extend = "",
        ext = ""
     })
  ```
  /*
  * 群发短信【仅国内,一次不超过200】
  * @param {Array} phoneNumbers 群发手机号数组 
  * @param {string} msg 短信正文，如果需要带签名，签名请使用【】标注
  * @param {number} msgType 短信类型，0 普通短信，1 营销短信。 默认值:0
  * @param {string} nationCode 国家码,默认值:"86"
  * @param {string} extend 扩展字段，默认值:""
  * @param {string} ext 此字段腾讯云后台服务器会按原样在应答中,默认值:""
  */

  //demo
  qsms.multiSend({
      phoneNumbers: [17603070288, 17788770699],
      msg: "您的验证码6789，此验证码10分钟内有效，请勿向他人泄露"
    }).then(res =>{
      console.log(res.data)
      if(res.data.result===0){
        //do success
      }else{
        //errors
        //find your error code in this list
        //https://cloud.tencent.com/document/product/382/3771
      }
    })

  ```
  4. multiSendWithParams({
      phoneNumbers,
      tpl_id,
      params,
      sign,
      nationCode = "86",
      ext = "",
      extend = ""
    }) 

  ```
  /**
    * 模板群发短信【仅国内,一次不超过200】
    * @param {string} phoneNumbers 手机号
    * @param {number} tpl_id 短信模板参数， 详情：https://console.qcloud.com/sms/smsContent 
    * @param {array} params 模板参数数组,元素个数请不要超过模板参数个数
    * @param {string} sign 短信签名
    * @param {string} nationCode 国家码,默认值:"86"
    * @param {string} extend 扩展字段，默认值:""
    * @param {string} ext 此字段腾讯云后台服务器会按原样在应答中,默认值:""
  */
  
  //demo
  qsms.multiSendWithParams({
      phoneNumbers: [17603070288, 17788770668],
      params: [4523],
      tpl_id: 423866,
      sign: '格隆汇'
    }).then(res =>{
        console.log(res.data)
        if(res.data.result===0){
          //do success
          //
        }else{
          //errors
          //find your error code in this list
          //https://cloud.tencent.com/document/product/382/3771
        }
    })

  ```
