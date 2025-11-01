import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Organisation from '#models/organisation'

export default class SellerSeeder extends BaseSeeder {
  async run() {
    // Create test sellers for each organization
    const sellers = [
      {
        email: 'seller1@veg-wings.com',
        password: 'Seller@123',
        fullName: 'Seller One - Vegetable Wings',
        mobile: '9111111111',
        organisationCode: 'VW001',
      },
      {
        email: 'seller2@veg-wings.com',
        password: 'Seller@123',
        fullName: 'Seller Two - Vegetable Wings',
        mobile: '9111111112',
        organisationCode: 'VW001',
      },
      {
        email: 'seller1@kirana-mart.com',
        password: 'Seller@123',
        fullName: 'Seller One - Kirana Mart',
        mobile: '9222222222',
        organisationCode: 'KM001',
      },
      {
        email: 'seller1@digital-helper.com',
        password: 'Seller@123',
        fullName: 'Seller One - Digital Helper',
        mobile: '9333333333',
        organisationCode: 'DH001',
      },
      {
        email: 'seller1@my-home.com',
        password: 'Seller@123',
        fullName: 'Seller One - My Home',
        mobile: '9444444444',
        organisationCode: 'MH001',
      },
    ]

    for (const sellerData of sellers) {
      // Check if seller already exists
      const existing = await User.findBy('email', sellerData.email)
      if (existing) {
        console.log(`Seller ${sellerData.email} already exists, skipping...`)
        continue
      }

      // Create seller user
      const seller = await User.create({
        email: sellerData.email,
        password: sellerData.password,
        fullName: sellerData.fullName,
        mobile: sellerData.mobile,
      })

      console.log(`Seller created: ${seller.email}`)

      // Find organization and link seller
      const org = await Organisation.findBy('organisationUniqueCode', sellerData.organisationCode)
      if (org) {
        // Link seller to organization without role_id (nullable field)
        await org.related('user').attach({
          [seller.id]: {
            is_admin: false,
          },
        })
        console.log(`  Linked to organization: ${org.name}`)
      } else {
        console.log(`  Organization ${sellerData.organisationCode} not found!`)
      }
    }
  }
}
