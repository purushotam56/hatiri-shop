import env from '#start/env'
import {
  ISignupLeadStatusMail,
  ISuccessInvitationEmail,
  ISendSignUpOtpMail,
  ISendSingupSuccessMail,
  ISendSingupSuccessMailToAdmin,
  IForgotPasswordEmail,
  ISuccessfulChangePasswordEmail,
  ISendOrganisationCreationMail,
} from '#types/mail'
import mail from '@adonisjs/mail/services/main'

export default class MailService {
  fromEmail = env.get('FROM_EMAIL')
  supportEmail = env.get('SUPPORT_EMAIL')
  logoUrl = env.get('LOGO_URL')
  loginUrl = env.get('LOGIN_URL')
  private triggerMail = env.get('SEND_EMAIL')

  async sendSingupSuccessMail(data: ISendSingupSuccessMail) {
    try {
      if (!this.triggerMail) return
      await mail.send((message) => {
        message
          .to(data.email)
          .from(this.fromEmail)
          .subject('Thank you for Signing Up !!')
          .htmlView('email-templates/signupSuccessEmail.edge', {
            name: data.fullName,
            supportEmail: this.supportEmail,
            logoUrl: this.logoUrl,
          })
      })
    } catch (e) {
      console.log(e)
    }
  }
  async sendInvitationMail(data: ISuccessInvitationEmail) {
    try {
      if (!this.triggerMail) return
      await mail.send((message) => {
        message
          .to(data.user.email)
          .from(this.fromEmail)
          .subject(`${data.invitationType} Invitation`)
          .htmlView('invitation.edge', {
            logoUrl: this.logoUrl,
            name: data.user.fullName,
            email: data.user.email,
            invitationType: data.invitationType,
            organisationName: data.organisation?.name,
            role: data.userRole.roleName,
            branchName: data.branch?.name,
            viewInvitationLink: data.viewInvitationLink,
            invitedBy: data.invitedBy,
          })
      })
    } catch (e) {
      console.log(e)
    }
  }
  async sendSingupSuccessMailToAdmin(data: ISendSingupSuccessMailToAdmin) {
    try {
      if (!this.triggerMail) return
      await mail.send((message) => {
        message
          .to(data.email)
          .from(this.fromEmail)
          .subject('Urgent !! New Sign Up Lead')
          .htmlView('email-templates/singupSuccessMailToAdmin.edge', {
            data,
            logoUrl: this.logoUrl,
          })
      })
    } catch (e) {
      console.log(e)
    }
  }
  async sendSignUpOtpMail(data: ISendSignUpOtpMail) {
    try {
      if (!this.triggerMail) return
      await mail.send((message) => {
        message
          .to(data.email)
          .from(this.fromEmail)
          .subject('Your OTP Verification Code')
          .htmlView('email-templates/signUpOtpMail.edge', {
            name: data.fullName,
            otp: data.otp,
            supportEmail: this.supportEmail,
            logoUrl: this.logoUrl,
          })
      })
    } catch (e) {
      console.log(e)
    }
  }
  async sendEmailConfirmationByAccountLead(data: ISignupLeadStatusMail) {
    try {
      if (!this.triggerMail) return
      await mail.send((message) => {
        message
          .to(data.email)
          .from(this.fromEmail)
          .subject('Confirmation of account creation')
          .htmlView('email-templates/confirmationMailByAccountLead.edge', {
            logoUrl: this.logoUrl,
            redirectUrl: this.loginUrl,
          })
      })
    } catch (e) {
      console.log(e)
    }
  }
  async sendEmailRejectionByAccountLead(data: ISignupLeadStatusMail) {
    try {
      if (!this.triggerMail) return
      await mail.send((message) => {
        message
          .to(data.email)
          .from(this.fromEmail)
          .subject('Rejection of account creation')
          .htmlView('email-templates/rejectionMailByAccountLead.edge', {
            name: data.fullName,
            logoUrl: this.logoUrl,
          })
      })
    } catch (e) {
      console.log(e)
    }
  }
  async sendForgotPasswordEmail(data: IForgotPasswordEmail) {
    try {
      if (!this.triggerMail) return
      await mail.send((message) => {
        message
          .to(data.email)
          .from('hatiri Support <' + this.fromEmail + '>')
          .subject('Reset Your Password')
          .htmlView('email-templates/forgotPasswordEmail.edge', {
            logoUrl: this.logoUrl,
            resendLink: data.resendLink,
          })
      })
    } catch (e) {
      console.log(e)
    }
  }
  async sendSuccessfulChangePasswordEmail(data: ISuccessfulChangePasswordEmail) {
    try {
      if (!this.triggerMail) return
      await mail.send((message) => {
        message
          .to(data.email)
          .from(this.fromEmail)
          .subject('Password Change Confirmation')
          .htmlView('email-templates/successfulChangePasswordEmail.edge', {
            name: data.fullName,
            supportEmail: this.supportEmail,
            logoUrl: this.logoUrl,
          })
      })
    } catch (e) {
      console.log(e)
    }
  }
  async sendOrganisationCreationMail(data: ISendOrganisationCreationMail) {
    try {
      if (!this.triggerMail) return
      await mail.send((message) => {
        message
          .to(data.userEmail)
          .from(this.fromEmail)
          .subject('Your Organisation Password')
          .htmlView('email-templates/organisationCreationEmail.edge', {
            organisationName: data.organisationName,
            password: data.password,
            supportEmail: this.supportEmail,
            logoUrl: this.logoUrl,
          })
      })
    } catch (e) {
      console.log(e)
    }
  }
}
