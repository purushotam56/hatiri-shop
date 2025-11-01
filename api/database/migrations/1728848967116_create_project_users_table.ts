import { PROJECT_USER, PROJECTS, ROLES, USERS } from '#database/constants/table_names'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = PROJECT_USER

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('branch_id').notNullable().unsigned().references('id').inTable(PROJECTS)

      table.integer('user_id').notNullable().unsigned().references('id').inTable(USERS)

      table.integer('role_id').notNullable().unsigned().references('id').inTable(ROLES)

      table.boolean('is_admin').defaultTo(false)

      table.unique(['branch_id', 'user_id'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
