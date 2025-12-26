import env from '#start/env'
import { SQS } from '@aws-sdk/client-sqs'

export default class SqsService {
  private sqs: SQS
  private triggerSqs = env.get('NODE_ENV') !== 'development'
  private appEnv = env.get('APP_ENV')
  private QueueUrl = env.get('AWS_SQS_URL')
  constructor() {
    const accessKeyId = env.get('AWS_ACCESS_KEY_ID')
    const secretAccessKey = env.get('AWS_SECRET_ACCESS_KEY')
    const region = env.get('AWS_REGION')

    this.sqs = new SQS({
      apiVersion: '2010-03-31',
      region: region || 'us-east-1',
      credentials:
        accessKeyId && secretAccessKey
          ? {
              accessKeyId,
              secretAccessKey,
            }
          : undefined,
    })
  }

  async sendMessage(data1: any) {
    if (this.triggerSqs) {
      const data = await this.sqs.sendMessage({
        MessageBody: JSON.stringify({
          ...data1,
          appEnv: this.appEnv,
        }),
        QueueUrl: this.QueueUrl,
      })
      return data
    }
  }
}
