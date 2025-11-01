import { ORGANISATION_USER, ORGANISATION, ROLES, USERS } from '#database/constants/table_names'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = ORGANISATION_USER

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('organisation_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable(ORGANISATION)

      table.integer('user_id').notNullable().unsigned().references('id').inTable(USERS)

      table.integer('role_id').unsigned().nullable().references('id').inTable(ROLES)

      table.boolean('is_admin').defaultTo(false)

      table.unique(['organisation_id', 'user_id'])

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
