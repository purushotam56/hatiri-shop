import Role from '#models/role'
import { RoleAccessLevel, RoleKeys } from '#types/role'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Role.createMany([
      {
        roleName: 'Admin',
        roleKey: RoleKeys.organisation_admin,
        roleDescription: '',
        roleAccessLevel: RoleAccessLevel.organisation,
        isDefault: true,
      },
      {
        roleName: 'Branch Admin',
        roleKey: RoleKeys.branch_admin,
        roleAccessLevel: RoleAccessLevel.branch,
        roleDescription: '',
        isDefault: true,
      },
    ])
  }
}
