import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'addresses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('label', 255).nullable()
      table.string('full_name', 255).notNullable()
      table.string('phone_number', 20).notNullable()
      table.string('street', 255).notNullable()
      table.string('city', 255).notNullable()
      table.string('state', 255).notNullable()
      table.string('pincode', 20).notNullable()
      table.boolean('is_default').defaultTo(false)
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
