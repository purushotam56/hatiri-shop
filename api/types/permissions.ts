import { LocationListKey } from './location.js'

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

  branch_organisation_add = 'branch_organisation_add',
  branch_organisation_remove = 'branch_organisation_remove',
  branch_worskpace_edit_connection = 'branch_worskpace_edit_connection',

  property_view = 'property_view',
  property_create = 'property_create',
  property_edit = 'property_edit',
  property_delete = 'property_delete',
  property_configure = 'property_configure',

  property_user_add = 'property_user_add',
  property_user_remove = 'property_user_remove',
  property_user_change_role = 'property_user_change_role',

  common_area_view = 'common_area_view',
  common_area_create = 'common_area_create',
  common_area_edit = 'common_area_edit',
  common_area_delete = 'common_area_delete',
  common_area_configure = 'common_area_configure',

  common_area_user_add = 'common_area_user_add',
  common_area_user_remove = 'common_area_user_remove',
  common_area_user_change_role = 'common_area_user_change_role',

  property_defect_log = 'property_defect_log',
  property_defect_log_need_approval = 'property_defect_log_need_approval',
  property_defect_status_update = 'property_defect_status_update',
  property_defect_status_update_need_approval = 'property_defect_status_update_need_approval',
  property_defect_resolve = 'property_defect_resolve',
  property_defect_resolve_need_approval = 'property_defect_resolve_need_approval',
  property_defect_approval = 'property_defect_approval',
  property_defect_feedback = 'property_defect_feedback',
  property_defect_open = 'property_defect_open',
  property_defect_close = 'property_defect_close',

  property_inspection_start = 'property_inspection_start',
  property_inspection_end = 'property_inspection_end',
  property_inspection_defect_log = 'property_inspection_defect_log',
  property_inspection_defect_log_need_approval = 'property_inspection_defect_log_need_approval',
  property_inspection_defect_status_update = 'property_inspection_defect_status_update',
  property_inspection_defect_status_update_need_approval = 'property_inspection_defect_status_update_need_approval',
  property_inspection_defect_resolve = 'property_inspection_defect_resolve',
  property_inspection_defect_resolve_need_approval = 'property_inspection_defect_resolve_need_approval',

  property_defect_appointment_create = 'property_defect_appointment_create',
  property_defect_appointment_view = 'property_defect_appointment_view',
  property_defect_appointment_reschedule = 'property_defect_appointment_reschedule',
  property_defect_appointment_cancel = 'property_defect_appointment_cancel',
  property_inspection_appointment_create = 'property_inspection_appointment_create',
  property_inspection_appointment_view = 'property_inspection_appointment_view',
  property_inspection_appointment_reschedule = 'property_inspection_appointment_reschedule',
  property_inspection_appointment_cancel = 'property_inspection_appointment_cancel',

  common_area_defect_log = 'common_area_defect_log',
  common_area_defect_log_need_approval = 'common_area_defect_log_need_approval',
  common_area_defect_status_update = 'common_area_defect_status_update',
  common_area_defect_status_update_need_approval = 'common_area_defect_status_update_need_approval',
  common_area_defect_resolve = 'common_area_defect_resolve',
  common_area_defect_resolve_need_approval = 'common_area_defect_resolve_need_approval',
  common_area_defect_approval = 'common_area_defect_approval',
  common_area_defect_feedback = 'common_area_defect_feedback',
  common_area_defect_open = 'common_area_defect_open',
  common_area_defect_close = 'common_area_defect_close',

  common_area_inspection_start = 'common_area_inspection_start',
  common_area_inspection_end = 'common_area_inspection_end',
  common_area_inspection_defect_log = 'common_area_inspection_defect_log',
  common_area_inspection_defect_log_need_approval = 'common_area_inspection_defect_log_need_approval',
  common_area_inspection_defect_status_update = 'common_area_inspection_defect_status_update',
  common_area_inspection_defect_status_update_need_approval = 'common_area_inspection_defect_status_update_need_approval',
  common_area_inspection_defect_resolve = 'common_area_inspection_defect_resolve',
  common_area_inspection_defect_resolve_need_approval = 'common_area_inspection_defect_resolve_need_approval',

  common_area_defect_appointment_create = 'common_area_defect_appointment_create',
  common_area_defect_appointment_view = 'common_area_defect_appointment_view',
  common_area_defect_appointment_reschedule = 'common_area_defect_appointment_reschedule',
  common_area_defect_appointment_cancel = 'common_area_defect_appointment_cancel',
  common_area_inspection_appointment_create = 'common_area_inspection_appointment_create',
  common_area_inspection_appointment_view = 'common_area_inspection_appointment_view',
  common_area_inspection_appointment_reschedule = 'common_area_inspection_appointment_reschedule',
  common_area_inspection_appointment_cancel = 'common_area_inspection_appointment_cancel',

  site_establishment_defect_log = 'site_establishment_defect_log',
  site_establishment_defect_log_need_approval = 'site_establishment_defect_log_need_approval',
  site_establishment_defect_status_update = 'site_establishment_defect_status_update',
  site_establishment_defect_status_update_need_approval = 'site_establishment_defect_status_update_need_approval',
  site_establishment_defect_resolve = 'site_establishment_defect_resolve',
  site_establishment_defect_resolve_need_approval = 'site_establishment_defect_resolve_need_approval',
  site_establishment_defect_approval = 'site_establishment_defect_approval',
  site_establishment_defect_feedback = 'site_establishment_defect_feedback',
  site_establishment_defect_open = 'site_establishment_defect_open',
  site_establishment_defect_close = 'site_establishment_defect_close',

  external_work_defect_log = 'external_work_defect_log',
  external_work_defect_log_need_approval = 'external_work_defect_log_need_approval',
  external_work_defect_status_update = 'external_work_defect_status_update',
  external_work_defect_status_update_need_approval = 'external_work_defect_status_update_need_approval',
  external_work_defect_resolve = 'external_work_defect_resolve',
  external_work_defect_resolve_need_approval = 'external_work_defect_resolve_need_approval',
  external_work_defect_approval = 'external_work_defect_approval',
  external_work_defect_feedback = 'external_work_defect_feedback',
  external_work_defect_open = 'external_work_defect_open',
  external_work_defect_close = 'external_work_defect_close',

  construction_defect_log = 'construction_defect_log',
  construction_defect_log_need_approval = 'construction_defect_log_need_approval',
  construction_defect_status_update = 'construction_defect_status_update',
  construction_defect_status_update_need_approval = 'construction_defect_status_update_need_approval',
  construction_defect_resolve = 'construction_defect_resolve',
  construction_defect_resolve_need_approval = 'construction_defect_resolve_need_approval',
  construction_defect_approval = 'construction_defect_approval',
  construction_defect_feedback = 'construction_defect_feedback',
  construction_defect_open = 'construction_defect_open',
  construction_defect_close = 'construction_defect_close',

  property_itp_submit_task = 'property_itp_submit_task',
  property_itp_submit_task_need_approval = 'property_itp_submit_task_need_approval',
  property_itp_approve_task = 'property_itp_approve_task',
  property_itp_reject_task = 'property_itp_reject_task',
  property_itp_reopen_task = 'property_itp_reopen_task',

  common_area_itp_submit_task = 'common_area_itp_submit_task',
  common_area_itp_submit_task_need_approval = 'common_area_itp_submit_task_need_approval',
  common_area_itp_approve_task = 'common_area_itp_approve_task',
  common_area_itp_reject_task = 'common_area_itp_reject_task',
  common_area_itp_reopen_task = 'common_area_itp_reopen_task',

  site_establishment_itp_submit_task = 'site_establishment_itp_submit_task',
  site_establishment_itp_submit_task_need_approval = 'site_establishment_itp_submit_task_need_approval',
  site_establishment_itp_approve_task = 'site_establishment_itp_approve_task',
  site_establishment_itp_reject_task = 'site_establishment_itp_reject_task',
  site_establishment_itp_reopen_task = 'site_establishment_itp_reopen_task',

  external_work_itp_submit_task = 'external_work_itp_submit_task',
  external_work_itp_submit_task_need_approval = 'external_work_itp_submit_task_need_approval',
  external_work_itp_approve_task = 'external_work_itp_approve_task',
  external_work_itp_reject_task = 'external_work_itp_reject_task',
  external_work_itp_reopen_task = 'external_work_itp_reopen_task',

  construction_itp_submit_task = 'construction_itp_submit_task',
  construction_itp_submit_task_need_approval = 'construction_itp_submit_task_need_approval',
  construction_itp_approve_task = 'construction_itp_approve_task',
  construction_itp_reject_task = 'construction_itp_reject_task',
  construction_itp_reopen_task = 'construction_itp_reopen_task',

  property_defect_full_report = 'property_defect_full_report',
  property_defect_trade_report = 'property_defect_trade_report',
  property_defect_inspection_report = 'property_defect_inspection_report',
  property_defect_inspection_trade_report = 'property_defect_inspection_trade_report',
  property_itp_full_report = 'property_itp_full_report',
  property_itp_trade_report = 'property_itp_trade_report',
  property_itp_inspection_report = 'property_itp_inspection_report',
  property_itp_inspection_trade_report = 'property_itp_inspection_trade_report',

  common_area_defect_full_report = 'common_area_defect_full_report',
  common_area_defect_trade_report = 'common_area_defect_trade_report',
  common_area_defect_inspection_report = 'common_area_defect_inspection_report',
  common_area_defect_inspection_trade_report = 'common_area_defect_inspection_trade_report',
  common_area_itp_full_report = 'common_area_itp_full_report',
  common_area_itp_trade_report = 'common_area_itp_trade_report',
  common_area_itp_inspection_report = 'common_area_itp_inspection_report',
  common_area_itp_inspection_trade_report = 'common_area_itp_inspection_trade_report',

  site_establishment_defect_full_report = 'site_establishment_defect_full_report',
  site_establishment_defect_trade_report = 'site_establishment_defect_trade_report',
  site_establishment_defect_inspection_report = 'site_establishment_defect_inspection_report',
  site_establishment_defect_inspection_trade_report = 'site_establishment_defect_inspection_trade_report',
  site_establishment_itp_full_report = 'site_establishment_itp_full_report',
  site_establishment_itp_trade_report = 'site_establishment_itp_trade_report',
  site_establishment_itp_inspection_report = 'site_establishment_itp_inspection_report',
  site_establishment_itp_inspection_trade_report = 'site_establishment_itp_inspection_trade_report',

  external_work_defect_full_report = 'external_work_defect_full_report',
  external_work_defect_trade_report = 'external_work_defect_trade_report',
  external_work_defect_inspection_report = 'external_work_defect_inspection_report',
  external_work_defect_inspection_trade_report = 'external_work_defect_inspection_trade_report',
  external_work_itp_full_report = 'external_work_itp_full_report',
  external_work_itp_trade_report = 'external_work_itp_trade_report',
  external_work_itp_inspection_report = 'external_work_itp_inspection_report',
  external_work_itp_inspection_trade_report = 'external_work_itp_inspection_trade_report',

  construction_defect_full_report = 'construction_defect_full_report',
  construction_defect_trade_report = 'construction_defect_trade_report',
  construction_defect_inspection_report = 'construction_defect_inspection_report',
  construction_defect_inspection_trade_report = 'construction_defect_inspection_trade_report',
  construction_itp_full_report = 'construction_itp_full_report',
  construction_itp_trade_report = 'construction_itp_trade_report',
  construction_itp_inspection_report = 'construction_itp_inspection_report',
  construction_itp_inspection_trade_report = 'construction_itp_inspection_trade_report',
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

  [PermissionKeys.branch_organisation_add]: 'Add Organisation to Branch',
  [PermissionKeys.branch_organisation_remove]: 'Remove Organisation from Branch',
  [PermissionKeys.branch_worskpace_edit_connection]: 'Edit Organisation Connection',

  [PermissionKeys.property_view]: 'View Property',
  [PermissionKeys.property_create]: 'Create Property',
  [PermissionKeys.property_edit]: 'Edit Property',
  [PermissionKeys.property_delete]: 'Delete Property',
  [PermissionKeys.property_configure]: 'Configure Property',

  [PermissionKeys.property_user_add]: 'Add User to Property',
  [PermissionKeys.property_user_remove]: 'Remove User from Property',
  [PermissionKeys.property_user_change_role]: 'Change User Role in Property',

  [PermissionKeys.common_area_view]: 'View Common Area',
  [PermissionKeys.common_area_create]: 'Create Common Area',
  [PermissionKeys.common_area_edit]: 'Edit Common Area',
  [PermissionKeys.common_area_delete]: 'Delete Common Area',
  [PermissionKeys.common_area_configure]: 'Configure Common Area',

  [PermissionKeys.common_area_user_add]: 'Add User to Common Area',
  [PermissionKeys.common_area_user_remove]: 'Remove User from Common Area',
  [PermissionKeys.common_area_user_change_role]: 'Change User Role in Common Area',

  [PermissionKeys.property_defect_log]: 'Log Property Defect',
  [PermissionKeys.property_defect_log_need_approval]: 'Need Approval for Property Defect Log',
  [PermissionKeys.property_defect_status_update]: 'Update Property Defect Status',
  [PermissionKeys.property_defect_status_update_need_approval]:
    'Need Approval for Property Defect Status Update',
  [PermissionKeys.property_defect_resolve]: 'Resolve Property Defect',
  [PermissionKeys.property_defect_resolve_need_approval]:
    'Need Approval for Property Defect Resolution',
  [PermissionKeys.property_defect_approval]: 'Approve Property Defect',
  [PermissionKeys.property_defect_feedback]: 'Provide Property Defect Feedback',
  [PermissionKeys.property_defect_open]: 'Open Property Defect',
  [PermissionKeys.property_defect_close]: 'Close Property Defect',

  [PermissionKeys.property_inspection_start]: 'Start Property Inspection',
  [PermissionKeys.property_inspection_end]: 'End Property Inspection',
  [PermissionKeys.property_inspection_defect_log]: 'Log Property Inspection Defect',
  [PermissionKeys.property_inspection_defect_log_need_approval]:
    'Need Approval for Property Inspection Defect Log',
  [PermissionKeys.property_inspection_defect_status_update]:
    'Update Property Inspection Defect Status',
  [PermissionKeys.property_inspection_defect_status_update_need_approval]:
    'Need Approval for Property Inspection Defect Status Update',
  [PermissionKeys.property_inspection_defect_resolve]: 'Resolve Property Inspection Defect',
  [PermissionKeys.property_inspection_defect_resolve_need_approval]:
    'Need Approval for Property Inspection Defect Resolution',

  [PermissionKeys.property_defect_appointment_create]: 'Create Property Defect Appointment',
  [PermissionKeys.property_defect_appointment_view]: 'View Property Defect Appointment',
  [PermissionKeys.property_defect_appointment_reschedule]: 'Reschedule Property Defect Appointment',
  [PermissionKeys.property_defect_appointment_cancel]: 'Cancel Property Defect Appointment',
  [PermissionKeys.property_inspection_appointment_create]: 'Create Property Inspection Appointment',
  [PermissionKeys.property_inspection_appointment_view]: 'View Property Inspection Appointment',
  [PermissionKeys.property_inspection_appointment_reschedule]:
    'Reschedule Property Inspection Appointment',
  [PermissionKeys.property_inspection_appointment_cancel]: 'Cancel Property Inspection Appointment',

  [PermissionKeys.common_area_defect_log]: 'Log Common Area Defect',
  [PermissionKeys.common_area_defect_log_need_approval]: 'Need Approval for Common Area Defect Log',
  [PermissionKeys.common_area_defect_status_update]: 'Update Common Area Defect Status',
  [PermissionKeys.common_area_defect_status_update_need_approval]:
    'Need Approval for Common Area Defect Status Update',
  [PermissionKeys.common_area_defect_resolve]: 'Resolve Common Area Defect',
  [PermissionKeys.common_area_defect_resolve_need_approval]:
    'Need Approval for Common Area Defect Resolution',
  [PermissionKeys.common_area_defect_approval]: 'Approve Common Area Defect',
  [PermissionKeys.common_area_defect_feedback]: 'Provide Common Area Defect Feedback',
  [PermissionKeys.common_area_defect_open]: 'Open Common Area Defect',
  [PermissionKeys.common_area_defect_close]: 'Close Common Area Defect',

  [PermissionKeys.common_area_inspection_start]: 'Start Common Area Inspection',
  [PermissionKeys.common_area_inspection_end]: 'End Common Area Inspection',
  [PermissionKeys.common_area_inspection_defect_log]: 'Log Common Area Inspection Defect',
  [PermissionKeys.common_area_inspection_defect_log_need_approval]:
    'Need Approval for Common Area Inspection Defect Log',
  [PermissionKeys.common_area_inspection_defect_status_update]:
    'Update Common Area Inspection Defect Status',
  [PermissionKeys.common_area_inspection_defect_status_update_need_approval]:
    'Need Approval for Common Area Inspection Defect Status Update',
  [PermissionKeys.common_area_inspection_defect_resolve]: 'Resolve Common Area Inspection Defect',
  [PermissionKeys.common_area_inspection_defect_resolve_need_approval]:
    'Need Approval for Common Area Inspection Defect Resolution',

  [PermissionKeys.common_area_defect_appointment_create]: 'Create Common Area Defect Appointment',
  [PermissionKeys.common_area_defect_appointment_view]: 'View Common Area Defect Appointment',
  [PermissionKeys.common_area_defect_appointment_reschedule]:
    'Reschedule Common Area Defect Appointment',
  [PermissionKeys.common_area_defect_appointment_cancel]: 'Cancel Common Area Defect Appointment',
  [PermissionKeys.common_area_inspection_appointment_create]:
    'Create Common Area Inspection Appointment',
  [PermissionKeys.common_area_inspection_appointment_view]:
    'View Common Area Inspection Appointment',
  [PermissionKeys.common_area_inspection_appointment_reschedule]:
    'Reschedule Common Area Inspection Appointment',
  [PermissionKeys.common_area_inspection_appointment_cancel]:
    'Cancel Common Area Inspection Appointment',

  [PermissionKeys.site_establishment_defect_log]: 'Log Site Establishment Defect',
  [PermissionKeys.site_establishment_defect_log_need_approval]:
    'Need Approval for Site Establishment Defect Log',
  [PermissionKeys.site_establishment_defect_status_update]:
    'Update Site Establishment Defect Status',
  [PermissionKeys.site_establishment_defect_status_update_need_approval]:
    'Need Approval for Site Establishment Defect Status Update',
  [PermissionKeys.site_establishment_defect_resolve]: 'Resolve Site Establishment Defect',
  [PermissionKeys.site_establishment_defect_resolve_need_approval]:
    'Need Approval for Site Establishment Defect Resolution',
  [PermissionKeys.site_establishment_defect_approval]: 'Approve Site Establishment Defect',
  [PermissionKeys.site_establishment_defect_feedback]: 'Provide Site Establishment Defect Feedback',
  [PermissionKeys.site_establishment_defect_open]: 'Open Site Establishment Defect',
  [PermissionKeys.site_establishment_defect_close]: 'Close Site Establishment Defect',

  [PermissionKeys.external_work_defect_log]: 'Log External Work Defect',
  [PermissionKeys.external_work_defect_log_need_approval]:
    'Need Approval for External Work Defect Log',
  [PermissionKeys.external_work_defect_status_update]: 'Update External Work Defect Status',
  [PermissionKeys.external_work_defect_status_update_need_approval]:
    'Need Approval for External Work Defect Status Update',
  [PermissionKeys.external_work_defect_resolve]: 'Resolve External Work Defect',
  [PermissionKeys.external_work_defect_resolve_need_approval]:
    'Need Approval for External Work Defect Resolution',
  [PermissionKeys.external_work_defect_approval]: 'Approve External Work Defect',
  [PermissionKeys.external_work_defect_feedback]: 'Provide External Work Defect Feedback',
  [PermissionKeys.external_work_defect_open]: 'Open External Work Defect',
  [PermissionKeys.external_work_defect_close]: 'Close External Work Defect',

  [PermissionKeys.construction_defect_log]: 'Log Construction Defect',
  [PermissionKeys.construction_defect_log_need_approval]:
    'Need Approval for Construction Defect Log',
  [PermissionKeys.construction_defect_status_update]: 'Update Construction Defect Status',
  [PermissionKeys.construction_defect_status_update_need_approval]:
    'Need Approval for Construction Defect Status Update',
  [PermissionKeys.construction_defect_resolve]: 'Resolve Construction Defect',
  [PermissionKeys.construction_defect_resolve_need_approval]:
    'Need Approval for Construction Defect Resolution',
  [PermissionKeys.construction_defect_approval]: 'Approve Construction Defect',
  [PermissionKeys.construction_defect_feedback]: 'Provide Construction Defect Feedback',
  [PermissionKeys.construction_defect_open]: 'Open Construction Defect',
  [PermissionKeys.construction_defect_close]: 'Close Construction Defect',

  [PermissionKeys.property_itp_submit_task]: 'Submit Property ITP Task',
  [PermissionKeys.property_itp_submit_task_need_approval]:
    'Need Approval for Property ITP Task Submission',
  [PermissionKeys.property_itp_approve_task]: 'Approve Property ITP Task',
  [PermissionKeys.property_itp_reject_task]: 'Reject Property ITP Task',
  [PermissionKeys.property_itp_reopen_task]: 'Reopen Property ITP Task',

  [PermissionKeys.common_area_itp_submit_task]: 'Submit Common Area ITP Task',
  [PermissionKeys.common_area_itp_submit_task_need_approval]:
    'Need Approval for Common Area ITP Task Submission',
  [PermissionKeys.common_area_itp_approve_task]: 'Approve Common Area ITP Task',
  [PermissionKeys.common_area_itp_reject_task]: 'Reject Common Area ITP Task',
  [PermissionKeys.common_area_itp_reopen_task]: 'Reopen Common Area ITP Task',

  [PermissionKeys.site_establishment_itp_submit_task]: 'Submit Site Establishment ITP Task',
  [PermissionKeys.site_establishment_itp_submit_task_need_approval]:
    'Need Approval for Site Establishment ITP Task Submission',
  [PermissionKeys.site_establishment_itp_approve_task]: 'Approve Site Establishment ITP Task',
  [PermissionKeys.site_establishment_itp_reject_task]: 'Reject Site Establishment ITP Task',
  [PermissionKeys.site_establishment_itp_reopen_task]: 'Reopen Site Establishment ITP Task',

  [PermissionKeys.external_work_itp_submit_task]: 'Submit External Work ITP Task',
  [PermissionKeys.external_work_itp_submit_task_need_approval]:
    'Need Approval for External Work ITP Task Submission',
  [PermissionKeys.external_work_itp_approve_task]: 'Approve External Work ITP Task',
  [PermissionKeys.external_work_itp_reject_task]: 'Reject External Work ITP Task',
  [PermissionKeys.external_work_itp_reopen_task]: 'Reopen External Work ITP Task',

  [PermissionKeys.construction_itp_submit_task]: 'Submit Construction ITP Task',
  [PermissionKeys.construction_itp_submit_task_need_approval]:
    'Need Approval for Construction ITP Task Submission',
  [PermissionKeys.construction_itp_approve_task]: 'Approve Construction ITP Task',
  [PermissionKeys.construction_itp_reject_task]: 'Reject Construction ITP Task',
  [PermissionKeys.construction_itp_reopen_task]: 'Reopen Construction ITP Task',

  [PermissionKeys.property_defect_full_report]: 'View Property Defect Full Report',
  [PermissionKeys.property_defect_trade_report]: 'View Property Defect Trade Report',
  [PermissionKeys.property_defect_inspection_report]: 'View Property Defect Inspection Report',
  [PermissionKeys.property_defect_inspection_trade_report]:
    'View Property Defect Inspection Trade Report',
  [PermissionKeys.property_itp_full_report]: 'View Property ITP Full Report',
  [PermissionKeys.property_itp_trade_report]: 'View Property ITP Trade Report',
  [PermissionKeys.property_itp_inspection_report]: 'View Property ITP Inspection Report',
  [PermissionKeys.property_itp_inspection_trade_report]:
    'View Property ITP Inspection Trade Report',

  [PermissionKeys.common_area_defect_full_report]: 'View Common Area Defect Full Report',
  [PermissionKeys.common_area_defect_trade_report]: 'View Common Area Defect Trade Report',
  [PermissionKeys.common_area_defect_inspection_report]:
    'View Common Area Defect Inspection Report',
  [PermissionKeys.common_area_defect_inspection_trade_report]:
    'View Common Area Defect Inspection Trade Report',
  [PermissionKeys.common_area_itp_full_report]: 'View Common Area ITP Full Report',
  [PermissionKeys.common_area_itp_trade_report]: 'View Common Area ITP Trade Report',
  [PermissionKeys.common_area_itp_inspection_report]: 'View Common Area ITP Inspection Report',
  [PermissionKeys.common_area_itp_inspection_trade_report]:
    'View Common Area ITP Inspection Trade Report',

  [PermissionKeys.site_establishment_defect_full_report]:
    'View Site Establishment Defect Full Report',
  [PermissionKeys.site_establishment_defect_trade_report]:
    'View Site Establishment Defect Trade Report',
  [PermissionKeys.site_establishment_defect_inspection_report]:
    'View Site Establishment Defect Inspection Report',
  [PermissionKeys.site_establishment_defect_inspection_trade_report]:
    'View Site Establishment Defect Inspection Trade Report',
  [PermissionKeys.site_establishment_itp_full_report]: 'View Site Establishment ITP Full Report',
  [PermissionKeys.site_establishment_itp_trade_report]: 'View Site Establishment ITP Trade Report',
  [PermissionKeys.site_establishment_itp_inspection_report]:
    'View Site Establishment ITP Inspection Report',
  [PermissionKeys.site_establishment_itp_inspection_trade_report]:
    'View Site Establishment ITP Inspection Trade Report',

  [PermissionKeys.external_work_defect_full_report]: 'View External Work Defect Full Report',
  [PermissionKeys.external_work_defect_trade_report]: 'View External Work Defect Trade Report',
  [PermissionKeys.external_work_defect_inspection_report]:
    'View External Work Defect Inspection Report',
  [PermissionKeys.external_work_defect_inspection_trade_report]:
    'View External Work Defect Inspection Trade Report',
  [PermissionKeys.external_work_itp_full_report]: 'View External Work ITP Full Report',
  [PermissionKeys.external_work_itp_trade_report]: 'View External Work ITP Trade Report',
  [PermissionKeys.external_work_itp_inspection_report]: 'View External Work ITP Inspection Report',
  [PermissionKeys.external_work_itp_inspection_trade_report]:
    'View External Work ITP Inspection Trade Report',

  [PermissionKeys.construction_defect_full_report]: 'View Construction Defect Full Report',
  [PermissionKeys.construction_defect_trade_report]: 'View Construction Defect Trade Report',
  [PermissionKeys.construction_defect_inspection_report]:
    'View Construction Defect Inspection Report',
  [PermissionKeys.construction_defect_inspection_trade_report]:
    'View Construction Defect Inspection Trade Report',
  [PermissionKeys.construction_itp_full_report]: 'View Construction ITP Full Report',
  [PermissionKeys.construction_itp_trade_report]: 'View Construction ITP Trade Report',
  [PermissionKeys.construction_itp_inspection_report]: 'View Construction ITP Inspection Report',
  [PermissionKeys.construction_itp_inspection_trade_report]:
    'View Construction ITP Inspection Trade Report',
}

