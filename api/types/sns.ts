export type ISendSignUpOtpMobile = {
  mobile: string
  otp: string
}

export type ISendPasswordMobile = {
  mobile: string
  password: string
  name: string
  email: string
}

export type ISendCredentialsMobile = {
  name: string
  email?: string
  mobile: string
}
