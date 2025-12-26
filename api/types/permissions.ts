export enum PermissionKeys {
  web_access = 'web_access',
  app_access = 'app_access',

  organisation_dashboard_view = 'organisation_dashboard_view',
  organisation_view = 'organisation_view',
  organisation_create = 'organisation_create',
  organisation_edit = 'organisation_edit',
  organisation_delete = 'organisation_delete',

  organisation_user_add = 'organisation_user_add',
  organisation_user_remove = 'organisation_user_remove',
  organisation_user_change_role = 'organisation_user_change_role',

  branch_dashboard_view = 'branch_dashboard_view',
  branch_view = 'branch_view',
  branch_create = 'branch_create',
  branch_edit = 'branch_edit',
  branch_delete = 'branch_delete',
  branch_configure = 'branch_configure',

  branch_user_add = 'branch_user_add',
  branch_user_remove = 'branch_user_remove',
  branch_user_change_role = 'branch_user_change_role',
}

export const PermissionKeyDetail = {
  [PermissionKeys.web_access]: 'Can use web app',
  [PermissionKeys.app_access]: 'Can use mobile app',

  [PermissionKeys.organisation_dashboard_view]: 'View Organisation Dashboard',
  [PermissionKeys.organisation_view]: 'View Organisation',
  [PermissionKeys.organisation_create]: 'Create Organisation',
  [PermissionKeys.organisation_edit]: 'Edit Organisation',
  [PermissionKeys.organisation_delete]: 'Delete Organisation',

  [PermissionKeys.organisation_user_add]: 'Add User to Organisation',
  [PermissionKeys.organisation_user_remove]: 'Remove User from Organisation',
  [PermissionKeys.organisation_user_change_role]: 'Change User Role in Organisation',

  [PermissionKeys.branch_dashboard_view]: 'View Branch Dashboard',
  [PermissionKeys.branch_view]: 'View Branch',
  [PermissionKeys.branch_create]: 'Create Branch',
  [PermissionKeys.branch_edit]: 'Edit Branch',
  [PermissionKeys.branch_delete]: 'Delete Branch',
  [PermissionKeys.branch_configure]: 'Configure Branch',

  [PermissionKeys.branch_user_add]: 'Add User to Branch',
  [PermissionKeys.branch_user_remove]: 'Remove User from Branch',
  [PermissionKeys.branch_user_change_role]: 'Change User Role in Branch',
}
