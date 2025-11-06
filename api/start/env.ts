/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  APP_ENV: Env.schema.enum(['dev', 'staging', 'prod'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),
  FROM_EMAIL: Env.schema.string(),
  TEST_OTP: Env.schema.string(),
  MASTER_OTP: Env.schema.string(),
  MASTER_PWD: Env.schema.string(),
  APP_USER_EMAIL: Env.schema.string(),
  APP_USER_MOBILE: Env.schema.string(),
  APP_URL: Env.schema.string(),
  /*
  |----------------------------------------------------------
  | Variables for configuring database connection
  |----------------------------------------------------------
  */
  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_HOST_WRITE: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring the mail package
  |----------------------------------------------------------
  */
  SMTP_HOST: Env.schema.string(),
  SMTP_PORT: Env.schema.string(),
  SMTP_USERNAME: Env.schema.string(),
  SMTP_PASSWORD: Env.schema.string(),
  SMTP_SECURE: Env.schema.boolean(),

  /*
  |----------------------------------------------------------
  | Variables for configuring the aws
  |----------------------------------------------------------
  */
  /*
  |----------------------------------------------------------
  | Variables for file storage configuration
  |----------------------------------------------------------
  */
  STORAGE_DRIVER: Env.schema.enum(['local', 's3'] as const),
  STORAGE_LOCAL_PATH: Env.schema.string.optional(),
  STORAGE_LOCAL_URL: Env.schema.string.optional(),

  AWS_REGION: Env.schema.string.optional(),
  AWS_ACCESS_KEY_ID: Env.schema.string.optional(),
  AWS_SECRET_ACCESS_KEY: Env.schema.string.optional(),
  AWS_PUBLIC_BUCKET_NAME: Env.schema.string.optional(),
  AWS_SQS_NAME: Env.schema.string.optional(),
  AWS_SQS_URL: Env.schema.string.optional(),

  /*
  |----------------------------------------------------------
  | Variables for configuring the firebase
  |----------------------------------------------------------
  */
  GOOGLE_APPLICATION_CREDENTIALS: Env.schema.string(),

  DEV_DATA_SEEDER: Env.schema.boolean(),
  PROD_DATA_SEEDER: Env.schema.boolean(),
  SEND_SMS: Env.schema.boolean(),
  SEND_EMAIL: Env.schema.boolean(),
  SAVE_REPORT_NOTIFICATION: Env.schema.boolean(),

  MOBILE_MESSAGE_API: Env.schema.string(),
  MOBILE_MESSAGE_PASSWORD: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring the limiter package
  |----------------------------------------------------------
  */
  LIMITER_STORE: Env.schema.enum(['database', 'memory'] as const),
})
