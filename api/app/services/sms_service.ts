// app/Services/SMSService.ts
import env from '#start/env'
import { ISendCredentialsMobile, ISendPasswordMobile, ISendSignUpOtpMobile } from '#types/sns'
import { testUsers } from '#types/user'
import { SNS } from '@aws-sdk/client-sns'
import axios from 'axios'

export default class SMSService {
  private sns: SNS
  private triggerSms = env.get('SEND_SMS')
  private mobileMessageAuth = Buffer.from(
    env.get('MOBILE_MESSAGE_API') + ':' + env.get('MOBILE_MESSAGE_PASSWORD')
  ).toString('base64')

  constructor() {
    const accessKeyId = env.get('AWS_ACCESS_KEY_ID')
    const secretAccessKey = env.get('AWS_SECRET_ACCESS_KEY')
    const region = env.get('AWS_REGION')

    this.sns = new SNS({
      apiVersion: '2010-03-31',
      region: region || 'us-east-1',
      credentials:
        accessKeyId && secretAccessKey
          ? {
              accessKeyId,
              secretAccessKey,
            }
          : undefined,
    })
  }

  async sendSMS(mobile: string, message: string) {
    if (mobile.startsWith('+61') || mobile.startsWith('61')) {
      const messageData = {
        messages: [
          {
            to: mobile,
            message: message,
            sender: 'PRPRLY',
            custom_ref: 'tracking001',
          },
        ],
      }

      axios
        .post('https://api.mobilemessage.com.au/v1/messages', messageData, {
          headers: {
            'Authorization': `Basic ${this.mobileMessageAuth}`,
            'Content-Type': 'application/json',
          },
        })
        .then((response: any) => {
          console.info(response.data)
        })
        .catch((error: any) => {
          console.error('Error:', error.response?.data || error.message)
        })
    } else {
      await this.sns.publish({
        Message: message,
        PhoneNumber: mobile,
      })
    }
  }

  async sendSignUpOtpMobile(data: ISendSignUpOtpMobile) {
    if (!this.triggerSms) return
    if (
      Object.values(testUsers)
        .map((usr) => usr.mobile)
        .includes(data.mobile)
    )
      return
    const message = `OTP for hatiri login is ${data.otp}`
    var params = {
      Message: message,
      PhoneNumber: data.mobile,
    }
    await this.sendSMS(params.PhoneNumber, params.Message)
  }

  async sendPasswordMobile(data: ISendPasswordMobile) {
    if (!this.triggerSms) return
    if (
      Object.values(testUsers)
        .map((usr) => usr.mobile)
        .includes(data.mobile)
    )
      return
    const message = `Hi ${data.name}, Here are the credentials to login in hatiri Platform. 
    username: ${data.email}
    password: ${data.password}
    url: https://admin-dev.hatiri.tech
    `
    // const message = `Password for hatiri login is ${data.password}, `
    var params = {
      Message: message,
      PhoneNumber: data.mobile,
    }
    await this.sendSMS(params.PhoneNumber, params.Message)
  }

  async sendCredentialsWeb(data: ISendPasswordMobile) {
    if (!this.triggerSms) return
    if (
      Object.values(testUsers)
        .map((usr) => usr.mobile)
        .includes(data.mobile)
    )
      return
    const message = `Hi ${data.name}, Here are the credentials to login in hatiri Platform. 
    username: ${data.email}
    password: ${data.password}
    url: https://admin-dev.hatiri.tech
    `
    var params = {
      Message: message,
      PhoneNumber: data.mobile,
    }
    await this.sendSMS(params.PhoneNumber, params.Message)
  }

  async sendCredentialsMobile(data: ISendCredentialsMobile, appType: 'auditor' | 'owner') {
    if (!this.triggerSms) return
    if (
      Object.values(testUsers)
        .map((usr) => usr.mobile)
        .includes(data.mobile)
    )
      return
    const auditorMessage = `Hi ${data.name}, Here is the link to download hatiri Auditor App. 
    App Store: https://apps.apple.com/us/app/hatiri-auditor/id6478364981
    Play Store: https://play.google.com/store/apps/details?id=com.app.propedge.auditor
    `
    const ownerMessage = `Hi ${data.name}, Here is the link to download hatiri Owner App. 
    App Store: https://apps.apple.com/us/app/hatiri/id6478366187
    Play Store: https://play.google.com/store/apps/details?id=com.app.propedge
    `
    var params = {
      Message: appType === 'auditor' ? auditorMessage : ownerMessage,
      PhoneNumber: data.mobile,
    }
    await this.sendSMS(params.PhoneNumber, params.Message)
  }

  async sendNewAppAvailableMsg(data: ISendCredentialsMobile, appType: 'auditor' | 'owner') {
    if (!this.triggerSms) return
    if (
      Object.values(testUsers)
        .map((usr) => usr.mobile)
        .includes(data.mobile)
    )
      return
    const auditorMessage = `Hi ${data.name}, \nA new version of hatiri Auditor App is now available! \nHere is the link to download the latest version, \n\nApp Store: https://tinyurl.com/4sz3ynj4 \nGoogle Play: https://tinyurl.com/3fjw6mkr \n\nImportant Note: The older version of the app will stop working so please download the latest App`
    const ownerMessage = `Hi ${data.name}, \nA new version of hatiri Owner App is now available! \nHere is the link to download the latest version, \n\nApp Store: https://tinyurl.com/35sax3wz \nGoogle Play: https://tinyurl.com/mr2d9w37 \n\nImportant Note: The older version of the app will stop working so please download the latest App`

    var params = {
      Message: appType === 'auditor' ? auditorMessage : ownerMessage,
      PhoneNumber: data.mobile,
    }

    console.log(params)
    return await this.sendSMS(params.PhoneNumber, params.Message)
  }

  async sendPendingOwnerApprovalMsg(data: ISendCredentialsMobile) {
    if (!this.triggerSms) return
    if (
      Object.values(testUsers)
        .map((usr) => usr.mobile)
        .includes(data.mobile)
    )
      return

    const msg = `Hi ${data.name}, We hereby request you to kindly action the ‘pending owner feedback’ defects on urgent basis. We will consider these defects as closed if no action is taken within 7 days.\nKind Regards\nhatiri Team`

    var params = {
      Message: msg,
      PhoneNumber: data.mobile,
    }

    console.log(params)
    return await this.sendSMS(params.PhoneNumber, params.Message)
  }
}
