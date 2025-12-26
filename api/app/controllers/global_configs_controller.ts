import { errorHandler } from '#helper/error_handler'
import Role from '#models/role'

import {
  BranchFloorsList,
  BranchMaintenanceServiceType,
  BranchMaintenanceServiceTypeList,
  BranchType,
  BranchTypeList,
} from '#types/branch'
import { RoleAccessLevel, RoleAccessLevelList, RoleKeys } from '#types/role'

import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { existsSync, readFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

export default class GlobalConfigsController {
  async globalConfigList({}: HttpContext) {
    try {
      const roles = await Role.query().select([
        'id',
        'roleName',
        'roleDescription',
        'roleKey',
        'roleAccessLevel',
      ])

      return {
        roles,
        roleAccessLevel: RoleAccessLevel,
        roleAccessLevelList: RoleAccessLevelList,
        branchMaintenanceServiceType: BranchMaintenanceServiceType,
        branchMaintenanceServiceTypeList: BranchMaintenanceServiceTypeList,
        branchType: BranchType,
        branchTypeList: BranchTypeList,
        branchFloorsList: BranchFloorsList,
      }
    } catch (error) {
      return errorHandler(error)
    }
  }

  async privateConfigs({}: HttpContext) {
    try {
      const roles = await Role.query().select([
        'id',
        'roleName',
        'roleDescription',
        'roleKey',
        'roleAccessLevel',
        'tradeCodeRequired',
      ])

      return {
        accessRoleForResource: {
          organisation: roles.filter((r) => [RoleKeys.organisation_admin].includes(r.roleKey)),
          branch: roles.filter((r) => [RoleKeys.branch_admin].includes(r.roleKey)),
        },
      }
    } catch (error) {
      return errorHandler(error)
    }
  }

  async configs({}: HttpContext) {
    return ''
  }

  async managedCountryState({}: HttpContext) {
    return ''
  }

  async countries({ response }: HttpContext) {
    const countries = JSON.parse(
      readFileSync(path.join('resources/country/all_country.json'), 'utf-8')
    )
    return response.json(countries)
  }

  async stateFromCountry({ params, response }: HttpContext) {
    const countryCode = params.countryCode.toUpperCase()
    const filePath = path.join(`resources/country/${countryCode}.json`)

    if (!existsSync(filePath)) {
      return response.notFound({ message: 'Country not found' })
    }

    const countryData = JSON.parse(readFileSync(filePath, 'utf-8'))
    return response.json(countryData.states)
  }

  async systemRegions() {
    try {
      const filePath = app.makePath('types/country.json')
      const fileContent = await readFile(filePath, 'utf-8')
      const parsed = JSON.parse(fileContent)

      return { countries: parsed.countries }
    } catch (e) {
      return { error: e.message }
    }
  }

  async userTypes() {}
}
