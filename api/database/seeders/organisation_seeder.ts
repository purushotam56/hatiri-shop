import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Organisation from '#models/organisation'
import Branch from '#models/branch'

export default class OrganisationSeeder extends BaseSeeder {
  async run() {
    // Create test organizations
    const orgs = [
      {
        name: 'Vegetable Wings',
        organisationUniqueCode: 'VW001',
        currency: 'INR',
        dateFormat: 'DD-MM-YYYY',
        organisationRoleType: 'seller',
        addressLine1: '456 Farm Lane',
        addressLine2: 'Green Market',
        postalCode: '10001',
      },
      {
        name: 'Kirana Mart',
        organisationUniqueCode: 'KM001',
        currency: 'INR',
        dateFormat: 'DD-MM-YYYY',
        organisationRoleType: 'seller',
        addressLine1: '789 Market Street',
        addressLine2: 'Downtown',
        postalCode: '10002',
      },
      {
        name: 'Digital Helper',
        organisationUniqueCode: 'DH001',
        currency: 'INR',
        dateFormat: 'DD-MM-YYYY',
        organisationRoleType: 'seller',
        addressLine1: '321 Tech Plaza',
        addressLine2: 'Tech Hub',
        postalCode: '10003',
      },
      {
        name: 'My Home',
        organisationUniqueCode: 'MH001',
        currency: 'INR',
        dateFormat: 'DD-MM-YYYY',
        organisationRoleType: 'seller',
        addressLine1: '654 Home Street',
        addressLine2: 'Retail Area',
        postalCode: '10004',
      },
    ]

    for (const orgData of orgs) {
      // Check if org already exists
      const existing = await Organisation.findBy('organisationUniqueCode', orgData.organisationUniqueCode)
      if (existing) {
        console.log(`Organisation ${orgData.name} already exists, skipping...`)
        continue
      }

      // Create organisation
      const org = await Organisation.create({
        name: orgData.name,
        organisationUniqueCode: orgData.organisationUniqueCode,
        currency: orgData.currency,
        dateFormat: orgData.dateFormat,
        organisationRoleType: orgData.organisationRoleType as any,
        addressLine1: orgData.addressLine1,
        addressLine2: orgData.addressLine2,
        postalCode: orgData.postalCode,
      })

      console.log(`Organisation created: ${org.name}`)
    }
  }
}
