import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import { OtpVerificationFor } from '#types/otp'
import AdminUser from './admin_user.js'

export default class Otp extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare adminUserId: number

  @belongsTo(() => AdminUser)
  declare adminUser: BelongsTo<typeof AdminUser>

  @column()
  declare hash: string

  @column()
  declare otpVerificationFor: OtpVerificationFor

  @column()
  declare isVerified: boolean

  @column.dateTime()
  declare expiresAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
