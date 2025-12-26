import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import Otp from '#models/otp'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { BRANCH_USER, ORGANISATION_USER } from '#database/constants/table_names'
import Role from '#models/role'
import Organisation from './organisation.js'
import Branch from './branch.js'
import BranchUser from './branch_user.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column()
  declare mobile: string

  @column({ serializeAs: null })
  declare password: string

  @hasMany(() => Otp)
  declare otp: HasMany<typeof Otp>

  @column()
  declare isEmailVerified: boolean

  @column()
  declare isMobileVerified: boolean

  // organisation connection and role
  @manyToMany(() => Organisation, {
    pivotTable: ORGANISATION_USER,
    pivotColumns: ['is_admin', 'role_id'],
  })
  declare organisation: ManyToMany<typeof Organisation>

  @manyToMany(() => Role, {
    pivotTable: ORGANISATION_USER,
    pivotColumns: ['is_admin', 'organisation_id'],
  })
  declare organisation_role: ManyToMany<typeof Role>

  // branch connection and role
  @manyToMany(() => Branch, {
    pivotTable: BRANCH_USER,
    pivotColumns: ['is_admin', 'role_id'],
  })
  declare branch: ManyToMany<typeof Branch>

  @manyToMany(() => Role, {
    pivotTable: BRANCH_USER,
    pivotColumns: ['is_admin', 'branch_id'],
  })
  declare branch_role: ManyToMany<typeof Role>

  @manyToMany(() => BranchUser, {
    pivotTable: BRANCH_USER,
    pivotColumns: ['is_admin', 'role_id'],
  })
  declare branchUser: ManyToMany<typeof BranchUser>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
