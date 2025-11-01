import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, computed } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Role from '#models/role'
import Branch from './branch.js'
import User from './user.js'
import Policy from './policy.js'
import { ResourceType } from '#types/common'
import { PROJECT_USER } from '#database/constants/table_names'

export default class BranchUser extends BaseModel {
  public static table = PROJECT_USER

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare branchId: number

  @belongsTo(() => Branch)
  declare branch: BelongsTo<typeof Branch>

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare User: BelongsTo<typeof User>

  @column()
  declare roleId: number

  @belongsTo(() => Role)
  declare role: BelongsTo<typeof Role>

  @column()
  declare policyId: number

  @belongsTo(() => Policy)
  declare policy: BelongsTo<typeof Policy>

  @computed()
  public get resourceType() {
    return ResourceType.PROJECT
  }

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
