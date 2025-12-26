import { ORGANISATION, UPLOADS } from '#database/constants/table_names'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = ORGANISATION

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name')
      table.string('currency').nullable()
      table.string('date_format').nullable()
      table.string('organisation_unique_code').unique()
      table.string('organisation_role_type').nullable()
      table.string('address_line_1').nullable()
      table.string('address_line_2').nullable()
      table.string('city').nullable()
      table.string('postal_code').nullable()

      // Changed from state/country to state_code/country_code
      table.string('state_code').nullable()
      table.string('country_code').nullable()

      table
        .integer('image_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable(UPLOADS)
        .onDelete('SET NULL')

      table.enum('status', ['active', 'disabled', 'trial']).defaultTo('trial')
      table.dateTime('trial_end_date').nullable()
      table.boolean('is_active').defaultTo(true)
      table.boolean('is_deleted').defaultTo(false)

      // WhatsApp fields
      table
        .string('whatsapp_number', 20)
        .nullable()
        .comment('WhatsApp number in international format (e.g., +1234567890)')
      table
        .boolean('whatsapp_enabled')
        .defaultTo(false)
        .comment('Whether WhatsApp contact is enabled for this seller')

      // Price visibility
      table.enum('price_visibility', ['hidden', 'login_only', 'visible']).defaultTo('visible')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
