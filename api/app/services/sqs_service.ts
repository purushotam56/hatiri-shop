import env from '#start/env'
import { SQS } from '@aws-sdk/client-sqs'

export default class SqsService {
  private sqs: SQS
  private triggerSqs = env.get('NODE_ENV') !== 'development'
  private appEnv = env.get('APP_ENV')
  private QueueUrl = env.get('AWS_SQS_URL')
  constructor() {
    this.sqs = new SQS({
      apiVersion: '2010-03-31',
      region: env.get('AWS_REGION'),
      credentials: {
        accessKeyId: env.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: env.get('AWS_SECRET_ACCESS_KEY'),
      },
    })
  }

  async sendReportGenerationRequestForInspection(inspectionId: number) {
    if (this.triggerSqs) {
      const data = await this.sqs.sendMessage({
        MessageBody: JSON.stringify({
          inspectionId: inspectionId,
          appEnv: this.appEnv,
        }),
        QueueUrl: this.QueueUrl,
      })
      return data
    }
  }

  async sendReportGenerationRequestForTradeInspection(inspectionId: number, tradeCodeId: number) {
    if (this.triggerSqs) {
      const data = await this.sqs.sendMessage({
        MessageBody: JSON.stringify({
          inspectionId: inspectionId,
          tradeCodeId: tradeCodeId,
          appEnv: this.appEnv,
        }),
        QueueUrl: this.QueueUrl,
      })
      return data
    }
  }

  async sendReportGenerationRequestForProperty(propertyId: number) {
    if (this.triggerSqs) {
      const data = await this.sqs.sendMessage({
        MessageBody: JSON.stringify({
          propertyId: propertyId,
          appEnv: this.appEnv,
        }),
        QueueUrl: this.QueueUrl,
      })
      return data
    }
  }
}
