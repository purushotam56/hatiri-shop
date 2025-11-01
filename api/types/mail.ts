import Organisation from '#models/organisation'
import Branch from '#models/branch'
import Role from '#models/role'
import User from '#models/user'
export type ISendSingupSuccessMail = {
  email: string
  fullName: string
}

export type ISendSingupSuccessMailToAdmin = {
  email: string
  fullName: string
  password: string
  organisationCountryCode: string
  organisationName: string
}

export type ISendSignUpOtpMail = {
  email: string
  fullName: string
  otp: string
}

export type IInvitationMail = {
  email: string
  organisationName?: string
  invitedBy?: string
  htmlContent: string
}

export type ISignupLeadStatusMail = {
  email: string
  fullName?: string
}

export type IForgotPasswordEmail = {
  email: string
  resendLink: string
}

export type ISuccessfulChangePasswordEmail = {
  email: string
  fullName: string
}

export type ISuccessInvitationEmail = {
  user: User
  invitationType: 'Organisation' | 'Branch' | 'Property' | 'User'
  organisation?: Organisation
  userRole: Role
  branch?: Branch
  viewInvitationLink: string
  invitedBy: string
}

export type ISendOrganisationCreationMail = {
  userEmail: string
  organisationName: string
  password: string
}
