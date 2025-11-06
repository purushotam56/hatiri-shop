import { BaseSchema } from '@adonisjs/lucid/schema'
import { PRODUCT_CATEGORIES } from '#database/constants/table_names'

export default class extends BaseSchema {
  protected tableName = PRODUCT_CATEGORIES

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('emoji', 10).nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('emoji')
    })
  }
}
