import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, computed, hasMany, hasOne } from '@adonisjs/lucid/orm'
import NotificationUser from './notification_user.js'
import type { BelongsTo, HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import { NotificationType } from '#types/notification'
import Organisation from './organisation.js'
import Branch from './branch.js'

export default class Notification extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare body: string

  @column()
  declare screen: string

  @column()
  declare branchId: number

  @column()
  declare refId: number

  @column()
  declare refType: NotificationType

  @belongsTo(() => Branch, {
    foreignKey: 'branchId',
  })
  declare branch: BelongsTo<typeof Branch>

  @column()
  declare organisationId: number

  @belongsTo(() => Organisation, {
    foreignKey: 'organisationId',
  })
  declare organisation: BelongsTo<typeof Organisation>

  @hasMany(() => NotificationUser)
  declare notificationUsers: HasMany<typeof NotificationUser>

  @hasOne(() => NotificationUser)
  declare currentUser: HasOne<typeof NotificationUser>

  @computed()
  public get data() {
    return {
      id: this.refId,
      type: this.refType,
      screen: this.screen,
    }
  }

  @computed()
  public get isRead() {
    return this.currentUser?.isRead
  }

  @computed()
  public get isNeedAction() {
    return this.currentUser?.needAction
  }

  @computed()
  public get forAdmin() {
    return this.currentUser?.needAction
  }

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @computed()
  public get date() {
    return this.updatedAt
  }
}
