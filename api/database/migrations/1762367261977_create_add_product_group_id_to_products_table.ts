import { BaseSchema } from '@adonisjs/lucid/schema'
import { PRODUCTS } from '#database/constants/table_names'

export default class extends BaseSchema {
  protected tableName = PRODUCTS

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('product_group_id').unsigned().nullable()
      table.index('product_group_id')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('product_group_id')
    })
  }
}
