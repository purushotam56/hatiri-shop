import { UPLOADS } from '#database/constants/table_names'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = UPLOADS

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name')
      table.string('key')
      table.string('url_prefix').nullable()
      table.string('mime_type')
      table.string('size')
      table.string('driver').defaultTo('s3').notNullable()
      table.boolean('is_deleted').defaultTo(false)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
