import { OTPS, USERS } from '#database/constants/table_names'
import { OtpVerificationFor } from '#types/otp'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = OTPS

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('user_id')
        .nullable()
        .unsigned()
        .references('id')
        .inTable(USERS)
        .onDelete('CASCADE')

      table.string('hash').notNullable()
      table.enum('otp_verification_for', Object.values(OtpVerificationFor))
      table.boolean('is_verified').notNullable().defaultTo(false)
      table.timestamp('expires_at').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
