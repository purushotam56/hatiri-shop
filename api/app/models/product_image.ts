import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Product from './product.js'
import Upload from './upload.js'
import { PRODUCT_IMAGES } from '#database/constants/table_names'

export default class ProductImage extends BaseModel {
  public static table = PRODUCT_IMAGES

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare productId: number

  @column()
  declare uploadId: number

  @column()
  declare sortOrder: number

  @column()
  declare isActive: boolean

  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>

  @belongsTo(() => Upload)
  declare upload: BelongsTo<typeof Upload>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
