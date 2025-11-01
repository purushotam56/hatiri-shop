import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import Permission from './permission.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { POLICY_PERMISSIONS } from '#database/constants/table_names'

export default class Policy extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare policyName: string

  @manyToMany(() => Permission, {
    pivotTable: POLICY_PERMISSIONS,
  })
  declare permissions: ManyToMany<typeof Permission>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
