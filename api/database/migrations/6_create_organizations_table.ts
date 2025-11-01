import { ORGANISATION, UPLOADS } from '#database/constants/table_names'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = ORGANISATION

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name')
      table.string('currency').nullable()
      table.string('date_format').nullable()
      table.string('organisation_unique_code').unique()
      table.string('organisation_role_type').nullable()
      table.string('address_line_1').nullable()
      table.string('address_line_2').nullable()
      table.string('city').nullable()
      table.string('state').nullable()
      table.string('postal_code').nullable()
      table.string('country').nullable()

      table
        .integer('image_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable(UPLOADS)
        .onDelete('SET NULL')

      table.boolean('is_active').defaultTo(true)
      table.boolean('is_deleted').defaultTo(false)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
