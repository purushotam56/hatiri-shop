import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Product from './product.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class ProductGroup extends BaseModel {
  tableName = 'product_groups'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare organisationId: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare baseSku: string

  @column()
  declare baseStock: number

  @column()
  declare unit: string

  @column()
  declare stockMergeType: 'merged' | 'independent'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relationships
  @hasMany(() => Product, {
    foreignKey: 'productGroupId',
  })
  declare products: HasMany<typeof Product>
}
