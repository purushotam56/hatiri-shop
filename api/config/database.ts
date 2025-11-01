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

export default dbConfig
