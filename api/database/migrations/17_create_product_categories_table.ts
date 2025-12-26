import { BaseSchema } from '@adonisjs/lucid/schema'
import { PRODUCT_CATEGORIES, ORGANISATION } from '#database/constants/table_names'

export default class extends BaseSchema {
  protected tableName = PRODUCT_CATEGORIES

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('organisation_id')
        .unsigned()
        .references('id')
        .inTable(ORGANISATION)
        .onDelete('RESTRICT')

      table.string('name').notNullable()
      table.string('slug').notNullable()
      table.text('description')
      table.string('emoji', 10).nullable()
      table.boolean('is_active').defaultTo(true)
      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.unique(['organisation_id', 'slug'])
    })
  }

  public async down() {
    this.schema.dropTableIfExists(this.tableName)
  }
}
