import { USERS } from '#database/constants/table_names'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = USERS

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('full_name').nullable()
      table.string('email', 254).notNullable().unique()
      table.string('mobile', 254).nullable()
      table.string('password').nullable()
      table.boolean('is_email_verified').notNullable().defaultTo(false)
      table.boolean('is_mobile_verified').notNullable().defaultTo(false)
      table.boolean('is_deleted').defaultTo(false)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
