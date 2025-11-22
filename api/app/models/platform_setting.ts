import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class PlatformSetting extends BaseModel {
  public static table = 'platform_settings'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare freeTrialDays: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
