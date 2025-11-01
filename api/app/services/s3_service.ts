import env from '#start/env'
import { PutObjectCommand, PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3'

export default class S3Service {
  private s3Client: S3Client

  constructor() {
    this.s3Client = new S3Client({
      region: env.get('AWS_REGION'),
      credentials: {
        accessKeyId: env.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: env.get('AWS_SECRET_ACCESS_KEY'),
      },
    })
  }

  async uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string) {
    var params: PutObjectCommandInput = {
      Bucket: env.get('AWS_PUBLIC_BUCKET_NAME'),
      Key: fileName,
      Body: fileBuffer,
      ContentType: mimeType,
      ACL: 'public-read',
    }
    const command = new PutObjectCommand(params)
    return await this.s3Client.send(command)
  }
}
