import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Address from '#models/address'

export default class CustomerSeeder extends BaseSeeder {
  async run() {
    // Create test customers
    const customers = [
      {
        email: 'john@example.com',
        password: 'Password@123',
        fullName: 'John Doe',
        mobile: '9876543210',
        address: {
          label: 'Home',
          fullName: 'John Doe',
          phoneNumber: '9876543210',
          street: '123 Main Street',
          city: 'Dubai',
          state: 'Dubai',
          pincode: '12345',
          isDefault: true,
        },
      },
      {
        email: 'jane@example.com',
        password: 'Password@123',
        fullName: 'Jane Smith',
        mobile: '9876543211',
        address: {
          label: 'Home',
          fullName: 'Jane Smith',
          phoneNumber: '9876543211',
          street: '456 Oak Avenue',
          city: 'Abu Dhabi',
          state: 'Abu Dhabi',
          pincode: '54321',
          isDefault: true,
        },
      },
      {
        email: 'bob@example.com',
        password: 'Password@123',
        fullName: 'Bob Johnson',
        mobile: '9876543212',
        address: {
          label: 'Home',
          fullName: 'Bob Johnson',
          phoneNumber: '9876543212',
          street: '789 Pine Road',
          city: 'Sharjah',
          state: 'Sharjah',
          pincode: '67890',
          isDefault: true,
        },
      },
      {
        email: 'alice@example.com',
        password: 'Password@123',
        fullName: 'Alice Williams',
        mobile: '9876543213',
        address: {
          label: 'Home',
          fullName: 'Alice Williams',
          phoneNumber: '9876543213',
          street: '321 Elm Street',
          city: 'Ajman',
          state: 'Ajman',
          pincode: '11111',
          isDefault: true,
        },
      },
      {
        email: 'charlie@example.com',
        password: 'Password@123',
        fullName: 'Charlie Brown',
        mobile: '9876543214',
        address: {
          label: 'Home',
          fullName: 'Charlie Brown',
          phoneNumber: '9876543214',
          street: '654 Cedar Lane',
          city: 'Ras Al Khaimah',
          state: 'Ras Al Khaimah',
          pincode: '22222',
          isDefault: true,
        },
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

      // Create address for customer
      await Address.create({
        userId: customer.id,
        ...customerData.address,
      })

      console.log(`Address created for: ${customer.email}`)
    }
  }
}
