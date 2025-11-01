import type { ApplicationService } from '@adonisjs/core/types'
import { initializeApp, applicationDefault } from 'firebase-admin/app'
import { RuntimeException } from '@adonisjs/core/exceptions'

export default class FirebaseAdminProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {
    try {
      initializeApp({ credential: applicationDefault() })
    } catch (error) {
      throw new RuntimeException('Firebase Admin initialization error')
    }
  }

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
