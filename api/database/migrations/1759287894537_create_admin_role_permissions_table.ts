import { ADMIN_ROLE_PERMISSIONS, ADMIN_ROLES, PERMISSIONS } from '#database/constants/table_names'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = ADMIN_ROLE_PERMISSIONS

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('admin_role_id')
        .unsigned()
        .references('id')
        .inTable(ADMIN_ROLES)
        .onDelete('CASCADE')
      table
        .integer('permission_id')
        .unsigned()
        .references('id')
        .inTable(PERMISSIONS)
        .onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