export enum ExternalPermissionKeys {
  view = 'view',
  dashboard_view = 'dashboard_view',
  defect_analytics_view = 'defect_analytics_view',
  itp_analytics_view = 'itp_analytics_view',
  user_add = 'user_add',
  user_remove = 'user_remove',
  user_change_role = 'user_change_role',
  defect_log = 'defect_log',
  defect_log_need_approval = 'defect_log_need_approval',
  defect_status_update = 'defect_status_update',
  defect_approval = 'defect_approval',
  inspection = 'inspection',
  defect_appointment_create = 'defect_appointment_create',
  defect_appointment_view = 'defect_appointment_view',
  defect_appointment_reschedule = 'defect_appointment_reschedule',
  defect_appointment_cancel = 'defect_appointment_cancel',
  inspection_appointment_create = 'inspection_appointment_create',
  inspection_appointment_view = 'inspection_appointment_view',
  inspection_appointment_reschedule = 'inspection_appointment_reschedule',
  inspection_appointment_cancel = 'inspection_appointment_cancel',
  itp = 'itp',
  itp_submit_task = 'itp_submit_task',
  itp_approve_task = 'itp_approve_task',
  itp_reopen_task = 'itp_reopen_task',
  report_view = 'report_view',
}

export const ExternalPermissionKeysDetails = {
  [ExternalPermissionKeys.view]: 'View Details',
  [ExternalPermissionKeys.dashboard_view]: 'View Dashboard',
  [ExternalPermissionKeys.defect_analytics_view]: 'View Defect Analytics',
  [ExternalPermissionKeys.itp_analytics_view]: 'View ITP Analytics',
  [ExternalPermissionKeys.user_add]: 'Add User',
  [ExternalPermissionKeys.user_remove]: 'Remove User',
  [ExternalPermissionKeys.user_change_role]: 'Change User Role',
  [ExternalPermissionKeys.defect_log]: 'Log Defect',
  [ExternalPermissionKeys.defect_log_need_approval]: 'Log Defect But Need Approval',
  [ExternalPermissionKeys.defect_status_update]: 'Update Defect Status',
  [ExternalPermissionKeys.defect_approval]: 'Approve Defect',
  [ExternalPermissionKeys.inspection]: 'Inspection',
  [ExternalPermissionKeys.defect_appointment_create]: 'Create Defect Appointment',
  [ExternalPermissionKeys.defect_appointment_view]: 'View Defect Appointment',
  [ExternalPermissionKeys.defect_appointment_reschedule]: 'Reschedule Defect Appointment',
  [ExternalPermissionKeys.defect_appointment_cancel]: 'Cancel Defect Appointment',
  [ExternalPermissionKeys.inspection_appointment_create]: 'Create Inspection Appointment',
  [ExternalPermissionKeys.inspection_appointment_view]: 'View Inspection Appointment',
  [ExternalPermissionKeys.inspection_appointment_reschedule]: 'Reschedule Inspection Appointment',
  [ExternalPermissionKeys.inspection_appointment_cancel]: 'Cancel Inspection Appointment',
  [ExternalPermissionKeys.itp]: 'ITP view',
  [ExternalPermissionKeys.itp_submit_task]: 'Submit ITP Task',
  [ExternalPermissionKeys.itp_approve_task]: 'Approve ITP Task',
  [ExternalPermissionKeys.itp_reopen_task]: 'Reopen ITP Task',
  [ExternalPermissionKeys.report_view]: 'View Reports',
}

