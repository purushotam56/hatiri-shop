import { BaseSchema } from '@adonisjs/lucid/schema'
import { PRODUCTS, UPLOADS } from '#database/constants/table_names'

export default class extends BaseSchema {
  protected tableName = 'product_images'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('product_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable(PRODUCTS)
        .onDelete('CASCADE')
      table
        .integer('upload_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable(UPLOADS)
        .onDelete('CASCADE')
      table.integer('sort_order').defaultTo(0)
      table.boolean('is_active').defaultTo(true)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
