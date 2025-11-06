import { DateTime } from 'luxon'
import { BaseModel, belongsTo, hasMany, column } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Address from '#models/address'
import OrderItem from '#models/order_item'

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'

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
  declare addressId: number

  @belongsTo(() => Address, {
    foreignKey: 'addressId',
  })
  declare address: BelongsTo<typeof Address>

  @hasMany(() => OrderItem, {
    foreignKey: 'orderId',
  })
  declare items: HasMany<typeof OrderItem>

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
