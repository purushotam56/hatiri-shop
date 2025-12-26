import { Queue } from 'bullmq'
import { redisConfig } from '#config/database'
import type { PageViewEvent, UserEventData } from '#services/analytics_service'

export interface PageViewJob {
  type: 'page_view'
  data: PageViewEvent
}

export interface UserEventJob {
  type: 'user_event'
  data: UserEventData
}

export type AnalyticsJob = PageViewJob | UserEventJob

class QueueService {
  private analyticsQueue: Queue<AnalyticsJob> | null = null

  getQueue(): Queue<AnalyticsJob> {
    if (!this.analyticsQueue) {
      this.analyticsQueue = new Queue('analytics', {
        connection: {
          host: redisConfig.host,
          port: typeof redisConfig.port === 'number' ? redisConfig.port : Number(redisConfig.port),
          password: redisConfig.password || undefined,
        },
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        },
      })
    }

    return this.analyticsQueue
  }

  async enqueuePageView(event: PageViewEvent) {
    const queue = this.getQueue()
    return queue.add('page_view', { type: 'page_view', data: event })
  }

  async enqueueUserEvent(event: UserEventData) {
    const queue = this.getQueue()
    return queue.add('user_event', { type: 'user_event', data: event })
  }

  async closeQueue() {
    if (this.analyticsQueue) {
      await this.analyticsQueue.close()
      this.analyticsQueue = null
    }
  }
}

export default new QueueService()
