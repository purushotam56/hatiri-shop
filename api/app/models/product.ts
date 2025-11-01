import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import Organisation from './organisation.js'
import Branch from './branch.js'
import Upload from './upload.js'
import ProductCategory from './product_category.js'
import { PRODUCTS, BRANCH_PRODUCTS } from '#database/constants/table_names'

export default class Product extends BaseModel {
  public static table = PRODUCTS

  @column({ isPrimary: true })
  declare id: number

  // relations
  @column()
  declare organisationId: number

  @belongsTo(() => Organisation)
  declare organisation: BelongsTo<typeof Organisation>

  @manyToMany(() => Branch, {
    pivotTable: BRANCH_PRODUCTS,
  })
  declare branches: ManyToMany<typeof Branch>

  // basic product fields
  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare sku: string

  @column()
  declare price: number

  @column()
  declare currency: string

  @column()
  declare categoryId: number

  @belongsTo(() => ProductCategory)
  declare category: BelongsTo<typeof ProductCategory>

  @column()
  declare stock: number

  @column()
  declare unit: string

  @column()
  declare imageUrl: string | null

  @column()
  declare options: any

  @column()
  declare imageId: number

  @belongsTo(() => Upload, {
    foreignKey: 'imageId',
  })
  declare image: BelongsTo<typeof Upload>

  @column()
  declare isActive: boolean

  @column()
  declare isDeleted: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}