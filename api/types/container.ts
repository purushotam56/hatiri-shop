import { App } from 'firebase-admin/app'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    'Firebase/Admin': App
  }
}
