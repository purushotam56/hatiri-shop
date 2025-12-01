import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'product_groups'

  async up() {
    this.schema.table(this.tableName, (table) => {
      table.string('base_sku').after('description')
    })
  }

  async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('base_sku')
    })
  }
}
