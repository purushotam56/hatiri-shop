import { BaseSchema } from '@adonisjs/lucid/schema'
import { PRODUCTS } from '#database/constants/table_names'

export default class extends BaseSchema {
  protected tableName = PRODUCTS

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.decimal('discounted_price', 12, 2).nullable().comment('Price after discount')
      table.decimal('discount_percentage', 5, 2).nullable().comment('Discount percentage (0-100)')
      table.string('discount_type').nullable().comment('percentage or fixed_amount')
      table.dateTime('discount_start_date').nullable()
      table.dateTime('discount_end_date').nullable()
      table.boolean('is_discount_active').defaultTo(false)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('discounted_price')
      table.dropColumn('discount_percentage')
      table.dropColumn('discount_type')
      table.dropColumn('discount_start_date')
      table.dropColumn('discount_end_date')
      table.dropColumn('is_discount_active')
    })
  }
}
