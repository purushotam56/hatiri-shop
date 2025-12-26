import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, computed, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Branch from '#models/branch'
import Upload from '#models/upload'
import User from '#models/user'
import OrganisationPage from '#models/organisation_page'
import { ORGANISATION_USER } from '#database/constants/table_names'

export default class Organisation extends BaseModel {
  public static table = 'organisation'

  @column({ isPrimary: true })
  declare id: number

  @hasMany(() => Branch)
  declare branch: HasMany<typeof Branch>

  @hasMany(() => OrganisationPage)
  declare pages: HasMany<typeof OrganisationPage>

  @manyToMany(() => User, {
    pivotTable: ORGANISATION_USER,
    pivotColumns: ['is_admin', 'role_id'],
  })
  declare user: ManyToMany<typeof User>

  @column()
  declare imageId: number

  @belongsTo(() => Upload, {
    foreignKey: 'imageId',
  })
  declare image: BelongsTo<typeof Upload>

  @column()
  declare name: string

  @column()
  declare currency: string

  @column()
  declare dateFormat: string

  @column()
  declare organisationUniqueCode: string

  @column()
  declare addressLine1: string

  @column()
  declare addressLine2: string

  @column()
  declare city: string

  @column()
  declare stateCode: string

  @column()
  declare postalCode: string

  @column()
  declare countryCode: string

  @column()
  declare status: 'active' | 'disabled' | 'trial'

  @column.dateTime()
  declare trialEndDate: DateTime | null

  @column()
  declare whatsappNumber: string | null

  @column()
  declare whatsappEnabled: boolean

  @column()
  declare priceVisibility: 'hidden' | 'login_only' | 'visible'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @computed()
  public get totalBranchs(): number {
    return this.$extras.branch_count ?? 0
  }
}
