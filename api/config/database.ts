import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'postgres',
  connections: {
    postgres: {
      client: 'pg',
      connection: {
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
        ...(env.get('NODE_ENV') !== 'development' && {
          ssl: {
            rejectUnauthorized: false,
          },
        }),
      },
      replicas: {
        read: {
          connection: [
            {
              host: env.get('DB_HOST'),
            },
          ],
        },
        write: {
          connection: {
            host: env.get('DB_HOST_WRITE'),
          },
        },
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

// MongoDB configuration for analytics
export const mongoConfig = {
  uri: env.get('MONGODB_URI', 'mongodb://localhost:27017'),
  database: env.get('MONGODB_DATABASE', 'hatiri_analytics'),
}

// Redis configuration for queue
export const redisConfig = {
  host: env.get('REDIS_HOST', 'localhost'),
  port: Number(env.get('REDIS_PORT', '6379')),
  password: env.get('REDIS_PASSWORD', ''),
}

export default dbConfig
