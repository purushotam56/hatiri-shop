import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      
      table.string('order_number').unique().notNullable()
      
      table
        .integer('customer_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      
      table
        .integer('organisation_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('organisation')
        .onDelete('CASCADE')
      
      table
        .integer('branch_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('branchs')
        .onDelete('CASCADE')
      
      table.enum('status', [
        'pending',
        'confirmed',
        'preparing',
        'ready',
        'out_for_delivery',
        'delivered',
        'cancelled',
      ]).defaultTo('pending')
      
      table.decimal('total_amount', 12, 2).notNullable()
      table.decimal('subtotal', 12, 2).notNullable()
      table.decimal('tax_amount', 12, 2).defaultTo(0)
      table.decimal('delivery_amount', 12, 2).defaultTo(0)
      
      table.text('delivery_address').nullable()
      table.string('customer_phone').nullable()
      table.string('customer_name').nullable()
      table.text('notes').nullable()
      
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}