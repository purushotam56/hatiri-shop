import { ORGANISATION, PROJECTS, UPLOADS } from '#database/constants/table_names'
import { BranchMaintenanceServiceType, BranchType } from '#types/branch'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = PROJECTS

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

      table.string('name')
      table.enum('type', Object.values(BranchType))
      table.enum('maintenance_service_type', Object.values(BranchMaintenanceServiceType))
      table.string('num_basement_levels').nullable()
      table.string('address').nullable()
      table.string('block_building_no').nullable()
      table.string('strata_plan_no').nullable()

      table
        .integer('image_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable(UPLOADS)
        .onDelete('SET NULL')

      table.boolean('is_deleted').defaultTo(false)
      table.boolean('is_active').defaultTo(true)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
