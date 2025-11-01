import { APPOINTMENTS } from '#database/constants/table_names'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = APPOINTMENTS

  async up() {
    // Skip - appointments table not used in quick commerce app
  }
}
