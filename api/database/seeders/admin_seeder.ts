import { BaseSeeder } from '@adonisjs/lucid/seeders'
import AdminUser from '#models/admin_user'

export default class AdminUserSeeder extends BaseSeeder {
  async run() {
    // Skip if admin already exists
    const existingAdmin = await AdminUser.findBy('email', 'admin@hatiri.com')
    if (existingAdmin) {
      return
    }

    // Create default admin user
    const admin = await AdminUser.create({
      email: 'admin@hatiri.com',
      password: 'A@dmin@1231',
      fullName: 'Admin User',
      mobile: '+918780779281',
    })

    console.log(`Admin user created: ${admin.email}`)
  }
}
