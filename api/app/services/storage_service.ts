import env from '#start/env'
import { PutObjectCommand, PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3'
import fs from 'node:fs'
import path from 'node:path'
import app from '@adonisjs/core/services/app'

export default class StorageService {
  private s3Client?: S3Client
  private storageDriver: 'local' | 's3'

  constructor() {
    this.storageDriver = env.get('STORAGE_DRIVER')

    if (this.storageDriver === 's3') {
      this.s3Client = new S3Client({
        region: env.get('AWS_REGION')!,
        credentials: {
          accessKeyId: env.get('AWS_ACCESS_KEY_ID')!,
          secretAccessKey: env.get('AWS_SECRET_ACCESS_KEY')!,
        },
      })
    }
  }

  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string
  ): Promise<{ driver: string }> {
    if (this.storageDriver === 's3') {
      return await this.uploadToS3(fileBuffer, fileName, mimeType)
    } else {
      return await this.uploadToLocal(fileBuffer, fileName, mimeType)
    }
  }

  private async uploadToS3(fileBuffer: Buffer, fileName: string, mimeType: string) {
    const params: PutObjectCommandInput = {
      Bucket: env.get('AWS_PUBLIC_BUCKET_NAME')!,
      Key: fileName,
      Body: fileBuffer,
      ContentType: mimeType,
      ACL: 'public-read',
    }
    const command = new PutObjectCommand(params)
    await this.s3Client!.send(command)
    return { driver: 's3' }
  }

  private async uploadToLocal(fileBuffer: Buffer, fileName: string, _mimeType: string) {
    // Get the upload directory path
    const uploadDir = env.get('STORAGE_LOCAL_PATH') || 'uploads'
    const fullUploadDir = app.makePath(uploadDir)

    // Create directory if it doesn't exist
    const fileDir = path.dirname(path.join(fullUploadDir, fileName))
    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir, { recursive: true })
    }

    // Write file to disk
    const filePath = path.join(fullUploadDir, fileName)
    fs.writeFileSync(filePath, fileBuffer)

    return { driver: 'local' }
  }

  getPublicUrl(key: string, driver: string): string {
    if (driver === 's3') {
      return `https://${env.get('AWS_PUBLIC_BUCKET_NAME')}.s3.${env.get('AWS_REGION')}.amazonaws.com/${key}`
    } else {
      const baseUrl = env.get('STORAGE_LOCAL_URL') || `${env.get('APP_URL')}/uploads`
      return `${baseUrl}/${key}`
    }
  }
}
