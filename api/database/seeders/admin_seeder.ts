import { BaseSeeder } from '@adonisjs/lucid/seeders'
import AdminUser from '#models/admin_user'

export default class AdminUserSeeder extends BaseSeeder {
  async run() {
    // Skip if admin already exists
    const existingAdmin = await AdminUser.findBy('email', 'admin@hatiri.com')
    if (existingAdmin) {
      console.log('Admin user already exists, skipping...')
      return
    }

    // Create default admin user
    const admin = await AdminUser.create({
      email: 'admin@hatiri.com',
      password: 'Admin@123', // Change this in production!
      fullName: 'Admin User',
      mobile: '+1234567890',
    })

    console.log(`Admin user created: ${admin.email}`)
  }
}
