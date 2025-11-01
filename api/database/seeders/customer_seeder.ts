import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class CustomerSeeder extends BaseSeeder {
  async run() {
    // Create test customers
    const customers = [
      {
        email: 'john@example.com',
        password: 'Password@123',
        fullName: 'John Doe',
        mobile: '9876543210',
      },
      {
        email: 'jane@example.com',
        password: 'Password@123',
        fullName: 'Jane Smith',
        mobile: '9876543211',
      },
      {
        email: 'bob@example.com',
        password: 'Password@123',
        fullName: 'Bob Johnson',
        mobile: '9876543212',
      },
      {
        email: 'alice@example.com',
        password: 'Password@123',
        fullName: 'Alice Williams',
        mobile: '9876543213',
      },
      {
        email: 'charlie@example.com',
        password: 'Password@123',
        fullName: 'Charlie Brown',
        mobile: '9876543214',
      },
    ]

    for (const customerData of customers) {
      // Check if customer already exists
      const existing = await User.findBy('email', customerData.email)
      if (existing) {
        console.log(`Customer ${customerData.email} already exists, skipping...`)
        continue
      }

      // Create customer
      const customer = await User.create({
        email: customerData.email,
        password: customerData.password,
        fullName: customerData.fullName,
        mobile: customerData.mobile,
      })

      console.log(`Customer created: ${customer.email}`)
    }
  }
}
