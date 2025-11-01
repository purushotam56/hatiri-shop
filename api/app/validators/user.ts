import vine from '@vinejs/vine'

export const userSchema = vine.object({
  fullName: vine.string().trim(),
  email: vine.string().trim(),
  password: vine.string().trim().optional(),
  mobile: vine.string().trim(),
})

/**
 * Validator to validate the payload when creating
 * a new user.
 */
export const createUserValidator = vine.compile(userSchema)

/**
 * Validator to validate the payload when creating
 * a new users.
 */
export const createManyUserValidator = vine.compile(
  vine.array(
    vine.object({
      fullName: vine.string().trim(),
      email: vine.string().trim(),
      password: vine.string().trim().optional(),
      mobile: vine.string().trim(),
    })
  )
)

export const userSchemaWithRole = vine.object({
  id: vine.number().optional(),
  fullName: vine.string().trim().optional().requiredIfMissing('id'),
  email: vine.string().trim().optional().requiredIfMissing('id'),
  password: vine.string().trim().optional(),
  mobile: vine.string().trim().optional().requiredIfMissing('id'),
  roleId: vine.number(),
  tradeCodeIds: vine.array(vine.number()).minLength(1).optional(),
  tenancyId: vine.number().optional(),
  webAccess: vine.boolean().optional(),
  appAccess: vine.boolean().optional(),
})

export const forgotPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().trim(),
  })
)

export const resetPasswordValidator = vine.compile(
  vine.object({
    password: vine.string().trim(),
    confirmPassword: vine.string().trim(),
    token: vine.string().trim(),
  })
)

export const updateUserProfileValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().optional().requiredIfMissing(['email', 'mobile']),
    email: vine.string().trim().optional().requiredIfMissing(['fullName', 'mobile']),
    mobile: vine.string().trim().optional().requiredIfMissing(['fullName', 'email']),
  })
)

export function changeUserPasswordValidator(isSystemAdmin: boolean) {
  return vine.compile(
    vine.object({
      currentPassword: isSystemAdmin ? vine.string().trim().optional() : vine.string().trim(),
      newPassword: vine.string().trim(),
      confirmPassword: vine.string().trim().sameAs('newPassword'),
    })
  )
}
