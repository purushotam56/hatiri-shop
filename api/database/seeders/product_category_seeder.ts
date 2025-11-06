import { BaseSeeder } from '@adonisjs/lucid/seeders'
import ProductCategory from '#models/product_category'
import Organisation from '#models/organisation'

export default class extends BaseSeeder {
  async run() {
    const organisations = await Organisation.all()

    // Organization-specific categories with emojis
    const orgCategories: Record<
      string,
      Array<{ name: string; slug: string; description: string; emoji: string }>
    > = {
      'vegetable wings': [
        {
          name: 'Vegetables',
          slug: 'vegetables',
          description: 'Fresh vegetables and greens',
          emoji: '🥬',
        },
        { name: 'Fruits', slug: 'fruits', description: 'Fresh fruits and berries', emoji: '🍎' },
      ],
      'kirana mart': [
        {
          name: 'Dairy',
          slug: 'dairy',
          description: 'Milk, cheese, and dairy products',
          emoji: '🧀',
        },
        {
          name: 'Bakery',
          slug: 'bakery',
          description: 'Bread, cakes, and baked goods',
          emoji: '🍞',
        },
        { name: 'Snacks', slug: 'snacks', description: 'Snacks and light bites', emoji: '🍿' },
        { name: 'Beverages', slug: 'beverages', description: 'Drinks and beverages', emoji: '🥤' },
      ],
      'digital helper': [
        {
          name: 'Electronics',
          slug: 'electronics',
          description: 'Electronics and gadgets',
          emoji: '💻',
        },
        {
          name: 'Accessories',
          slug: 'accessories',
          description: 'Electronic accessories',
          emoji: '🎧',
        },
      ],
      'my home': [
        { name: 'Home', slug: 'home', description: 'Home essentials', emoji: '🏠' },
        { name: 'Cleaning', slug: 'cleaning', description: 'Cleaning supplies', emoji: '🧹' },
        {
          name: 'Kitchen',
          slug: 'kitchen',
          description: 'Kitchen and household items',
          emoji: '🍳',
        },
      ],
    }

    for (const org of organisations) {
      const orgNameLower = org.name.toLowerCase()
      const categories = orgCategories[orgNameLower] || []

      if (categories.length === 0) {
        console.log(`No specific categories found for org: ${org.name}, skipping...`)
        continue
      }

      for (const category of categories) {
        await ProductCategory.firstOrCreate(
          { organisationId: org.id, slug: category.slug },
          {
            organisationId: org.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            emoji: category.emoji,
            isActive: true,
          }
        )
      }

      console.log(`Categories seeded for ${org.name}`)
    }

    console.log('Product categories seeded successfully for all organisations')
  }
}
