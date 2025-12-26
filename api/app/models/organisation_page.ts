import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import Organisation from './organisation.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class OrganisationPage extends BaseModel {
  static table = 'organisation_pages'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare organisationId: number

  @column()
  declare pageType: 'about' | 'contact'

  @column()
  declare content: string | null

  @column()
  declare address: string | null

  @column()
  declare additionalInfo: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Organisation)
  declare organisation: BelongsTo<typeof Organisation>
}
