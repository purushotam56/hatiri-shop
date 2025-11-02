import { BaseSchema } from '@adonisjs/lucid/schema'
import { PRODUCTS } from '#database/constants/table_names'

export default class extends BaseSchema {
  protected tableName = PRODUCTS

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Quantity field - number of units available
      table.integer('quantity').defaultTo(0)

      // Tax rate as percentage (e.g., 10 for 10%)
      table.decimal('tax_rate', 5, 2).defaultTo(0)

      // Tax type for flexibility (e.g., 'percentage', 'fixed', 'compound')
      table.string('tax_type').defaultTo('percentage')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('quantity')
      table.dropColumn('tax_rate')
      table.dropColumn('tax_type')
    })
  }
}
