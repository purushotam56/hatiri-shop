import {
  ADMIN_USERS,
  BRANCHES,
  ORGANISATION,
  PERMISSIONS,
  ROLES,
  UPLOADS,
  USERS,
} from '#database/constants/table_names'
import type { HttpContext } from '@adonisjs/core/http'

export const errorHandler = (e: any, ctx?: HttpContext) => {
  if (ctx && ctx.response && typeof ctx.response.status === 'function') {
    ctx.response?.status(400)
  }
  if (e?.code === '23505') {
    return {
      error: e?.detail,
    }
  }
  if (e?.code === 'E_VALIDATION_ERROR') {
    return e
  }
  if (e?.code === 'E_ROW_NOT_FOUND') {
    let msg
    switch (e.model.table) {
      case ADMIN_USERS:
        msg = 'Admin does not exist in system'
        break
      case PERMISSIONS:
        msg = 'Permission does not exist in system'
        break
      case BRANCHES:
        msg = 'Branch does not exist in system'
        break

      case ROLES:
        msg = 'Role does not exist in system'
        break
      case UPLOADS:
        msg = 'Uploaded file does not exist in system'
        break
      case USERS:
        msg = 'User does not exist in system'
        break
      case ORGANISATION:
        msg = 'Organisation does not exist in system'
        break
    }
    return {
      error: msg || e?.message,
    }
  }

  if (e?.message) {
    return {
      error: e?.message,
    }
  }

  return e
}
