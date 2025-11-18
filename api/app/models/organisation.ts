import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, computed, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Branch from '#models/branch'
import Upload from '#models/upload'
import User from '#models/user'
import { CompanyRoles } from '#types/role'
import { ORGANISATION_USER } from '#database/constants/table_names'

export default class Organisation extends BaseModel {
  public static table = 'organisation'

  @column({ isPrimary: true })
  declare id: number

  @hasMany(() => Branch)
  declare branch: HasMany<typeof Branch>

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
  declare organisationRoleType: CompanyRoles

  @column()
  declare addressLine1: string

  @column()
  declare addressLine2: string

  @column()
  declare city: string

  @column()
  declare state: string

  @column()
  declare postalCode: string

  @column()
  declare country: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @computed()
  public get totalBranchs(): number {
    return this.$extras.branch_count ?? 0
  }

  @computed()
  public get totalProperties(): number {
    return this.$extras.property_count ?? 0
  }
}
