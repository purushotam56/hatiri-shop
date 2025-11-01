import { BaseSchema } from '@adonisjs/lucid/schema'
import { USERS, USER_DEVICE_TOKENS } from '#database/constants/table_names'

export default class extends BaseSchema {
  protected tableName = USER_DEVICE_TOKENS

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('device_token').notNullable()

      table.string('platform').notNullable()

      table.boolean('is_active').defaultTo(true)

      table
        .integer('user_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable(USERS)
        .onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
