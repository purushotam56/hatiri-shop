import { ROLE_PERMISSIONS } from '#database/constants/table_names'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = ROLE_PERMISSIONS

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('role_id').unsigned().references('id').inTable('roles').onDelete('CASCADE')
      table
        .integer('permission_id')
        .unsigned()
        .references('id')
        .inTable('permissions')
        .onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
