import admin from 'firebase-admin'
import { getMessaging } from 'firebase-admin/messaging'
import { NotificationPayload } from '#types/notification'

export default class FCMService {
  /**
   * Send notification to a single device token
   */
  public async sendToDevice(deviceToken: string, notification: NotificationPayload) {
    try {
      const message: admin.messaging.Message = {
        notification: {
          title: notification.title,
          body: notification.body,
        },
        data: notification.data || {},
        token: deviceToken,
      }

      const response = await getMessaging().send(message)
      return response
    } catch (error) {
      console.error('Error sending FCM message:', error)
      throw error
    }
  }

  /**
   * Send notification to multiple device tokens
   */
  public async sendToMultipleDevices(deviceTokens: string[], notification: NotificationPayload) {
    try {
      const message: admin.messaging.MulticastMessage = {
        notification: {
          title: notification.title,
          body: notification.body,
        },
        data: notification.data || {},
        tokens: deviceTokens,
      }

      const response = await getMessaging().sendEachForMulticast(message)

      if (response.failureCount > 0) {
        // const failedTokens = response.responses
        //   .filter((resp) => !resp.success)
        //   .map((_, idx) => deviceTokens[idx])
        // console.log('Failed tokens:', failedTokens)
      }

      return response
    } catch (error) {
      console.error('Error sending multicast FCM message:', error)
      throw error
    }
  }

  /**
   * Send notification to a topic
   */
  public async sendToTopic(topic: string, notification: NotificationPayload) {
    try {
      const message: admin.messaging.Message = {
        notification: {
          title: notification.title,
          body: notification.body,
        },
        data: notification.data || {},
        topic: topic,
      }

      const response = await getMessaging().send(message)
      return response
    } catch (error) {
      console.error('Error sending topic FCM message:', error)
      throw error
    }
  }

  /**
   * Subscribe devices to a topic
   */
  public async subscribeToTopic(deviceTokens: string[], topic: string) {
    try {
      const response = await getMessaging().subscribeToTopic(deviceTokens, topic)

      return response
    } catch (error) {
      console.error('Error subscribing to topic:', error)
      throw error
    }
  }

  /**
   * Unsubscribe devices from a topic
   */
  public async unsubscribeFromTopic(deviceTokens: string[], topic: string) {
    try {
      const response = await getMessaging().unsubscribeFromTopic(deviceTokens, topic)

      return response
    } catch (error) {
      console.error('Error unsubscribing from topic:', error)
      throw error
    }
  }
}
