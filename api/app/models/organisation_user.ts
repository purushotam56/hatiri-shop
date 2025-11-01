import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, computed } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Role from '#models/role'
import User from './user.js'
import { ORGANISATION_USER } from '#database/constants/table_names'
import Organisation from './organisation.js'
import Policy from './policy.js'
import { ResourceType } from '#types/common'

export default class OrganisationUser extends BaseModel {
  public static table = ORGANISATION_USER

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare organisationId: number

  @belongsTo(() => Organisation)
  declare organisation: BelongsTo<typeof Organisation>

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare User: BelongsTo<typeof User>

  @column()
  declare policyId: number

  @belongsTo(() => Policy)
  declare policy: BelongsTo<typeof Policy>

  @column()
  declare roleId: number

  @belongsTo(() => Role)
  declare role: BelongsTo<typeof Role>

  @computed()
  public get resourceType() {
    return ResourceType.WORSPACE
  }

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
