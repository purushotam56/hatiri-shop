import {
  ORGANISATION,
  BRANCHS,
  UPLOADS,
  PRODUCTS,
  BRANCH_PRODUCTS,
} from '#database/constants/table_names'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = PRODUCTS

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('organisation_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable(ORGANISATION)
        .onDelete('CASCADE')

      table.string('name').notNullable()
      table.text('description')
      table.string('sku').unique()
      table.decimal('price', 12, 2).defaultTo(0)
      table.string('currency')

      table
        .integer('category_id')
        .unsigned()
        .references('id')
        .inTable('product_categories')
        .onDelete('SET NULL')

      table.integer('stock').defaultTo(0)
      table.string('unit')

      table.string('image_url')

      table.json('options')

      table.integer('image_id').unsigned().references('id').inTable(UPLOADS).onDelete('SET NULL')

      // Quantity, Tax fields
      table.integer('quantity').defaultTo(0)
      table.decimal('tax_rate', 5, 2).defaultTo(0)
      table.string('tax_type').defaultTo('percentage')

      // Banner and details
      table
        .integer('banner_image_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable(UPLOADS)
        .onDelete('SET NULL')
      table.text('details').nullable()

      // Product group and stock merge type
      table.bigInteger('product_group_id').unsigned().nullable()
      table
        .enum('stock_merge_type', ['merged', 'independent'])
        .defaultTo('merged')
        .comment('merged: variants share inventory, independent: each variant has own stock')
      table.decimal('discount', 12, 2).defaultTo(0)

      table.boolean('is_active').defaultTo(true)
      table.boolean('is_deleted').defaultTo(false)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    // pivot table linking products to branches
    this.schema.createTable(BRANCH_PRODUCTS, (table) => {
      table.increments('id')
      table
        .integer('product_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable(PRODUCTS)
        .onDelete('CASCADE')

      table
        .integer('branch_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable(BRANCHS)
        .onDelete('CASCADE')

      table.integer('stock').defaultTo(0)
      table.decimal('price', 12, 2)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTableIfExists(BRANCH_PRODUCTS)
    this.schema.dropTableIfExists(this.tableName)
  }
}
