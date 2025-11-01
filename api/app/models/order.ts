import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Organisation from '#models/organisation'
import Branch from '#models/branch'

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled'

export default class Order extends BaseModel {
  public static table = 'orders'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare orderNumber: string

  @column()
  declare customerId: number

  @belongsTo(() => User, {
    foreignKey: 'customerId',
  })
  declare customer: BelongsTo<typeof User>

  @column()
  declare organisationId: number

  @belongsTo(() => Organisation, {
    foreignKey: 'organisationId',
  })
  declare organisation: BelongsTo<typeof Organisation>

  @column()
  declare branchId: number

  @belongsTo(() => Branch, {
    foreignKey: 'branchId',
  })
  declare branch: BelongsTo<typeof Branch>

  @column()
  declare totalAmount: number

  @column()
  declare taxAmount: number

  @column()
  declare deliveryAmount: number

  @column()
  declare subtotal: number

  @column()
  declare status: OrderStatus

  @column()
  declare deliveryAddress: string

  @column()
  declare customerPhone: string

  @column()
  declare customerName: string

  @column()
  declare notes: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}