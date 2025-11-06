import { BaseSchema } from '@adonisjs/lucid/schema'
import { PRODUCTS, UPLOADS } from '#database/constants/table_names'

export default class extends BaseSchema {
  protected tableName = PRODUCTS

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('banner_image_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable(UPLOADS)
        .onDelete('SET NULL')
      table.text('details').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('banner_image_id')
      table.dropColumn('details')
    })
  }
}
