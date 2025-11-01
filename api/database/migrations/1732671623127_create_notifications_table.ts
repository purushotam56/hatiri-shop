import { BaseSchema } from '@adonisjs/lucid/schema'
import { USERS, ORGANISATION } from '#database/constants/table_names'

export default class extends BaseSchema {
  protected tableName = 'notifications'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('title').notNullable()

      table.string('body').notNullable()

      table.json('data')

      table.boolean('is_read').defaultTo(false)

      table.boolean('for_admin').defaultTo(false)

      table.boolean('is_read_for_admin').defaultTo(false)

      table.boolean('is_need_action').defaultTo(false)

      table.integer('user_id').unsigned().references('id').inTable(USERS).onDelete('CASCADE').nullable()

      table
        .integer('organisation_id')
        .unsigned()
        .references('id')
        .inTable(ORGANISATION)
        .onDelete('CASCADE')
        .nullable()
        .onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
