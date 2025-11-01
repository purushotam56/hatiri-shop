import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class HeaderUtilityMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    {
      organisationRequired,
      roleIdRequired,
    }: {
      organisationRequired: boolean
      roleIdRequired?: boolean
    }
  ) {
    /**
     * Middleware logic goes here (before the next call)
     */
    if (organisationRequired) {
      if (!ctx.request.header('organisationId'))
        return ctx.response
          .status(400)
          .send(ctx.i18n.formatMessage('messages.error.header.organisation'))
    }

    if (roleIdRequired) {
      if (!ctx.request.header('organisationId')) return ctx.response.status(400).send('Bad Role')
    }

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
