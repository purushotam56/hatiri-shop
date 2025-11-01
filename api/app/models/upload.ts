import { DateTime } from 'luxon'
import {
  // afterCreate,
  // afterFetch,
  // afterFind,
  BaseModel,
  column,
  computed,
  hasOne,
} from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import env from '#start/env'
import Organisation from './organisation.js'
import Branch from './branch.js'
// import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
export default class Upload extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare mimeType: string

  @column()
  declare size: number

  @column()
  declare key: string

  @column()
  declare urlPrefix: string

  @hasOne(() => Organisation)
  declare organisation: HasOne<typeof Organisation>

  @hasOne(() => Branch)
  declare branch: HasOne<typeof Branch>

  @computed()
  public get url() {
    if (this.urlPrefix) {
      return this.urlPrefix + this.key
    }
    return `https://${env.get('AWS_PUBLIC_BUCKET_NAME')}.s3.${env.get('AWS_REGION')}.amazonaws.com/${this.key}`
  }

  // @column()
  // declare url: string

  // @afterFetch()
  // static async fetchurls(uploads: Upload[]) {
  //   const s3Client = new S3Client({
  //     region: env.get('AWS_REGION'),
  //     credentials: {
  //       accessKeyId: env.get('AWS_ACCESS_KEY_ID'),
  //       secretAccessKey: env.get('AWS_SECRET_ACCESS_KEY'),
  //     },
  //   })
  //   for (const uplod of uploads) {
  //     if (uplod.urlPrefix) {
  //       return uplod.urlPrefix + uplod.key
  //     }
  //     const command = new GetObjectCommand({
  //       Bucket: env.get('AWS_PUBLIC_BUCKET_NAME'),
  //       Key: uplod.key,
  //     })
  //     const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 })
  //     const baseUrl = `https://${env.get('AWS_PUBLIC_BUCKET_NAME')}.s3.${env.get('AWS_REGION')}.amazonaws.com/${uplod.key}`
  //     const queryParams = signedUrl.split('?')[1]
  //     uplod.url = `${baseUrl}?${queryParams}`
  //   }
  // }

  // @afterFind()
  // static async fetchurl(uplod: Upload) {
  //   const s3Client = new S3Client({
  //     region: env.get('AWS_REGION'),
  //     credentials: {
  //       accessKeyId: env.get('AWS_ACCESS_KEY_ID'),
  //       secretAccessKey: env.get('AWS_SECRET_ACCESS_KEY'),
  //     },
  //   })
  //   if (uplod.urlPrefix) {
  //     return uplod.urlPrefix + uplod.key
  //   }
  //   const command = new GetObjectCommand({
  //     Bucket: env.get('AWS_PUBLIC_BUCKET_NAME'),
  //     Key: uplod.key,
  //   })
  //   const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 })
  //   const baseUrl = `https://${env.get('AWS_PUBLIC_BUCKET_NAME')}.s3.${env.get('AWS_REGION')}.amazonaws.com/${uplod.key}`
  //   const queryParams = signedUrl.split('?')[1]
  //   uplod.url = `${baseUrl}?${queryParams}`
  // }

  // @afterCreate()
  // static async fetchurlAfterCreate(uplod: Upload) {
  //   const s3Client = new S3Client({
  //     region: env.get('AWS_REGION'),
  //     credentials: {
  //       accessKeyId: env.get('AWS_ACCESS_KEY_ID'),
  //       secretAccessKey: env.get('AWS_SECRET_ACCESS_KEY'),
  //     },
  //   })
  //   if (uplod.urlPrefix) {
  //     return uplod.urlPrefix + uplod.key
  //   }
  //   const command = new GetObjectCommand({
  //     Bucket: env.get('AWS_PUBLIC_BUCKET_NAME'),
  //     Key: uplod.key,
  //   })
  //   const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 })
  //   const baseUrl = `https://${env.get('AWS_PUBLIC_BUCKET_NAME')}.s3.${env.get('AWS_REGION')}.amazonaws.com/${uplod.key}`
  //   const queryParams = signedUrl.split('?')[1]
  //   uplod.url = `${baseUrl}?${queryParams}`
  // }

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
