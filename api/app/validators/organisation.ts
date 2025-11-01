import { CompanyRoles, RoleAccessLevel } from '#types/role'
import vine from '@vinejs/vine'
import { userSchemaWithRole } from './user.js'

/**
 * Validator to validate the payload when creating
 * a new organisation.
 */
export const createOrganisationValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
    stateId: vine.number().optional(),
    addressLine1: vine.string(),
    addressLine2: vine.string().optional(),
    postalCode: vine.string().optional(),
    organisationRoleType: vine.enum(CompanyRoles),
    blockBuildingNo: vine.string().trim(),
    currency: vine.string().trim().escape(),
    dateFormat: vine.string().trim(),
    imageId: vine.number(),
    countryId: vine.number(),
    timezoneId: vine.number().optional(),
    organisationUniqueCode: vine.string().trim(),
    users: vine.array(userSchemaWithRole).minLength(1),
  })
)

const schema = vine.array(
  vine.object({
    roleAccessLevel: vine.string().trim().startsWith(RoleAccessLevel.organisation),
  })
)

/**
 * Validator to validate the payload when creating
 * a new organisation.
 */
export const createOrganisationUserRoleValidator = vine.compile(schema)

export const createOrganisationUserValidator = vine.compile(userSchemaWithRole)

/**
 * Validator to validate the payload when updating
 * an existing organisation.
 */
export const updateOrganisationValidator = vine.compile(
  vine.object({
    name: vine.string().trim().optional(),
    currency: vine.string().trim().escape().optional(),
    dateFormat: vine.string().trim().optional(),
    imageId: vine.number().optional(),
    timezoneId: vine.number().optional(),
    id: vine.number(),
    countryId: vine.number(),
    stateId: vine.number().optional(),
    addressLine1: vine.string(),
    addressLine2: vine.string().optional(),
    postalCode: vine.string().optional(),
    organisationUniqueCode: vine.string().trim().optional(),
    organisationRoleType: vine.enum(CompanyRoles),
  })
)
