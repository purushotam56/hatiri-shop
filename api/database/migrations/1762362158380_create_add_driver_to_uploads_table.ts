import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'uploads'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('driver').defaultTo('s3').notNullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('driver')
    })
  }
}
