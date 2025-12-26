import { BranchMaintenanceServiceType, BranchType } from '#types/branch'
import vine from '@vinejs/vine'
import { userSchemaWithRole } from './user.js'
import { RoleAccessLevel } from '#types/role'

/**
 * Validator to validate the payload when creating
 * a new branch.
 */
export const createBranchValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
    organisationId: vine.number(),
    regionId: vine.number(),
    timezoneId: vine.number(),
    type: vine.enum(BranchType),
    maintenanceServiceType: vine.enum(BranchMaintenanceServiceType),
    numBasementLevels: vine.number().optional(),
    address: vine.string().trim(),
    blockBuildingNo: vine.string().trim().optional(),
    imageId: vine.number().optional(),
  })
)

/**
 * Validator to validate the payload when updating
 * an existing branch.
 */
export const updateBranchValidator = vine.compile(
  vine.object({
    name: vine.string().trim().optional(),
    type: vine.enum(BranchType).optional(),
    maintenanceServiceType: vine.enum(BranchMaintenanceServiceType).optional(),
    address: vine.string().trim().optional(),
    blockBuildingNo: vine.string().trim().optional(),
    imageId: vine.number().optional(),
    numBasementLevels: vine.number().optional(),
    legacyDocuments: vine.array(vine.number()).minLength(1).optional(),
    regionId: vine.number().optional(),
    timezoneId: vine.number().optional(),
  })
)

export const createBranchUserValidator = vine.compile(userSchemaWithRole)

export const createBranchUserRoleValidator = vine.compile(
  vine.array(
    vine.object({
      roleAccessLevel: vine.string().trim().startsWith(RoleAccessLevel.branch),
    })
  )
)
