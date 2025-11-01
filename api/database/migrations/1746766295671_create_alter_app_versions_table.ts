import { APP_VERSIONS } from '#database/constants/table_names'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = APP_VERSIONS

  async up() {
    // Skip if columns already exist - they're now in the create migration
  }

  async down() {
    // Skip rollback since columns are in the create migration
  }
}
