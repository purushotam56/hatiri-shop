import { BaseSchema } from '@adonisjs/lucid/schema'
import { PRODUCTS } from '#database/constants/table_names'

export default class extends BaseSchema {
  protected tableName = PRODUCTS

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.enum('stock_merge_type', ['merged', 'independent']).defaultTo('merged').comment('merged: variants share inventory, independent: each variant has own stock')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('stock_merge_type')
    })
  }
}
