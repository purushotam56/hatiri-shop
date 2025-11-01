import { USERS } from '#database/constants/table_names'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = USERS

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('mobile', 254).nullable().alter()
    })
  }

  async down() {}
}
