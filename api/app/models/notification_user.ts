import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Notification from './notification.js'
import User from './user.js'
import AdminUser from './admin_user.js'

export default class NotificationUser extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare notificationId: number

  @belongsTo(() => Notification)
  declare notification: BelongsTo<typeof Notification>

  @column()
  declare userId: number

  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: BelongsTo<typeof User>

  @column()
  declare adminUserId: number | null

  @belongsTo(() => AdminUser, { foreignKey: 'adminUserId' })
  declare adminUser: BelongsTo<typeof AdminUser>

  @column()
  declare isRead: boolean

  @column()
  declare needAction: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
