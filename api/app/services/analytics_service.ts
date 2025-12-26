import { MongoClient, Db, Collection } from 'mongodb'
import { mongoConfig } from '#config/database'

export interface PageViewEvent {
  organisationId: number
  pageType: 'about' | 'contact' | 'store' | 'storefront' | 'product-page'
  userId?: number | null
  sessionId: string
  userAgent: string
  ipAddress: string
  productId?: number
  location?: {
    city?: string
    country?: string
    latitude?: number
    longitude?: number
  }
  referer?: string
  viewDuration?: number
  timestamp: Date
}

export interface UserEventData {
  organisationId: number
  userId?: number | null
  sessionId: string
  eventType: string
  pageType?: 'about' | 'contact' | 'store' | 'storefront' | 'product-page'
  productId?: number
  metadata?: Record<string, unknown>
  userAgent: string
  ipAddress: string
  location?: {
    city?: string
    country?: string
  }
  timestamp: Date
}

class AnalyticsService {
  private client: MongoClient | null = null
  private db: Db | null = null
  private pageViewsCollection: Collection | null = null
  private eventsCollection: Collection | null = null

  async connect() {
    if (this.db) {
      return this.db
    }

    this.client = new MongoClient(mongoConfig.uri)
    await this.client.connect()
    this.db = this.client.db(mongoConfig.database)

    this.pageViewsCollection = this.db.collection('page_views')
    this.eventsCollection = this.db.collection('user_events')

    await this.createIndexes()

    return this.db
  }

  private async createIndexes() {
    if (!this.pageViewsCollection || !this.eventsCollection) return

    try {
      // Page views indexes
      await this.pageViewsCollection.createIndex({ organisationId: 1, pageType: 1 })
      await this.pageViewsCollection.createIndex({ sessionId: 1 })
      await this.pageViewsCollection.createIndex({ 'location.city': 1 })

      // Drop old plain timestamp index if it exists, then create TTL index
      try {
        await this.pageViewsCollection.dropIndex('timestamp_1')
      } catch (err) {
        // Index might not exist, continue
      }

      await this.pageViewsCollection.createIndex(
        { timestamp: 1 },
        { expireAfterSeconds: 7776000 } // 90 days TTL
      )

      // Events indexes
      await this.eventsCollection.createIndex({ organisationId: 1, eventType: 1 })
      await this.eventsCollection.createIndex({ sessionId: 1 })

      // Drop old plain timestamp index if it exists, then create TTL index
      try {
        await this.eventsCollection.dropIndex('timestamp_1')
      } catch (err) {
        // Index might not exist, continue
      }

      await this.eventsCollection.createIndex(
        { timestamp: 1 },
        { expireAfterSeconds: 7776000 } // 90 days TTL
      )
    } catch (err) {
      console.error('Error creating indexes:', err)
    }
  }

  async insertPageView(event: PageViewEvent) {
    await this.connect()
    return this.pageViewsCollection!.insertOne(event)
  }

  async insertUserEvent(event: UserEventData) {
    await this.connect()
    return this.eventsCollection!.insertOne(event)
  }

  async getPageViewStats(
    organisationId: number,
    pageType: 'about' | 'contact' | 'store' | 'storefront' | 'product-page'
  ) {
    await this.connect()

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const result = await this.pageViewsCollection!.aggregate([
      {
        $match: {
          organisationId,
          pageType,
          timestamp: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: null,
          totalViews: { $sum: 1 },
          uniqueVisitors: { $addToSet: '$sessionId' },
          avgDuration: { $avg: '$viewDuration' },
        },
      },
      {
        $project: {
          totalViews: 1,
          uniqueVisitors: { $size: '$uniqueVisitors' },
          avgDuration: { $round: ['$avgDuration', 0] },
        },
      },
    ]).toArray()

    return result[0] || { totalViews: 0, uniqueVisitors: 0, avgDuration: 0 }
  }

  async getTopCities(
    organisationId: number,
    pageType: 'about' | 'contact' | 'store' | 'storefront' | 'product-page',
    limit = 10
  ) {
    await this.connect()

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    return this.pageViewsCollection!.aggregate([
      {
        $match: {
          organisationId,
          pageType,
          'location.city': { $exists: true, $ne: null },
          'timestamp': { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: '$location.city',
          count: { $sum: 1 },
          uniqueVisitors: { $addToSet: '$sessionId' },
        },
      },
      {
        $project: {
          city: '$_id',
          views: '$count',
          uniqueVisitors: { $size: '$uniqueVisitors' },
        },
      },
      {
        $sort: { views: -1 },
      },
      {
        $limit: limit,
      },
    ]).toArray()
  }

  async getTopReferers(
    organisationId: number,
    pageType: 'about' | 'contact' | 'store' | 'storefront' | 'product-page',
    limit = 10
  ) {
    await this.connect()

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    return this.pageViewsCollection!.aggregate([
      {
        $match: {
          organisationId,
          pageType,
          referer: { $exists: true, $ne: null },
          timestamp: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: '$referer',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: limit,
      },
      {
        $project: {
          referer: '$_id',
          views: '$count',
        },
      },
    ]).toArray()
  }

  async getEventStats(organisationId: number, eventType?: string) {
    await this.connect()

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const match: any = {
      organisationId,
      timestamp: { $gte: thirtyDaysAgo },
    }

    if (eventType) {
      match.eventType = eventType
    }

    return this.eventsCollection!.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 },
          uniqueUsers: { $addToSet: '$sessionId' },
          lastOccurred: { $max: '$timestamp' },
        },
      },
      {
        $project: {
          eventType: '$_id',
          count: 1,
          uniqueUsers: { $size: '$uniqueUsers' },
          lastOccurred: 1,
        },
      },
      {
        $sort: { count: -1 },
      },
    ]).toArray()
  }

  async disconnect() {
    if (this.client) {
      await this.client.close()
      this.client = null
      this.db = null
      this.pageViewsCollection = null
      this.eventsCollection = null
    }
  }
}

export default new AnalyticsService()
