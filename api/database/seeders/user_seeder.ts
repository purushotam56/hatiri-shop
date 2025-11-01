import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        fullName: 'system',
        email: 'system@propry.tech',
        password: '12345678',
        mobile: '',
      },
    ])
  }
}