export const permissionGroups = {
  [LocationListKey.PROPERTY]: {
    defect: [
      ExternalPermissionKeys.defect_log,
      ExternalPermissionKeys.defect_log_need_approval,
      ExternalPermissionKeys.defect_status_update,
      // ExternalPermissionKeys.def
    ],
  },
}

export const MobilePermissions = {
  common: {
    [ExternalPermissionKeys.defect_appointment_create]: [
      PermissionKeys.common_area_defect_appointment_create,
      PermissionKeys.property_defect_appointment_create,
    ],
    [ExternalPermissionKeys.defect_appointment_view]: [
      PermissionKeys.common_area_defect_appointment_view,
      PermissionKeys.property_defect_appointment_view,
    ],
    [ExternalPermissionKeys.defect_appointment_reschedule]: [
      PermissionKeys.common_area_defect_appointment_reschedule,
      PermissionKeys.property_defect_appointment_reschedule,
    ],
    [ExternalPermissionKeys.defect_appointment_cancel]: [
      PermissionKeys.common_area_defect_appointment_cancel,
      PermissionKeys.property_defect_appointment_cancel,
    ],
    [ExternalPermissionKeys.inspection_appointment_create]: [
      PermissionKeys.common_area_inspection_appointment_create,
      PermissionKeys.property_inspection_appointment_create,
    ],
    [ExternalPermissionKeys.inspection_appointment_view]: [
      PermissionKeys.common_area_inspection_appointment_view,
      PermissionKeys.property_inspection_appointment_view,
    ],
    [ExternalPermissionKeys.inspection_appointment_reschedule]: [
      PermissionKeys.common_area_inspection_appointment_reschedule,
      PermissionKeys.property_inspection_appointment_reschedule,
    ],
    [ExternalPermissionKeys.inspection_appointment_cancel]: [
      PermissionKeys.common_area_inspection_appointment_cancel,
      PermissionKeys.property_inspection_appointment_cancel,
    ],
  },
  [LocationListKey.SITE_ESTABLISHMENT]: {
    [ExternalPermissionKeys.view]: [
      PermissionKeys.site_establishment_defect_approval,
      PermissionKeys.site_establishment_defect_close,
      PermissionKeys.site_establishment_defect_feedback,
    ],
    [ExternalPermissionKeys.defect_analytics_view]: [
      PermissionKeys.site_establishment_defect_full_report,
      PermissionKeys.site_establishment_defect_trade_report,
    ],
    [ExternalPermissionKeys.itp_analytics_view]: [
      PermissionKeys.site_establishment_itp_full_report,
      PermissionKeys.site_establishment_itp_trade_report,
    ],
    [ExternalPermissionKeys.defect_log]: [PermissionKeys.site_establishment_defect_log],
    [ExternalPermissionKeys.defect_status_update]: [
      PermissionKeys.site_establishment_defect_status_update,
    ],
    [ExternalPermissionKeys.defect_approval]: [PermissionKeys.site_establishment_defect_approval],
    [ExternalPermissionKeys.itp_submit_task]: [PermissionKeys.site_establishment_itp_submit_task],
    [ExternalPermissionKeys.itp_approve_task]: [PermissionKeys.site_establishment_itp_approve_task],
    [ExternalPermissionKeys.itp_reopen_task]: [PermissionKeys.site_establishment_itp_reopen_task],
    [ExternalPermissionKeys.report_view]: [
      PermissionKeys.site_establishment_defect_full_report,
      PermissionKeys.site_establishment_defect_trade_report,
      PermissionKeys.site_establishment_itp_full_report,
      PermissionKeys.site_establishment_itp_trade_report,
    ],
  },
  [LocationListKey.EXTERNAL_WORK]: {
    [ExternalPermissionKeys.view]: [
      PermissionKeys.external_work_defect_approval,
      PermissionKeys.external_work_defect_close,
      PermissionKeys.external_work_defect_feedback,
    ],
    [ExternalPermissionKeys.defect_analytics_view]: [
      PermissionKeys.external_work_defect_full_report,
      PermissionKeys.external_work_defect_trade_report,
    ],
    [ExternalPermissionKeys.itp_analytics_view]: [
      PermissionKeys.external_work_itp_full_report,
      PermissionKeys.external_work_itp_trade_report,
    ],
    [ExternalPermissionKeys.defect_log]: [PermissionKeys.external_work_defect_log],
    [ExternalPermissionKeys.defect_status_update]: [
      PermissionKeys.external_work_defect_status_update,
    ],
    [ExternalPermissionKeys.defect_approval]: [PermissionKeys.external_work_defect_approval],
    [ExternalPermissionKeys.itp_submit_task]: [PermissionKeys.external_work_itp_submit_task],
    [ExternalPermissionKeys.itp_approve_task]: [PermissionKeys.external_work_itp_approve_task],
    [ExternalPermissionKeys.itp_reopen_task]: [PermissionKeys.external_work_itp_reopen_task],
    [ExternalPermissionKeys.report_view]: [
      PermissionKeys.external_work_defect_full_report,
      PermissionKeys.external_work_defect_trade_report,
      PermissionKeys.external_work_itp_full_report,
      PermissionKeys.external_work_itp_trade_report,
    ],
  },
  [LocationListKey.CONSTRUCTION]: {
    [ExternalPermissionKeys.view]: [
      PermissionKeys.construction_defect_approval,
      PermissionKeys.construction_defect_close,
      PermissionKeys.construction_defect_feedback,
    ],
    [ExternalPermissionKeys.dashboard_view]: [
      PermissionKeys.construction_defect_log,
      PermissionKeys.construction_defect_status_update,
      PermissionKeys.construction_defect_resolve,
    ],
    [ExternalPermissionKeys.defect_analytics_view]: [
      PermissionKeys.construction_defect_full_report,
      PermissionKeys.construction_defect_trade_report,
    ],
    [ExternalPermissionKeys.itp_analytics_view]: [
      PermissionKeys.construction_itp_full_report,
      PermissionKeys.construction_itp_trade_report,
    ],
    [ExternalPermissionKeys.defect_log]: [PermissionKeys.construction_defect_log],
    [ExternalPermissionKeys.defect_status_update]: [
      PermissionKeys.construction_defect_status_update,
    ],
    [ExternalPermissionKeys.defect_approval]: [PermissionKeys.construction_defect_approval],
    [ExternalPermissionKeys.itp_submit_task]: [PermissionKeys.construction_itp_submit_task],
    [ExternalPermissionKeys.itp_approve_task]: [PermissionKeys.construction_itp_approve_task],
    [ExternalPermissionKeys.itp_reopen_task]: [PermissionKeys.construction_itp_reopen_task],
    [ExternalPermissionKeys.report_view]: [
      PermissionKeys.construction_defect_full_report,
      PermissionKeys.construction_defect_trade_report,
      PermissionKeys.construction_itp_full_report,
      PermissionKeys.construction_itp_trade_report,
    ],
  },
  [LocationListKey.COMMON_AREA]: {
    [ExternalPermissionKeys.view]: [
      PermissionKeys.common_area_defect_approval,
      PermissionKeys.common_area_defect_close,
      PermissionKeys.common_area_defect_feedback,
    ],
    [ExternalPermissionKeys.dashboard_view]: [
      PermissionKeys.common_area_defect_log,
      PermissionKeys.common_area_defect_status_update,
      PermissionKeys.common_area_defect_resolve,
    ],
    [ExternalPermissionKeys.defect_analytics_view]: [
      PermissionKeys.common_area_defect_full_report,
      PermissionKeys.common_area_defect_trade_report,
    ],
    [ExternalPermissionKeys.itp_analytics_view]: [
      PermissionKeys.common_area_itp_full_report,
      PermissionKeys.common_area_itp_trade_report,
    ],
    [ExternalPermissionKeys.defect_log]: [
      PermissionKeys.common_area_defect_log,
      PermissionKeys.common_area_inspection_defect_log,
      PermissionKeys.common_area_defect_log_need_approval,
    ],
    [ExternalPermissionKeys.defect_status_update]: [
      PermissionKeys.common_area_defect_status_update,
      PermissionKeys.common_area_inspection_defect_status_update,
    ],
    [ExternalPermissionKeys.defect_approval]: [PermissionKeys.common_area_defect_approval],
    [ExternalPermissionKeys.inspection]: [
      PermissionKeys.common_area_inspection_start,
      PermissionKeys.common_area_inspection_end,
    ],
    [ExternalPermissionKeys.defect_appointment_create]: [
      PermissionKeys.common_area_defect_appointment_create,
    ],
    [ExternalPermissionKeys.defect_appointment_view]: [
      PermissionKeys.common_area_defect_appointment_view,
    ],
    [ExternalPermissionKeys.defect_appointment_reschedule]: [
      PermissionKeys.common_area_defect_appointment_reschedule,
    ],
    [ExternalPermissionKeys.defect_appointment_cancel]: [
      PermissionKeys.common_area_defect_appointment_cancel,
    ],
    [ExternalPermissionKeys.inspection_appointment_create]: [
      PermissionKeys.common_area_inspection_appointment_create,
    ],
    [ExternalPermissionKeys.inspection_appointment_view]: [
      PermissionKeys.common_area_inspection_appointment_view,
    ],
    [ExternalPermissionKeys.inspection_appointment_reschedule]: [
      PermissionKeys.common_area_inspection_appointment_reschedule,
    ],
    [ExternalPermissionKeys.inspection_appointment_cancel]: [
      PermissionKeys.common_area_inspection_appointment_cancel,
    ],
    [ExternalPermissionKeys.itp]: [PermissionKeys.common_area_itp_submit_task],
    [ExternalPermissionKeys.itp_submit_task]: [PermissionKeys.common_area_itp_submit_task],
    [ExternalPermissionKeys.itp_approve_task]: [PermissionKeys.common_area_itp_approve_task],
    [ExternalPermissionKeys.itp_reopen_task]: [PermissionKeys.common_area_itp_reopen_task],
    [ExternalPermissionKeys.report_view]: [
      PermissionKeys.common_area_defect_full_report,
      PermissionKeys.common_area_defect_trade_report,
      PermissionKeys.common_area_itp_full_report,
      PermissionKeys.common_area_itp_trade_report,
    ],
  },
  [LocationListKey.PROPERTY]: {
    [ExternalPermissionKeys.view]: [
      PermissionKeys.property_defect_approval,
      PermissionKeys.property_defect_close,
      PermissionKeys.property_defect_feedback,
    ],
    [ExternalPermissionKeys.dashboard_view]: [
      PermissionKeys.property_defect_log,
      PermissionKeys.property_defect_status_update,
      PermissionKeys.property_defect_resolve,
    ],
    [ExternalPermissionKeys.defect_analytics_view]: [
      PermissionKeys.property_defect_full_report,
      PermissionKeys.property_defect_trade_report,
    ],
    [ExternalPermissionKeys.itp_analytics_view]: [
      PermissionKeys.property_itp_full_report,
      PermissionKeys.property_itp_trade_report,
    ],
    [ExternalPermissionKeys.user_add]: [PermissionKeys.property_user_add],
    [ExternalPermissionKeys.user_remove]: [PermissionKeys.property_user_remove],
    [ExternalPermissionKeys.user_change_role]: [PermissionKeys.property_user_change_role],
    [ExternalPermissionKeys.defect_log]: [
      PermissionKeys.property_defect_log,
      PermissionKeys.property_inspection_defect_log,
      PermissionKeys.property_defect_log_need_approval,
    ],
    [ExternalPermissionKeys.defect_status_update]: [
      PermissionKeys.property_defect_status_update,
      PermissionKeys.property_inspection_defect_status_update,
    ],
    [ExternalPermissionKeys.defect_approval]: [PermissionKeys.property_defect_approval],
    [ExternalPermissionKeys.inspection]: [
      PermissionKeys.property_inspection_start,
      PermissionKeys.property_inspection_end,
    ],
    [ExternalPermissionKeys.defect_appointment_create]: [
      PermissionKeys.property_defect_appointment_create,
    ],
    [ExternalPermissionKeys.defect_appointment_view]: [
      PermissionKeys.property_defect_appointment_view,
    ],
    [ExternalPermissionKeys.defect_appointment_reschedule]: [
      PermissionKeys.property_defect_appointment_reschedule,
    ],
    [ExternalPermissionKeys.defect_appointment_cancel]: [
      PermissionKeys.property_defect_appointment_cancel,
    ],
    [ExternalPermissionKeys.inspection_appointment_create]: [
      PermissionKeys.property_inspection_appointment_create,
    ],
    [ExternalPermissionKeys.inspection_appointment_view]: [
      PermissionKeys.property_inspection_appointment_view,
    ],
    [ExternalPermissionKeys.inspection_appointment_reschedule]: [
      PermissionKeys.property_inspection_appointment_reschedule,
    ],
    [ExternalPermissionKeys.inspection_appointment_cancel]: [
      PermissionKeys.property_inspection_appointment_cancel,
    ],
    [ExternalPermissionKeys.itp]: [PermissionKeys.common_area_itp_submit_task],
    [ExternalPermissionKeys.itp_submit_task]: [PermissionKeys.property_itp_submit_task],
    [ExternalPermissionKeys.itp_approve_task]: [PermissionKeys.property_itp_approve_task],
    [ExternalPermissionKeys.itp_reopen_task]: [PermissionKeys.property_itp_reopen_task],
    [ExternalPermissionKeys.report_view]: [
      PermissionKeys.property_defect_full_report,
      PermissionKeys.property_defect_trade_report,
      PermissionKeys.property_itp_full_report,
      PermissionKeys.property_itp_trade_report,
    ],
  },
}

export const MobilePermissionsList = () => {
  const permissions: any = {}
  for (const lck of Object.keys(MobilePermissions) as Array<keyof typeof MobilePermissions>) {
    const locationPermissions = MobilePermissions[lck]
    permissions[lck] = Object.keys(locationPermissions)
  }
  return permissions
}

export const PermissionMapper = (permissionKeys: PermissionKeys[]) => {
  const permissions = []
  for (const lck of Object.keys(MobilePermissions) as Array<keyof typeof MobilePermissions>) {
    const locationPermissions = MobilePermissions[lck]
    for (const extrK of Object.keys(locationPermissions) as Array<
      keyof typeof locationPermissions
    >) {
      if (
        (locationPermissions[extrK] as PermissionKeys[]).some((k) => permissionKeys.includes(k))
      ) {
        permissions.push({
          key: extrK,
          resource: lck,
          title: ExternalPermissionKeysDetails[extrK],
        })
      }
    }
  }
  return permissions
}
