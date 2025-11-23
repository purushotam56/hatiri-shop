import { BaseSchema } from '@adonisjs/lucid/schema'
import { PRODUCTS } from '#database/constants/table_names'

export default class extends BaseSchema {
  protected tableName = PRODUCTS

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Add discount fields if they don't exist
      table.string('discount_type').nullable().comment('percentage or fixed_amount')
      table.decimal('discount_percentage', 5, 2).nullable()
      table.boolean('is_discount_active').defaultTo(false)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('discount_type')
      table.dropColumn('discount_percentage')
      table.dropColumn('is_discount_active')
    })
  }
}
