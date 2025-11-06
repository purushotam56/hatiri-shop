import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany, HasMany } from '@adonisjs/lucid/types/relations'
import Organisation from './organisation.js'
import Branch from './branch.js'
import Upload from './upload.js'
import ProductCategory from './product_category.js'
import OrderItem from './order_item.js'
import ProductImage from './product_image.js'
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

  @hasMany(() => OrderItem, {
    foreignKey: 'productId',
  })
  declare orderItems: HasMany<typeof OrderItem>

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

  @belongsTo(() => ProductCategory, {
    foreignKey: 'categoryId',
  })
  declare category: BelongsTo<typeof ProductCategory>

  @column()
  declare stock: number

  @column()
  declare quantity: number

  @column()
  declare unit: string

  @column()
  declare imageUrl: string | null

  @column()
  declare options: any

  @column()
  declare productGroupId: number | null

  @column()
  declare taxRate: number

  @column()
  declare taxType: string

  @column()
  declare imageId: number

  @belongsTo(() => Upload, {
    foreignKey: 'imageId',
  })
  declare image: BelongsTo<typeof Upload>

  @column()
  declare bannerImageId: number | null

  @belongsTo(() => Upload, {
    foreignKey: 'bannerImageId',
  })
  declare bannerImage: BelongsTo<typeof Upload>

  @column()
  declare details: string | null

  @hasMany(() => ProductImage, {
    foreignKey: 'productId',
  })
  declare images: HasMany<typeof ProductImage>

  @hasMany(() => Product, {
    foreignKey: 'productGroupId',
    localKey: 'productGroupId',
  })
  declare variants: HasMany<typeof Product>

  @column()
  declare isActive: boolean

  @column()
  declare isDeleted: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
