export enum OtpVerificationFor {
  'email' = 'email',
  'mobile' = 'mobile',
}

export type ISendOtp = {
  singupLeadId?: number
  userId?: number
  mobile: string
  email: string
  fullName?: string
  countyCode?: string
}

export type IVerifyOtp = {
  singupLeadId?: number
  userId?: number
  otpVerificationFor: OtpVerificationFor
  mobileOrEmail?: string
}
