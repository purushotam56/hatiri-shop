import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, computed, manyToMany } from '@adonisjs/lucid/orm'
import { branchBasementList, BranchMaintenanceServiceType, BranchType } from '#types/branch'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Upload from './upload.js'
import { RoleKeys } from '#types/role'
import Organisation from './organisation.js'

export default class Branch extends BaseModel {
  static table = 'branchs'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare organisationId: number

  @belongsTo(() => Organisation)
  declare organisation: BelongsTo<typeof Organisation>

  @manyToMany(() => User, {
    pivotColumns: ['is_admin', 'role_id'],
  })
  declare user: ManyToMany<typeof User>

  @column()
  declare name: string

  @column()
  declare type: BranchType

  @column()
  declare maintenanceServiceType: BranchMaintenanceServiceType

  @column()
  declare numBasementLevels: number

  @column()
  declare address: string

  @column()
  declare blockBuildingNo: string

  @column()
  declare strataPlanNo: string

  @column()
  declare imageId: number

  @belongsTo(() => Upload, {
    foreignKey: 'imageId',
  })
  declare image: BelongsTo<typeof Upload>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @computed()
  public get basementList() {
    if (this.numBasementLevels < 1) {
      return []
    }
    return branchBasementList(this.numBasementLevels)
  }

  @computed()
  public get [RoleKeys.branch_admin]() {
    if (this.user && this.user.length > 0) {
      return this.user.filter((usr) =>
        usr.branch_role?.some((pr) => pr.roleKey === RoleKeys.branch_admin)
      )
    }
    return undefined
  }
}
