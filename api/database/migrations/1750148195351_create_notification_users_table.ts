import {
  ADMIN_USERS,
  NOTIFICATION_USERS,
  NOTIFICATIONS,
  USERS,
} from '#database/constants/table_names'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = NOTIFICATION_USERS

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('notification_id')
        .unsigned()
        .references('id')
        .inTable(NOTIFICATIONS)
        .onDelete('CASCADE')

      table
        .integer('user_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable(USERS)
        .onDelete('SET NULL')

      table
        .integer('admin_user_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable(ADMIN_USERS)
        .onDelete('SET NULL')

      table.boolean('is_read').notNullable().defaultTo(false)

      table.boolean('need_action').notNullable().defaultTo(false)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
