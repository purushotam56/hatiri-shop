import { RoleKeys } from '#types/role'
import vine from '@vinejs/vine'

// const customAuditorMessage = new SimpleMessagesProvider({
//   'roleKey.startsWith': `only {{substring}} can perform this action `,
//   'roleKey.required': `only auditor can perform this action `,
// })

export const branchAuditorRoleValidator = vine.compile(
  vine.object({
    roleKey: vine.string().trim().startsWith(RoleKeys.branch_auditor),
  })
)

// branchAuditorRoleValidator.messagesProvider = customAuditorMessage

export const propertyOwnerRoleValidator = vine.compile(
  vine.object({
    roleKey: vine.string().trim().startsWith(RoleKeys.property_owner),
  })
)

export const branchSubContractorRoleValidator = vine.compile(
  vine.object({
    roleKey: vine.string().trim().startsWith(RoleKeys.branch_sub_contractor),
  })
)

export const branchStrataRoleValidator = vine.compile(
  vine.object({
    roleKey: vine.string().trim().startsWith(RoleKeys.branch_strata),
  })
)

export const propertyOwnerOrBranchStrataRoleValidator = vine.compile(
  vine.object({
    roleKey: vine.enum([RoleKeys.branch_strata, RoleKeys.property_owner]),
  })
)

export const propertyRolesValidator = vine.compile(
  vine.object({
    roleKey: vine.enum([
      RoleKeys.property_owner,
      RoleKeys.property_agent,
      RoleKeys.property_tenant,
    ]),
  })
)

export const propertyDefectLogRolesValidator = vine.compile(
  vine.object({
    roleKey: vine.enum([
      RoleKeys.property_owner,
      RoleKeys.branch_strata,
      RoleKeys.property_agent,
      RoleKeys.property_tenant,
    ]),
  })
)

export const inspectionRolesValidator = vine.compile(
  vine.object({
    roleKey: vine.enum([
      RoleKeys.branch_auditor,
      RoleKeys.property_owner,
      RoleKeys.property_agent,
      RoleKeys.property_tenant,
      RoleKeys.branch_sales_agent,
    ]),
  })
)

export const inspectionBranchRolesValidator = vine.compile(
  vine.object({
    roleKey: vine.enum([RoleKeys.branch_auditor, RoleKeys.branch_sales_agent]),
  })
)
