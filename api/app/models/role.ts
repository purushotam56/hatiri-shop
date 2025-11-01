import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import Permission from '#models/permission'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { PROJECT_USER, ORGANISATION_USER } from '#database/constants/table_names'
import { RoleAccessLevel, RoleKeys } from '#types/role'
import Organisation from './organisation.js'
import Branch from './branch.js'

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare roleName: string

  @column()
  declare roleDescription: string

  @column()
  declare roleKey: RoleKeys

  @column()
  declare roleAccessLevel: RoleAccessLevel

  @column()
  declare isDefault: boolean

  @column()
  declare tradeCodeRequired: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => Permission, {
    pivotTable: 'role_permissions',
  })
  declare permissions: ManyToMany<typeof Permission>

  @manyToMany(() => Organisation, {
    pivotTable: ORGANISATION_USER,
    pivotColumns: ['is_admin', 'organisation_id'],
  })
  declare organisation: ManyToMany<typeof Organisation>

  @manyToMany(() => Branch, {
    pivotTable: PROJECT_USER,
    pivotColumns: ['is_admin', 'branch_id'],
  })
  declare branch: ManyToMany<typeof Branch>

  serializeExtras() {
    return {
      isAdmin: this.$extras.pivot_is_admin,
    }
  }
}
