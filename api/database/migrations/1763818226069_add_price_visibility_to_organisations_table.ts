import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'organisation'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.enum('price_visibility', ['hidden', 'login_only', 'visible']).defaultTo('visible')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('price_visibility')
    })
  }
}
