import { HttpContext } from '@adonisjs/core/http'
import queueService from '#services/queue_service'
import analyticsService from '#services/analytics_service'
import { errorHandler } from '#helper/error_handler'
import env from '#start/env'
import type { PageViewEvent, UserEventData } from '#services/analytics_service'

export default class AnalyticsController {
  /**
   * Track page view - Async (queued, no wait)
   */
  async trackPageView({ params, request, response }: HttpContext) {
    try {
      const organisationId = params.id
      const {
        pageType,
        sessionId,
        userAgent,
        ipAddress,
        referer,
        viewDuration,
        userId,
        location,
        productId,
      } = request.only([
        'pageType',
        'sessionId',
        'userAgent',
        'ipAddress',
        'referer',
        'viewDuration',
        'userId',
        'location',
        'productId',
      ])

      if (
        !pageType ||
        !['about', 'contact', 'store', 'storefront', 'product-page'].includes(pageType)
      ) {
        return response.badRequest({
          message:
            'Invalid page type. Must be "about", "contact", "store", "storefront", or "product-page"',
        })
      }

      if (!sessionId) {
        return response.badRequest({
          message: 'Session ID is required',
        })
      }

      const pageViewEvent: PageViewEvent = {
        organisationId: Number(organisationId),
        pageType,
        sessionId,
        userAgent,
        ipAddress,
        referer,
        viewDuration,
        userId: userId ? Number(userId) : null,
        productId: productId ? Number(productId) : undefined,
        location,
        timestamp: new Date(),
      }

      // Check if queue is enabled
      const useQueue = env.get('USE_QUEUE') ?? false

      if (useQueue) {
        // Queue the job and return immediately (don't wait)
        await queueService.enqueuePageView(pageViewEvent)
      } else {
        // Store directly in MongoDB without queue
        await analyticsService.insertPageView(pageViewEvent)
      }

      return response.ok({
        message: 'Page view recorded',
      })
    } catch (error) {
      return errorHandler(error || 'Failed to queue page view', { response } as any)
    }
  }

  /**
   * Track user event - Async (queued, no wait)
   */
  async trackUserEvent({ params, request, response }: HttpContext) {
    try {
      const organisationId = params.id
      const {
        eventType,
        sessionId,
        userAgent,
        ipAddress,
        userId,
        pageType,
        metadata,
        location,
        productId,
      } = request.only([
        'eventType',
        'sessionId',
        'userAgent',
        'ipAddress',
        'userId',
        'pageType',
        'metadata',
        'location',
        'productId',
      ])

      if (!eventType) {
        return response.badRequest({
          message: 'Event type is required',
        })
      }

      if (!sessionId) {
        return response.badRequest({
          message: 'Session ID is required',
        })
      }

      const userEvent: UserEventData = {
        organisationId: Number(organisationId),
        eventType,
        sessionId,
        userAgent,
        ipAddress,
        userId: userId ? Number(userId) : null,
        pageType,
        productId: productId ? Number(productId) : undefined,
        metadata,
        location,
        timestamp: new Date(),
      }

      // Check if queue is enabled
      const useQueue = env.get('USE_QUEUE') ?? false

      if (useQueue) {
        // Queue the job and return immediately (don't wait)
        await queueService.enqueueUserEvent(userEvent)
      } else {
        // Store directly in MongoDB without queue
        await analyticsService.insertUserEvent(userEvent)
      }

      return response.ok({
        message: 'User event recorded',
      })
    } catch (error) {
      return errorHandler(error || 'Failed to queue user event', { response } as any)
    }
  }

  /**
   * Get page view statistics
   */
  async getPageViewStats({ params, request, response, auth }: HttpContext) {
    try {
      await auth.getUserOrFail()

      const organisationId = Number(params.id)
      const pageType = request.input('pageType', 'about')

      if (!['about', 'contact', 'store', 'storefront', 'product-page'].includes(pageType)) {
        return response.badRequest({
          message:
            'Invalid page type. Must be "about", "contact", "store", "storefront", or "product-page"',
        })
      }

      const stats = await analyticsService.getPageViewStats(organisationId, pageType)
      const topCities = await analyticsService.getTopCities(organisationId, pageType)
      const topReferers = await analyticsService.getTopReferers(organisationId, pageType)

      return response.ok({
        stats,
        topCities,
        topReferers,
      })
    } catch (error) {
      return errorHandler(error || 'Failed to fetch page view stats', { response } as any)
    }
  }

  /**
   * Get event statistics
   */
  async getEventStats({ params, request, response, auth }: HttpContext) {
    try {
      await auth.getUserOrFail()

      const organisationId = Number(params.id)
      const eventType = request.input('eventType', null)

      const stats = await analyticsService.getEventStats(organisationId, eventType)

      return response.ok({
        stats,
      })
    } catch (error) {
      return errorHandler(error || 'Failed to fetch event stats', { response } as any)
    }
  }
}
