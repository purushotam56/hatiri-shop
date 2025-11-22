import { BaseSchema } from '@adonisjs/lucid/schema'
import { ORGANISATION } from '#database/constants/table_names'

export default class extends BaseSchema {
  protected tableName = 'notifications'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('title').notNullable()

      table.string('body').notNullable()

      table
        .integer('organisation_id')
        .unsigned()
        .references('id')
        .inTable(ORGANISATION)
        .onDelete('CASCADE')
        .nullable()

      table.text('screen').nullable()
      table.integer('ref_id').nullable()
      table.string('ref_type').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
