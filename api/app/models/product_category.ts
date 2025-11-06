import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Product from './product.js'
import Organisation from './organisation.js'
import { PRODUCT_CATEGORIES } from '#database/constants/table_names'

export default class ProductCategory extends BaseModel {
  public static table = PRODUCT_CATEGORIES

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare organisationId: number

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare description: string

  @column()
  declare emoji: string | null

  @column()
  declare isActive: boolean

  @belongsTo(() => Organisation)
  declare organisation: BelongsTo<typeof Organisation>

  @hasMany(() => Product, {
    foreignKey: 'categoryId',
  })
  declare products: HasMany<typeof Product>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
