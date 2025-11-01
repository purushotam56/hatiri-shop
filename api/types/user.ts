export enum UserType {
  'admin' = 'admin',
  'user' = 'user',
}

export type ResetPasswordToken = {
  userType: 'admin' | 'user'
  id: number | string
} | null

export const testUsers = {
  auditor: {
    fullName: 'user 1',
    email: 'mo@test.com',
    password: '12345678',
    mobile: '+61222222222',
  },
  owner: {
    fullName: 'user 2',
    email: 'mo1@test.com',
    password: '12345678',
    mobile: '+61777777777',
  },
  strata: {
    fullName: 'user 3',
    email: 'mo2@test.com',
    password: '12345678',
    mobile: '+61333333333',
  },
  sub_contractor: {
    fullName: 'user 4',
    email: 'mo3@test.com',
    password: '12345678',
    mobile: '+61444444444',
  },
  agent: {
    fullName: 'user 5',
    email: 'mo5@test.com',
    password: '12345678',
    mobile: '+61555555555',
  },
  tanent: {
    fullName: 'user 6',
    email: 'mo6@test.com',
    password: '12345678',
    mobile: '+61666666666',
  },
  org_admin: {
    fullName: 'user 7',
    email: 'org@test.com',
    password: '12345678',
    mobile: '+61111111111',
  },
  sales_agent: {
    fullName: 'user 8',
    email: 'mo8@test.com',
    password: '12345678',
    mobile: '+61888888888',
  },
}
