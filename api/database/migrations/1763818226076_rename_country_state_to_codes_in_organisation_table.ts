import { BaseSchema } from '@adonisjs/lucid/schema'
import { ORGANISATION } from '#database/constants/table_names'

export default class extends BaseSchema {
  protected tableName = ORGANISATION

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Drop old columns and add new ones with code
      table.dropColumn('state')
      table.dropColumn('country')
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.string('state_code').nullable().after('city')
      table.string('country_code').nullable().after('postal_code')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('state_code')
      table.dropColumn('country_code')
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.string('state').nullable().after('city')
      table.string('country').nullable().after('postal_code')
    })
  }
}
