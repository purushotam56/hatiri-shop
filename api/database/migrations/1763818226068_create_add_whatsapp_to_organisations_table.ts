import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'organisation'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('whatsapp_number', 20).nullable().comment('WhatsApp number in international format (e.g., +1234567890)')
      table.boolean('whatsapp_enabled').defaultTo(false).comment('Whether WhatsApp contact is enabled for this seller')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('whatsapp_number')
      table.dropColumn('whatsapp_enabled')
    })
  }
}