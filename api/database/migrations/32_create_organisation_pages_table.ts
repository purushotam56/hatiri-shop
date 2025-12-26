import { BaseSchema } from '@adonisjs/lucid/schema'
import { ORGANISATION } from '#database/constants/table_names'

export default class extends BaseSchema {
  protected tableName = 'organisation_pages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('organisation_id')
        .unsigned()
        .references('id')
        .inTable(ORGANISATION)
        .onDelete('RESTRICT')
      table.enum('page_type', ['about', 'contact']).notNullable()
      table.text('content').nullable()
      table.text('address').nullable()
      table.text('additional_info').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')

      // Unique constraint: one page per organisation and type
      table.unique(['organisation_id', 'page_type'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
