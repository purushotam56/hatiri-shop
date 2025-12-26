import Role from '#models/role'
import Permission from '#models/permission'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { PermissionKeys } from '#types/permissions'
import { RoleKeys } from '#types/role'

export default class extends BaseSeeder {
  public async run() {
    // Fetch all roles and permissions
    const roles = await Role.all()
    const permissions = await Permission.all()

    // Create mapping from role keys to role IDs
    const roleMap = roles.reduce(
      (map, role) => {
        map[role.roleKey] = role.id
        return map
      },
      {} as Record<string, number>
    )

    // Create mapping from permission keys to permission IDs
    const permissionMap = permissions.reduce(
      (map, permission) => {
        map[permission.permissionKey] = permission.id
        return map
      },
      {} as Record<string, number>
    )

    // Function to attach permissions to a role using its key
    const attachPermissionsToRole = async (roleKey: string, reqPermissionKeys: string[]) => {
      const roleId = roleMap[roleKey]
      if (roleId) {
        const role = await Role.findOrFail(roleId) // Fetch the role using its ID
        await role.related('permissions').sync(reqPermissionKeys.map((key) => permissionMap[key])) // Attach permissions
      }
    }

    // Assign permissions to roles
    await attachPermissionsToRole(RoleKeys.organisation_admin, [
      PermissionKeys.web_access,
      PermissionKeys.app_access,

      PermissionKeys.organisation_dashboard_view,
      PermissionKeys.organisation_view,
      PermissionKeys.organisation_create,
      PermissionKeys.organisation_edit,
      PermissionKeys.organisation_delete,

      PermissionKeys.organisation_user_add,
      PermissionKeys.organisation_user_remove,
      PermissionKeys.organisation_user_change_role,

      PermissionKeys.branch_dashboard_view,
      PermissionKeys.branch_view,
      PermissionKeys.branch_create,
      PermissionKeys.branch_edit,
      PermissionKeys.branch_delete,
      PermissionKeys.branch_configure,

      PermissionKeys.branch_user_add,
      PermissionKeys.branch_user_remove,
      PermissionKeys.branch_user_change_role,
    ])

    await attachPermissionsToRole(RoleKeys.branch_admin, [
      PermissionKeys.web_access,
      PermissionKeys.app_access,

      // Organisation related
      PermissionKeys.organisation_dashboard_view,
      PermissionKeys.organisation_view,

      // Branch related
      PermissionKeys.branch_dashboard_view,
      PermissionKeys.branch_view,
      PermissionKeys.branch_create,
      PermissionKeys.branch_edit,
      PermissionKeys.branch_delete,
      PermissionKeys.branch_configure,

      PermissionKeys.branch_user_add,
      PermissionKeys.branch_user_remove,
      PermissionKeys.branch_user_change_role,
    ])
  }
}
