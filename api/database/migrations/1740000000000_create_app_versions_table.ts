import { BaseSchema } from '@adonisjs/lucid/schema'
import { APP_VERSIONS } from '#database/constants/table_names'

export default class extends BaseSchema {
  protected tableName = APP_VERSIONS

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('app_name').notNullable()
      table.string('app_version').notNullable()
      table.string('platform').notNullable() // ios, android, web
      table.integer('version').defaultTo(1)
      table.boolean('force_update').defaultTo(false)
      table.text('release_notes')
      table.boolean('is_active').defaultTo(true)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTableIfExists(this.tableName)
  }
}
