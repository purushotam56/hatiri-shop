import Otp from '#models/otp'
import { ModelColumnsType } from '#types/common'
import { ISendOtp, IVerifyOtp, OtpVerificationFor } from '#types/otp'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'
import MailService from './mail_service.js'
import SMSService from './sms_service.js'
import env from '#start/env'
import { testUsers } from '#types/user'

export default class OtpService {
  private generateOTP(len?: number) {
    if (!len || len < 4 || len > 12) {
      len = 6
    }
    const digits = '0123456789'
    let OTP = ''
    for (let i = 0; i < len; i++) {
      OTP += digits[Math.floor(Math.random() * 10)]
    }
    return OTP
  }

  private async saveOtp(obj: ISendOtp, otpVerificationFor: OtpVerificationFor) {
    const otp = this.generateOTP()
    const otpHash = await hash.make(otp)
    const createObj: ModelColumnsType<
      typeof Otp,
      'otpVerificationFor' | 'hash' | 'userId' | 'expiresAt'
    > = {
      otpVerificationFor,
      hash: otpHash,
      expiresAt: DateTime.now().plus({ minutes: 10 }),
    }
    if (obj.userId) {
      createObj.userId = obj.userId
    }
    await Otp.create(createObj)
    return otp
  }

  async sendOtpMobile(obj: ISendOtp) {
    try {
      const otp = await this.saveOtp(obj, OtpVerificationFor.mobile)
      const smsService = new SMSService()
      smsService.sendSignUpOtpMobile({
        mobile: obj.mobile,
        otp,
      })
    } catch (e) {
      console.log(e)
    }
  }

  async sendOtpEmail(obj: ISendOtp) {
    try {
      const otp = await this.saveOtp(obj, OtpVerificationFor.email)
      const mailservice = new MailService()
      mailservice.sendSignUpOtpMail({
        otp,
        email: obj.email,
        fullName: obj.fullName as string,
      })
    } catch (e) {
      console.log(e)
    }
  }

  async verifyOtp(obj: IVerifyOtp, inputOtp: string) {
    try {
      let whereCol: string | undefined
      let whereColVal: number | undefined
      let data: any = {}

      if (obj.userId) {
        whereCol = 'user_id'
        whereColVal = obj.userId
      }
      if (!whereCol || !whereColVal) {
        return new Error('please provide module id for otp verification')
      }
      const otpData = await Otp.query()
        .where(whereCol, whereColVal)
        .where('otpVerificationFor', obj.otpVerificationFor)
        .where('expiresAt', '>=', DateTime.now().toISO())
        .where('isVerified', '=', false)
        .orderBy('id', 'desc')
        .firstOrFail()
      let verified =
        (env.get('TEST_OTP') === inputOtp &&
          [
            ...Object.values(testUsers),
            {
              email: env.get('APP_USER_EMAIL'),
              mobile: env.get('APP_USER_MOBILE'),
            },
          ].some((u) => obj.mobileOrEmail && [u.email, u.mobile].includes(obj.mobileOrEmail))) ||
        env.get('MASTER_OTP') === inputOtp
      if (!verified) {
        verified = await hash.verify(otpData.hash, inputOtp)
      }
      if (verified) {
        otpData.isVerified = true
        otpData.save()
        if (data) {
          if (obj.otpVerificationFor === OtpVerificationFor.mobile) {
            data.isMobileVerified = true
          }
          if (obj.otpVerificationFor === OtpVerificationFor.email) {
            data.isEmailVerified = true
          }
          data.save()
        }
      }
      return verified
    } catch (e) {
      console.log(e)
      return null
    }
  }
}
