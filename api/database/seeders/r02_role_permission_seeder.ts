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

      PermissionKeys.branch_organisation_add,
      PermissionKeys.branch_organisation_remove,
      PermissionKeys.branch_worskpace_edit_connection,

      PermissionKeys.property_view,
      PermissionKeys.property_create,
      PermissionKeys.property_edit,
      PermissionKeys.property_delete,
      PermissionKeys.property_configure,

      PermissionKeys.property_user_add,
      PermissionKeys.property_user_remove,
      PermissionKeys.property_user_change_role,

      PermissionKeys.common_area_view,
      PermissionKeys.common_area_create,
      PermissionKeys.common_area_edit,
      PermissionKeys.common_area_delete,
      PermissionKeys.common_area_configure,

      PermissionKeys.common_area_user_add,
      PermissionKeys.common_area_user_remove,
      PermissionKeys.common_area_user_change_role,

      PermissionKeys.property_defect_log,
      PermissionKeys.property_defect_log_need_approval,
      PermissionKeys.property_defect_status_update,
      PermissionKeys.property_defect_status_update_need_approval,
      PermissionKeys.property_defect_resolve,
      PermissionKeys.property_defect_resolve_need_approval,
      PermissionKeys.property_defect_approval,
      PermissionKeys.property_defect_feedback,
      PermissionKeys.property_defect_open,
      PermissionKeys.property_defect_close,

      PermissionKeys.property_inspection_start,
      PermissionKeys.property_inspection_end,
      PermissionKeys.property_inspection_defect_log,
      PermissionKeys.property_inspection_defect_log_need_approval,
      PermissionKeys.property_inspection_defect_status_update,
      PermissionKeys.property_inspection_defect_status_update_need_approval,
      PermissionKeys.property_inspection_defect_resolve,
      PermissionKeys.property_inspection_defect_resolve_need_approval,

      PermissionKeys.property_defect_appointment_create,
      PermissionKeys.property_defect_appointment_view,
      PermissionKeys.property_defect_appointment_reschedule,
      PermissionKeys.property_defect_appointment_cancel,
      PermissionKeys.property_inspection_appointment_create,
      PermissionKeys.property_inspection_appointment_view,
      PermissionKeys.property_inspection_appointment_reschedule,
      PermissionKeys.property_inspection_appointment_cancel,

      PermissionKeys.common_area_defect_log,
      PermissionKeys.common_area_defect_log_need_approval,
      PermissionKeys.common_area_defect_status_update,
      PermissionKeys.common_area_defect_status_update_need_approval,
      PermissionKeys.common_area_defect_resolve,
      PermissionKeys.common_area_defect_resolve_need_approval,
      PermissionKeys.common_area_defect_approval,
      PermissionKeys.common_area_defect_feedback,
      PermissionKeys.common_area_defect_open,
      PermissionKeys.common_area_defect_close,

      PermissionKeys.common_area_inspection_start,
      PermissionKeys.common_area_inspection_end,
      PermissionKeys.common_area_inspection_defect_log,
      PermissionKeys.common_area_inspection_defect_log_need_approval,
      PermissionKeys.common_area_inspection_defect_status_update,
      PermissionKeys.common_area_inspection_defect_status_update_need_approval,
      PermissionKeys.common_area_inspection_defect_resolve,
      PermissionKeys.common_area_inspection_defect_resolve_need_approval,

      PermissionKeys.common_area_defect_appointment_create,
      PermissionKeys.common_area_defect_appointment_view,
      PermissionKeys.common_area_defect_appointment_reschedule,
      PermissionKeys.common_area_defect_appointment_cancel,
      PermissionKeys.common_area_inspection_appointment_create,
      PermissionKeys.common_area_inspection_appointment_view,
      PermissionKeys.common_area_inspection_appointment_reschedule,
      PermissionKeys.common_area_inspection_appointment_cancel,

      PermissionKeys.site_establishment_defect_log,
      PermissionKeys.site_establishment_defect_log_need_approval,
      PermissionKeys.site_establishment_defect_status_update,
      PermissionKeys.site_establishment_defect_status_update_need_approval,
      PermissionKeys.site_establishment_defect_resolve,
      PermissionKeys.site_establishment_defect_resolve_need_approval,
      PermissionKeys.site_establishment_defect_approval,
      PermissionKeys.site_establishment_defect_feedback,
      PermissionKeys.site_establishment_defect_open,
      PermissionKeys.site_establishment_defect_close,

      PermissionKeys.external_work_defect_log,
      PermissionKeys.external_work_defect_log_need_approval,
      PermissionKeys.external_work_defect_status_update,
      PermissionKeys.external_work_defect_status_update_need_approval,
      PermissionKeys.external_work_defect_resolve,
      PermissionKeys.external_work_defect_resolve_need_approval,
      PermissionKeys.external_work_defect_approval,
      PermissionKeys.external_work_defect_feedback,
      PermissionKeys.external_work_defect_open,
      PermissionKeys.external_work_defect_close,

      PermissionKeys.construction_defect_log,
      PermissionKeys.construction_defect_log_need_approval,
      PermissionKeys.construction_defect_status_update,
      PermissionKeys.construction_defect_status_update_need_approval,
      PermissionKeys.construction_defect_resolve,
      PermissionKeys.construction_defect_resolve_need_approval,
      PermissionKeys.construction_defect_approval,
      PermissionKeys.construction_defect_feedback,
      PermissionKeys.construction_defect_open,
      PermissionKeys.construction_defect_close,

      PermissionKeys.property_itp_submit_task,
      PermissionKeys.property_itp_submit_task_need_approval,
      PermissionKeys.property_itp_approve_task,
      PermissionKeys.property_itp_reject_task,
      PermissionKeys.property_itp_reopen_task,

      PermissionKeys.common_area_itp_submit_task,
      PermissionKeys.common_area_itp_submit_task_need_approval,
      PermissionKeys.common_area_itp_approve_task,
      PermissionKeys.common_area_itp_reject_task,
      PermissionKeys.common_area_itp_reopen_task,

      PermissionKeys.site_establishment_itp_submit_task,
      PermissionKeys.site_establishment_itp_submit_task_need_approval,
      PermissionKeys.site_establishment_itp_approve_task,
      PermissionKeys.site_establishment_itp_reject_task,
      PermissionKeys.site_establishment_itp_reopen_task,

      PermissionKeys.external_work_itp_submit_task,
      PermissionKeys.external_work_itp_submit_task_need_approval,
      PermissionKeys.external_work_itp_approve_task,
      PermissionKeys.external_work_itp_reject_task,
      PermissionKeys.external_work_itp_reopen_task,

      PermissionKeys.construction_itp_submit_task,
      PermissionKeys.construction_itp_submit_task_need_approval,
      PermissionKeys.construction_itp_approve_task,
      PermissionKeys.construction_itp_reject_task,
      PermissionKeys.construction_itp_reopen_task,

      PermissionKeys.property_defect_full_report,
      PermissionKeys.property_defect_trade_report,
      PermissionKeys.property_defect_inspection_report,
      PermissionKeys.property_defect_inspection_trade_report,
      PermissionKeys.property_itp_full_report,
      PermissionKeys.property_itp_trade_report,
      PermissionKeys.property_itp_inspection_report,
      PermissionKeys.property_itp_inspection_trade_report,

      PermissionKeys.common_area_defect_full_report,
      PermissionKeys.common_area_defect_trade_report,
      PermissionKeys.common_area_defect_inspection_report,
      PermissionKeys.common_area_defect_inspection_trade_report,
      PermissionKeys.common_area_itp_full_report,
      PermissionKeys.common_area_itp_trade_report,
      PermissionKeys.common_area_itp_inspection_report,
      PermissionKeys.common_area_itp_inspection_trade_report,

      PermissionKeys.site_establishment_defect_full_report,
      PermissionKeys.site_establishment_defect_trade_report,
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

      PermissionKeys.branch_organisation_add,
      PermissionKeys.branch_organisation_remove,
      PermissionKeys.branch_worskpace_edit_connection,

      // Property related
      PermissionKeys.property_view,
      PermissionKeys.property_create,
      PermissionKeys.property_edit,
      PermissionKeys.property_delete,
      PermissionKeys.property_configure,

      PermissionKeys.property_user_add,
      PermissionKeys.property_user_remove,
      PermissionKeys.property_user_change_role,

      // Common Area related
      PermissionKeys.common_area_view,
      PermissionKeys.common_area_create,
      PermissionKeys.common_area_edit,
      PermissionKeys.common_area_delete,
      PermissionKeys.common_area_configure,

      PermissionKeys.common_area_user_add,
      PermissionKeys.common_area_user_remove,
      PermissionKeys.common_area_user_change_role,

      // Property Defect related
      PermissionKeys.property_defect_log,
      PermissionKeys.property_defect_status_update,
      PermissionKeys.property_defect_resolve,
      PermissionKeys.property_defect_approval,
      PermissionKeys.property_defect_feedback,
      PermissionKeys.property_defect_open,
      PermissionKeys.property_defect_close,

      // Property Inspection related
      PermissionKeys.property_inspection_start,
      PermissionKeys.property_inspection_end,
      PermissionKeys.property_inspection_defect_log,
      PermissionKeys.property_inspection_defect_status_update,
      PermissionKeys.property_inspection_defect_resolve,

      // Property Appointment related
      PermissionKeys.property_defect_appointment_create,
      PermissionKeys.property_defect_appointment_view,
      PermissionKeys.property_defect_appointment_reschedule,
      PermissionKeys.property_defect_appointment_cancel,
      PermissionKeys.property_inspection_appointment_create,
      PermissionKeys.property_inspection_appointment_view,
      PermissionKeys.property_inspection_appointment_reschedule,
      PermissionKeys.property_inspection_appointment_cancel,

      // Common Area Defect related
      PermissionKeys.common_area_defect_log,
      PermissionKeys.common_area_defect_status_update,
      PermissionKeys.common_area_defect_resolve,
      PermissionKeys.common_area_defect_approval,
      PermissionKeys.common_area_defect_feedback,
      PermissionKeys.common_area_defect_open,
      PermissionKeys.common_area_defect_close,

      // Common Area Inspection related
      PermissionKeys.common_area_inspection_start,
      PermissionKeys.common_area_inspection_end,
      PermissionKeys.common_area_inspection_defect_log,
      PermissionKeys.common_area_inspection_defect_status_update,
      PermissionKeys.common_area_inspection_defect_resolve,

      // Common Area Appointment related
      PermissionKeys.common_area_defect_appointment_create,
      PermissionKeys.common_area_defect_appointment_view,
      PermissionKeys.common_area_defect_appointment_reschedule,
      PermissionKeys.common_area_defect_appointment_cancel,
      PermissionKeys.common_area_inspection_appointment_create,
      PermissionKeys.common_area_inspection_appointment_view,
      PermissionKeys.common_area_inspection_appointment_reschedule,
      PermissionKeys.common_area_inspection_appointment_cancel,

      // Site Establishment related
      PermissionKeys.site_establishment_defect_log,
      PermissionKeys.site_establishment_defect_status_update,
      PermissionKeys.site_establishment_defect_resolve,
      PermissionKeys.site_establishment_defect_approval,
      PermissionKeys.site_establishment_defect_feedback,
      PermissionKeys.site_establishment_defect_open,
      PermissionKeys.site_establishment_defect_close,

      // External Work related
      PermissionKeys.external_work_defect_log,
      PermissionKeys.external_work_defect_status_update,
      PermissionKeys.external_work_defect_resolve,
      PermissionKeys.external_work_defect_approval,
      PermissionKeys.external_work_defect_feedback,
      PermissionKeys.external_work_defect_open,
      PermissionKeys.external_work_defect_close,

      // Construction related
      PermissionKeys.construction_defect_log,
      PermissionKeys.construction_defect_status_update,
      PermissionKeys.construction_defect_resolve,
      PermissionKeys.construction_defect_approval,
      PermissionKeys.construction_defect_feedback,
      PermissionKeys.construction_defect_open,
      PermissionKeys.construction_defect_close,

      // ITP related
      PermissionKeys.property_itp_submit_task,
      PermissionKeys.property_itp_approve_task,
      PermissionKeys.property_itp_reject_task,
      PermissionKeys.property_itp_reopen_task,

      PermissionKeys.common_area_itp_submit_task,
      PermissionKeys.common_area_itp_approve_task,
      PermissionKeys.common_area_itp_reject_task,
      PermissionKeys.common_area_itp_reopen_task,

      PermissionKeys.site_establishment_itp_submit_task,
      PermissionKeys.site_establishment_itp_approve_task,
      PermissionKeys.site_establishment_itp_reject_task,
      PermissionKeys.site_establishment_itp_reopen_task,

      PermissionKeys.external_work_itp_submit_task,
      PermissionKeys.external_work_itp_approve_task,
      PermissionKeys.external_work_itp_reject_task,
      PermissionKeys.external_work_itp_reopen_task,

      PermissionKeys.construction_itp_submit_task,
      PermissionKeys.construction_itp_approve_task,
      PermissionKeys.construction_itp_reject_task,
      PermissionKeys.construction_itp_reopen_task,

      // Report related
      PermissionKeys.property_defect_full_report,
      PermissionKeys.property_defect_trade_report,
      PermissionKeys.property_defect_inspection_report,
      PermissionKeys.property_defect_inspection_trade_report,
      PermissionKeys.property_itp_full_report,
      PermissionKeys.property_itp_trade_report,
      PermissionKeys.property_itp_inspection_report,
      PermissionKeys.property_itp_inspection_trade_report,

      PermissionKeys.common_area_defect_full_report,
      PermissionKeys.common_area_defect_trade_report,
      PermissionKeys.common_area_defect_inspection_report,
      PermissionKeys.common_area_defect_inspection_trade_report,
      PermissionKeys.common_area_itp_full_report,
      PermissionKeys.common_area_itp_trade_report,
      PermissionKeys.common_area_itp_inspection_report,
      PermissionKeys.common_area_itp_inspection_trade_report,

      PermissionKeys.site_establishment_defect_full_report,
      PermissionKeys.site_establishment_defect_trade_report,

      PermissionKeys.property_defect_appointment_create,
      PermissionKeys.property_defect_appointment_view,
      PermissionKeys.property_defect_appointment_reschedule,
      PermissionKeys.property_defect_appointment_cancel,
      PermissionKeys.property_inspection_appointment_create,
      PermissionKeys.property_inspection_appointment_view,
      PermissionKeys.property_inspection_appointment_reschedule,
      PermissionKeys.property_inspection_appointment_cancel,

      PermissionKeys.common_area_defect_appointment_create,
      PermissionKeys.common_area_defect_appointment_view,
      PermissionKeys.common_area_defect_appointment_reschedule,
      PermissionKeys.common_area_defect_appointment_cancel,
      PermissionKeys.common_area_inspection_appointment_create,
      PermissionKeys.common_area_inspection_appointment_view,
      PermissionKeys.common_area_inspection_appointment_reschedule,
      PermissionKeys.common_area_inspection_appointment_cancel,
    ])

    await attachPermissionsToRole(RoleKeys.branch_auditor, [
      PermissionKeys.web_access,
      PermissionKeys.app_access,

      // Basic Views
      PermissionKeys.branch_view,
      PermissionKeys.property_view,

      // Property Defect Management
      PermissionKeys.property_defect_log,
      PermissionKeys.property_defect_status_update,
      PermissionKeys.property_defect_resolve,
      PermissionKeys.property_defect_approval,
      PermissionKeys.property_defect_feedback,
      PermissionKeys.property_defect_open,
      PermissionKeys.property_defect_close,

      // Property Inspection
      PermissionKeys.property_inspection_start,
      PermissionKeys.property_inspection_end,
      PermissionKeys.property_inspection_defect_log,
      PermissionKeys.property_inspection_defect_status_update,
      PermissionKeys.property_inspection_defect_resolve,

      // Property ITP
      PermissionKeys.property_itp_submit_task,
      PermissionKeys.property_itp_approve_task,
      PermissionKeys.property_itp_reject_task,
      PermissionKeys.property_itp_reopen_task,

      // Common Area Defect Management
      PermissionKeys.common_area_defect_log,
      PermissionKeys.common_area_defect_status_update,
      PermissionKeys.common_area_defect_resolve,
      PermissionKeys.common_area_defect_approval,
      PermissionKeys.common_area_defect_feedback,
      PermissionKeys.common_area_defect_open,
      PermissionKeys.common_area_defect_close,

      // Common Area ITP
      PermissionKeys.common_area_itp_submit_task,
      PermissionKeys.common_area_itp_approve_task,
      PermissionKeys.common_area_itp_reject_task,
      PermissionKeys.common_area_itp_reopen_task,

      // Site Establishment
      PermissionKeys.site_establishment_defect_log,
      PermissionKeys.site_establishment_defect_status_update,
      PermissionKeys.site_establishment_defect_resolve,
      PermissionKeys.site_establishment_defect_approval,
      PermissionKeys.site_establishment_defect_feedback,
      PermissionKeys.site_establishment_defect_open,
      PermissionKeys.site_establishment_defect_close,

      // Site Establishment ITP
      PermissionKeys.site_establishment_itp_submit_task,
      PermissionKeys.site_establishment_itp_approve_task,
      PermissionKeys.site_establishment_itp_reject_task,
      PermissionKeys.site_establishment_itp_reopen_task,

      // External Work
      PermissionKeys.external_work_defect_log,
      PermissionKeys.external_work_defect_status_update,
      PermissionKeys.external_work_defect_resolve,
      PermissionKeys.external_work_defect_approval,
      PermissionKeys.external_work_defect_feedback,
      PermissionKeys.external_work_defect_open,
      PermissionKeys.external_work_defect_close,

      // External Work ITP
      PermissionKeys.external_work_itp_submit_task,
      PermissionKeys.external_work_itp_approve_task,
      PermissionKeys.external_work_itp_reject_task,
      PermissionKeys.external_work_itp_reopen_task,

      // Construction
      PermissionKeys.construction_defect_log,
      PermissionKeys.construction_defect_status_update,
      PermissionKeys.construction_defect_resolve,
      PermissionKeys.construction_defect_approval,
      PermissionKeys.construction_defect_feedback,
      PermissionKeys.construction_defect_open,
      PermissionKeys.construction_defect_close,

      // Construction ITP
      PermissionKeys.construction_itp_submit_task,
      PermissionKeys.construction_itp_approve_task,
      PermissionKeys.construction_itp_reject_task,
      PermissionKeys.construction_itp_reopen_task,

      // Reports
      PermissionKeys.property_defect_full_report,
      PermissionKeys.property_defect_trade_report,
      PermissionKeys.property_itp_full_report,
      PermissionKeys.property_itp_trade_report,
      PermissionKeys.common_area_defect_full_report,
      PermissionKeys.common_area_itp_full_report,
      PermissionKeys.site_establishment_defect_full_report,
      PermissionKeys.external_work_defect_full_report,

      PermissionKeys.common_area_defect_appointment_create,
      PermissionKeys.common_area_defect_appointment_view,
      PermissionKeys.common_area_defect_appointment_reschedule,
      PermissionKeys.common_area_defect_appointment_cancel,
      PermissionKeys.common_area_inspection_appointment_create,
      PermissionKeys.common_area_inspection_appointment_view,
      PermissionKeys.common_area_inspection_appointment_reschedule,
      PermissionKeys.common_area_inspection_appointment_cancel,

      PermissionKeys.organisation_dashboard_view,
      PermissionKeys.organisation_view,
      PermissionKeys.branch_dashboard_view,
      PermissionKeys.branch_configure,
      PermissionKeys.property_user_add,
      PermissionKeys.property_user_remove,
      PermissionKeys.property_user_change_role,
      PermissionKeys.common_area_view,

      PermissionKeys.property_defect_appointment_create,
      PermissionKeys.property_defect_appointment_view,
      PermissionKeys.property_defect_appointment_reschedule,
      PermissionKeys.property_defect_appointment_cancel,
      PermissionKeys.property_inspection_appointment_create,
      PermissionKeys.property_inspection_appointment_view,
      PermissionKeys.property_inspection_appointment_reschedule,
      PermissionKeys.property_inspection_appointment_cancel,
      PermissionKeys.common_area_defect_log_need_approval,
      PermissionKeys.common_area_defect_status_update_need_approval,
      PermissionKeys.common_area_defect_resolve_need_approval,
      PermissionKeys.common_area_inspection_start,
      PermissionKeys.common_area_inspection_end,
      PermissionKeys.common_area_inspection_defect_log,
      PermissionKeys.common_area_inspection_defect_log_need_approval,
      PermissionKeys.common_area_inspection_defect_status_update,
      PermissionKeys.common_area_inspection_defect_status_update_need_approval,
      PermissionKeys.common_area_inspection_defect_resolve,
      PermissionKeys.common_area_inspection_defect_resolve_need_approval,
      PermissionKeys.site_establishment_defect_log_need_approval,
      PermissionKeys.site_establishment_defect_status_update_need_approval,
      PermissionKeys.site_establishment_defect_resolve_need_approval,

      PermissionKeys.external_work_defect_log_need_approval,
      PermissionKeys.external_work_defect_status_update_need_approval,
      PermissionKeys.external_work_defect_resolve_need_approval,

      PermissionKeys.construction_defect_log_need_approval,
      PermissionKeys.construction_defect_status_update_need_approval,
      PermissionKeys.construction_defect_resolve_need_approval,

      PermissionKeys.property_itp_submit_task_need_approval,
      PermissionKeys.common_area_itp_submit_task_need_approval,
      PermissionKeys.site_establishment_itp_submit_task_need_approval,
      PermissionKeys.external_work_itp_submit_task_need_approval,
      PermissionKeys.construction_itp_submit_task_need_approval,
      PermissionKeys.property_defect_inspection_report,
      PermissionKeys.property_defect_inspection_trade_report,
      PermissionKeys.property_itp_inspection_report,

      PermissionKeys.property_itp_inspection_trade_report,
      PermissionKeys.common_area_defect_trade_report,
      PermissionKeys.common_area_defect_inspection_report,
      PermissionKeys.common_area_defect_inspection_trade_report,
      PermissionKeys.common_area_itp_trade_report,
      PermissionKeys.common_area_itp_inspection_report,
      PermissionKeys.common_area_itp_inspection_trade_report,
      PermissionKeys.site_establishment_defect_trade_report,
      PermissionKeys.site_establishment_defect_inspection_report,
      PermissionKeys.site_establishment_defect_inspection_trade_report,
      PermissionKeys.site_establishment_itp_full_report,
      PermissionKeys.site_establishment_itp_trade_report,
      PermissionKeys.site_establishment_itp_inspection_report,
      PermissionKeys.site_establishment_itp_inspection_trade_report,
      PermissionKeys.external_work_defect_trade_report,
      PermissionKeys.external_work_defect_inspection_report,
      PermissionKeys.external_work_defect_inspection_trade_report,
      PermissionKeys.external_work_itp_full_report,
      PermissionKeys.external_work_itp_trade_report,
      PermissionKeys.external_work_itp_inspection_report,
      PermissionKeys.external_work_itp_inspection_trade_report,
      PermissionKeys.construction_defect_full_report,
      PermissionKeys.construction_defect_trade_report,
      PermissionKeys.construction_defect_inspection_report,
      PermissionKeys.construction_defect_inspection_trade_report,
      PermissionKeys.construction_itp_full_report,
      PermissionKeys.construction_itp_trade_report,
      PermissionKeys.construction_itp_inspection_report,
      PermissionKeys.construction_itp_inspection_trade_report,
    ])

    await attachPermissionsToRole(RoleKeys.branch_sales_agent, [
      PermissionKeys.web_access,
      PermissionKeys.app_access,
      // Basic Views
      PermissionKeys.branch_view,
      PermissionKeys.property_view,

      // Property Defect Management
      PermissionKeys.property_defect_log,
      PermissionKeys.property_defect_status_update,
      PermissionKeys.property_defect_resolve,
      PermissionKeys.property_defect_approval,
      PermissionKeys.property_defect_feedback,
      PermissionKeys.property_defect_open,
      PermissionKeys.property_defect_close,

      // Property Inspection
      PermissionKeys.property_inspection_start,
      PermissionKeys.property_inspection_end,
      PermissionKeys.property_inspection_defect_log,
      PermissionKeys.property_inspection_defect_status_update,
      PermissionKeys.property_inspection_defect_resolve,

      // Common Area Defect Management
      PermissionKeys.common_area_defect_log,
      PermissionKeys.common_area_defect_status_update,
      PermissionKeys.common_area_defect_resolve,
      PermissionKeys.common_area_defect_approval,
      PermissionKeys.common_area_defect_feedback,
      PermissionKeys.common_area_defect_open,
      PermissionKeys.common_area_defect_close,

      // Site Establishment
      PermissionKeys.site_establishment_defect_log,
      PermissionKeys.site_establishment_defect_status_update,
      PermissionKeys.site_establishment_defect_resolve,
      PermissionKeys.site_establishment_defect_approval,
      PermissionKeys.site_establishment_defect_feedback,
      PermissionKeys.site_establishment_defect_open,
      PermissionKeys.site_establishment_defect_close,

      // External Work
      PermissionKeys.external_work_defect_log,
      PermissionKeys.external_work_defect_status_update,
      PermissionKeys.external_work_defect_resolve,
      PermissionKeys.external_work_defect_approval,
      PermissionKeys.external_work_defect_feedback,
      PermissionKeys.external_work_defect_open,
      PermissionKeys.external_work_defect_close,

      // Construction
      PermissionKeys.construction_defect_log,
      PermissionKeys.construction_defect_status_update,
      PermissionKeys.construction_defect_resolve,
      PermissionKeys.construction_defect_approval,
      PermissionKeys.construction_defect_feedback,
      PermissionKeys.construction_defect_open,
      PermissionKeys.construction_defect_close,

      // Reports
      PermissionKeys.property_defect_full_report,
      PermissionKeys.property_defect_trade_report,
      PermissionKeys.property_itp_full_report,
      PermissionKeys.property_itp_trade_report,
      PermissionKeys.common_area_defect_full_report,
      PermissionKeys.common_area_itp_full_report,
      PermissionKeys.site_establishment_defect_full_report,
      PermissionKeys.external_work_defect_full_report,
    ])

    await attachPermissionsToRole(RoleKeys.branch_sub_contractor, [
      PermissionKeys.web_access,
      PermissionKeys.app_access,
      // Basic Views
      PermissionKeys.branch_view,
      PermissionKeys.property_view,

      // Property Defect Management
      PermissionKeys.property_defect_log,
      PermissionKeys.property_defect_status_update,
      PermissionKeys.property_defect_resolve,
      PermissionKeys.property_defect_approval,
      PermissionKeys.property_defect_feedback,
      PermissionKeys.property_defect_open,
      PermissionKeys.property_defect_close,

      // Property Inspection
      PermissionKeys.property_inspection_start,
      PermissionKeys.property_inspection_end,
      PermissionKeys.property_inspection_defect_log,
      PermissionKeys.property_inspection_defect_status_update,
      PermissionKeys.property_inspection_defect_resolve,

      // Property ITP
      PermissionKeys.property_itp_submit_task,
      PermissionKeys.property_itp_approve_task,
      PermissionKeys.property_itp_reject_task,
      PermissionKeys.property_itp_reopen_task,

      // Common Area Defect Management
      PermissionKeys.common_area_defect_log,
      PermissionKeys.common_area_defect_status_update,
      PermissionKeys.common_area_defect_resolve,
      PermissionKeys.common_area_defect_approval,
      PermissionKeys.common_area_defect_feedback,
      PermissionKeys.common_area_defect_open,
      PermissionKeys.common_area_defect_close,

      // Common Area ITP
      PermissionKeys.common_area_itp_submit_task,
      PermissionKeys.common_area_itp_approve_task,
      PermissionKeys.common_area_itp_reject_task,
      PermissionKeys.common_area_itp_reopen_task,

      // Site Establishment
      PermissionKeys.site_establishment_defect_log,
      PermissionKeys.site_establishment_defect_status_update,
      PermissionKeys.site_establishment_defect_resolve,
      PermissionKeys.site_establishment_defect_approval,
      PermissionKeys.site_establishment_defect_feedback,
      PermissionKeys.site_establishment_defect_open,
      PermissionKeys.site_establishment_defect_close,

      // Site Establishment ITP
      PermissionKeys.site_establishment_itp_submit_task,
      PermissionKeys.site_establishment_itp_approve_task,
      PermissionKeys.site_establishment_itp_reject_task,
      PermissionKeys.site_establishment_itp_reopen_task,

      // External Work
      PermissionKeys.external_work_defect_log,
      PermissionKeys.external_work_defect_status_update,
      PermissionKeys.external_work_defect_resolve,
      PermissionKeys.external_work_defect_approval,
      PermissionKeys.external_work_defect_feedback,
      PermissionKeys.external_work_defect_open,
      PermissionKeys.external_work_defect_close,

      // External Work ITP
      PermissionKeys.external_work_itp_submit_task,
      PermissionKeys.external_work_itp_approve_task,
      PermissionKeys.external_work_itp_reject_task,
      PermissionKeys.external_work_itp_reopen_task,

      // Construction
      PermissionKeys.construction_defect_log,
      PermissionKeys.construction_defect_status_update,
      PermissionKeys.construction_defect_resolve,
      PermissionKeys.construction_defect_approval,
      PermissionKeys.construction_defect_feedback,
      PermissionKeys.construction_defect_open,
      PermissionKeys.construction_defect_close,

      // Construction ITP
      PermissionKeys.construction_itp_submit_task,
      PermissionKeys.construction_itp_approve_task,
      PermissionKeys.construction_itp_reject_task,
      PermissionKeys.construction_itp_reopen_task,

      // Reports
      PermissionKeys.property_defect_full_report,
      PermissionKeys.property_defect_trade_report,
      PermissionKeys.property_itp_full_report,
      PermissionKeys.property_itp_trade_report,
      PermissionKeys.common_area_defect_full_report,
      PermissionKeys.common_area_itp_full_report,
      PermissionKeys.site_establishment_defect_full_report,
      PermissionKeys.external_work_defect_full_report,
    ])

    await attachPermissionsToRole(RoleKeys.branch_strata, [
      PermissionKeys.app_access,
      // Basic Views
      PermissionKeys.branch_view,
      PermissionKeys.property_view,
      PermissionKeys.common_area_view,

      // Property Defect Management
      PermissionKeys.property_defect_log,
      PermissionKeys.property_defect_status_update,
      PermissionKeys.property_defect_resolve,
      PermissionKeys.property_defect_approval,
      PermissionKeys.property_defect_feedback,
      PermissionKeys.property_defect_open,
      PermissionKeys.property_defect_close,

      // Common Area Defect Management
      PermissionKeys.common_area_defect_log,
      PermissionKeys.common_area_defect_status_update,
      PermissionKeys.common_area_defect_resolve,
      PermissionKeys.common_area_defect_approval,
      PermissionKeys.common_area_defect_feedback,
      PermissionKeys.common_area_defect_open,
      PermissionKeys.common_area_defect_close,

      // Common Area Inspection
      PermissionKeys.common_area_inspection_start,
      PermissionKeys.common_area_inspection_end,
      PermissionKeys.common_area_inspection_defect_log,
      PermissionKeys.common_area_inspection_defect_status_update,
      PermissionKeys.common_area_inspection_defect_resolve,

      // Reports
      PermissionKeys.property_defect_full_report,
      PermissionKeys.property_defect_trade_report,
      PermissionKeys.property_itp_full_report,
      PermissionKeys.property_itp_trade_report,
      PermissionKeys.common_area_defect_full_report,
      PermissionKeys.common_area_defect_trade_report,
      PermissionKeys.common_area_itp_full_report,
      PermissionKeys.common_area_itp_trade_report,
    ])

    await attachPermissionsToRole(RoleKeys.property_owner, [
      PermissionKeys.app_access,

      PermissionKeys.branch_view,
      PermissionKeys.property_view,

      PermissionKeys.property_defect_log_need_approval,
      PermissionKeys.property_defect_feedback,

      PermissionKeys.property_defect_full_report,
      PermissionKeys.property_defect_trade_report,
      PermissionKeys.property_itp_full_report,
      PermissionKeys.property_itp_trade_report,
    ])

    await attachPermissionsToRole(RoleKeys.property_agent, [
      PermissionKeys.app_access,
      // Basic Views
      PermissionKeys.branch_view,
      PermissionKeys.property_view,
      PermissionKeys.property_create,

      // Property Defect Management
      PermissionKeys.property_defect_log,
      PermissionKeys.property_defect_status_update,
      PermissionKeys.property_defect_resolve,
      PermissionKeys.property_defect_feedback,
      PermissionKeys.property_defect_open,
      PermissionKeys.property_defect_close,

      // Property Reports
      PermissionKeys.property_defect_full_report,
      PermissionKeys.property_defect_trade_report,
      PermissionKeys.property_itp_full_report,
      PermissionKeys.property_itp_trade_report,
    ])

    await attachPermissionsToRole(RoleKeys.property_tenant, [
      PermissionKeys.app_access,
      // Basic Views
      PermissionKeys.branch_view,
      PermissionKeys.property_view,
      PermissionKeys.property_create,

      // Property Defect Management
      PermissionKeys.property_defect_log,
      PermissionKeys.property_defect_status_update,
      PermissionKeys.property_defect_resolve,
      PermissionKeys.property_defect_feedback,
      PermissionKeys.property_defect_open,
      PermissionKeys.property_defect_close,

      // Property Reports
      PermissionKeys.property_defect_full_report,
      PermissionKeys.property_defect_trade_report,
      PermissionKeys.property_itp_full_report,
      PermissionKeys.property_itp_trade_report,
    ])
  }
}
