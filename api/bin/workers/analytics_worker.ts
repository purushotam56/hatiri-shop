import { Worker } from 'bullmq'
import { redisConfig } from '#config/database'
import analyticsService from '#services/analytics_service'
import type { AnalyticsJob } from '#services/queue_service'

/**
 * Worker to process analytics events from queue
 * Run separately: node bin/workers/analytics_worker.ts
 */

async function processAnalyticsJob(job: { data: AnalyticsJob }) {
  const { type, data } = job.data

  try {
    switch (type) {
      case 'page_view':
        await analyticsService.insertPageView(data)
        break

      case 'user_event':
        await analyticsService.insertUserEvent(data)
        break

      default:
        throw new Error(`Unknown job type: ${type}`)
    }
  } catch (error) {
    console.error(`✗ Failed to process job:`, error)
    throw error
  }
}

async function startWorker() {
  const worker = new Worker('analytics', processAnalyticsJob, {
    connection: {
      host: redisConfig.host,
      port: typeof redisConfig.port === 'number' ? redisConfig.port : Number(redisConfig.port),
      password: redisConfig.password || undefined,
    },
    concurrency: 10, // Process 10 jobs in parallel
  })

  // Event listeners
  // worker.on('completed', (job) => {
  // })

  worker.on('failed', (job, error) => {
    console.error(`✗ Job ${job?.id} failed:`, error.message)
  })

  worker.on('error', (error) => {
    console.error('Worker error:', error)
  })

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    await worker.close()
    process.exit(0)
  })

  process.on('SIGINT', async () => {
    await worker.close()
    process.exit(0)
  })
}

startWorker().catch((error) => {
  console.error('Worker startup failed:', error)
  process.exit(1)
})
