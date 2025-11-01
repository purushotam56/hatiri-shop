import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'carts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('product_id').unsigned()
      table.integer('variant_id').unsigned()
      table.string('name', 255).notNullable()
      table.decimal('price', 10, 2).notNullable()
      table.integer('quantity').notNullable().defaultTo(1)
      table.string('currency', 10).defaultTo('AED')
      table.string('unit', 50).nullable()
      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').notNullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
