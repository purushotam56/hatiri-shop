import { BaseSchema } from '@adonisjs/lucid/schema'
import { ORGANISATION } from '#database/constants/table_names'

export default class extends BaseSchema {
  protected tableName = 'product_groups'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')

      // Organization reference
      table
        .integer('organisation_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable(ORGANISATION)
        .onDelete('RESTRICT')

      // Group metadata
      table.string('name').notNullable().comment('e.g., Tomato - All Units')
      table.text('description').nullable()
      table.string('base_sku').nullable()

      // Common attributes for all variants in this group
      table.integer('base_stock').defaultTo(0).comment('Total stock across all variants')
      table.string('unit').defaultTo('piece')
      table
        .enum('stock_merge_type', ['merged', 'independent'])
        .defaultTo('merged')
        .comment('merged: shared stock, independent: separate stock per variant')

      // Timestamps
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
