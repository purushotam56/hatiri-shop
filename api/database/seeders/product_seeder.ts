import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Product from '#models/product'
import Organisation from '#models/organisation'
import ProductCategory from '#models/product_category'
import Upload from '#models/upload'
import ProductImage from '#models/product_image'

export default class extends BaseSeeder {
  async run() {
    const organisations = await Organisation.all()

    if (organisations.length === 0) {
      console.log('No organisations found, skipping product seeding')
      return
    }

    // Store-specific product templates
    const storeProducts = {
      VW001: {
        name: 'Vegetable Wings',
        products: [
          // Fresh Vegetables (50 products)
          ...this.generateProducts('Tomato', 'Fresh ripe tomatoes', 'VW-TMAT', [
            { kg: '1kg', price: 2.99, stock: 150, options: ['Red', 'Cherry', 'Beefsteak'] },
            { kg: '2kg', price: 5.49, stock: 100, options: ['Red', 'Cherry', 'Beefsteak'] },
            { kg: '5kg', price: 12.99, stock: 50, options: ['Red', 'Cherry', 'Beefsteak'] },
          ]),
          ...this.generateProducts('Carrots', 'Orange fresh carrots', 'VW-CARR', [
            { kg: '1kg', price: 1.99, stock: 200, options: ['Regular', 'Baby', 'Organic'] },
            { kg: '2kg', price: 3.79, stock: 150, options: ['Regular', 'Baby', 'Organic'] },
            { kg: '5kg', price: 8.99, stock: 80, options: ['Regular', 'Baby', 'Organic'] },
          ]),
          ...this.generateProducts('Broccoli', 'Fresh green broccoli', 'VW-BROC', [
            { unit: '1 bunch', price: 3.49, stock: 100, options: ['Regular', 'Organic', 'Mini'] },
            { unit: '2 bunch', price: 6.49, stock: 80, options: ['Regular', 'Organic', 'Mini'] },
          ]),
          ...this.generateProducts('Spinach', 'Organic fresh spinach', 'VW-SPIN', [
            { gram: '500g', price: 2.49, stock: 120, options: ['Fresh', 'Organic', 'Baby Leaf'] },
            { gram: '1kg', price: 4.49, stock: 90, options: ['Fresh', 'Organic', 'Baby Leaf'] },
          ]),
          ...this.generateProducts('Bell Pepper', 'Colorful bell peppers', 'VW-BPEP', [
            {
              unit: '4 pack',
              price: 4.99,
              stock: 110,
              options: ['Red', 'Yellow', 'Green', 'Mixed'],
            },
            {
              unit: '8 pack',
              price: 8.99,
              stock: 70,
              options: ['Red', 'Yellow', 'Green', 'Mixed'],
            },
          ]),
          ...this.generateProducts('Onion', 'Sweet onions', 'VW-ONON', [
            { kg: '1kg', price: 1.49, stock: 250, options: ['Red', 'White', 'Yellow'] },
            { kg: '2kg', price: 2.79, stock: 200, options: ['Red', 'White', 'Yellow'] },
            { kg: '5kg', price: 6.49, stock: 100, options: ['Red', 'White', 'Yellow'] },
          ]),
          ...this.generateProducts('Potato', 'Fresh potatoes', 'VW-POTA', [
            { kg: '2kg', price: 2.49, stock: 300, options: ['Red', 'White', 'Russet'] },
            { kg: '5kg', price: 5.49, stock: 200, options: ['Red', 'White', 'Russet'] },
            { kg: '10kg', price: 9.99, stock: 100, options: ['Red', 'White', 'Russet'] },
          ]),
          ...this.generateProducts('Cucumber', 'Fresh cucumbers', 'VW-CUCU', [
            {
              unit: '4 pack',
              price: 2.99,
              stock: 180,
              options: ['English', 'Regular', 'Pickling'],
            },
            {
              unit: '8 pack',
              price: 5.49,
              stock: 120,
              options: ['English', 'Regular', 'Pickling'],
            },
          ]),
          ...this.generateProducts('Lettuce', 'Crisp green lettuce', 'VW-LETT', [
            {
              unit: '1 head',
              price: 2.49,
              stock: 100,
              options: ['Iceberg', 'Romaine', 'Butterhead'],
            },
            {
              unit: '2 head',
              price: 4.49,
              stock: 80,
              options: ['Iceberg', 'Romaine', 'Butterhead'],
            },
          ]),
          ...this.generateProducts('Garlic', 'Fresh garlic bulbs', 'VW-GLIC', [
            { unit: '1 bulb', price: 0.99, stock: 300, options: [] },
            { pack: 'Pack of 10', price: 7.99, stock: 150, options: [] },
          ]),
          ...this.generateProducts('Cabbage', 'Fresh cabbage', 'VW-CABB', [
            { unit: '1 head', price: 1.99, stock: 150, options: ['Green', 'Red'] },
            { unit: '2 head', price: 3.49, stock: 120, options: ['Green', 'Red'] },
          ]),
          // Fresh Fruits (50 products)
          ...this.generateProducts('Apples', 'Red apples from local farm', 'VW-APPL', [
            {
              kg: '1kg',
              price: 5.99,
              stock: 150,
              options: ['Red Delicious', 'Fuji', 'Gala', 'Granny Smith'],
            },
            {
              kg: '2kg',
              price: 10.99,
              stock: 100,
              options: ['Red Delicious', 'Fuji', 'Gala', 'Granny Smith'],
            },
            {
              kg: '5kg',
              price: 24.99,
              stock: 50,
              options: ['Red Delicious', 'Fuji', 'Gala', 'Granny Smith'],
            },
          ]),
          ...this.generateProducts('Bananas', 'Yellow fresh bananas', 'VW-BANA', [
            { kg: '1kg', price: 2.49, stock: 300, options: ['Yellow Ripe', 'Green', 'Plantain'] },
            { kg: '2kg', price: 4.49, stock: 250, options: ['Yellow Ripe', 'Green', 'Plantain'] },
            { kg: '5kg', price: 9.99, stock: 150, options: ['Yellow Ripe', 'Green', 'Plantain'] },
          ]),
          ...this.generateProducts('Oranges', 'Juicy sweet oranges', 'VW-ORAN', [
            { kg: '1kg', price: 4.99, stock: 120, options: ['Navel', 'Valencia', 'Seville'] },
            { kg: '2kg', price: 8.99, stock: 90, options: ['Navel', 'Valencia', 'Seville'] },
            { kg: '5kg', price: 19.99, stock: 60, options: ['Navel', 'Valencia', 'Seville'] },
          ]),
          ...this.generateProducts('Strawberries', 'Fresh red strawberries', 'VW-STRO', [
            { gram: '250g', price: 4.99, stock: 100, options: ['Fresh', 'Organic'] },
            { gram: '500g', price: 8.99, stock: 70, options: ['Fresh', 'Organic'] },
            { gram: '1kg', price: 15.99, stock: 40, options: ['Fresh', 'Organic'] },
          ]),
          ...this.generateProducts('Grapes', 'Sweet juicy grapes', 'VW-GRAP', [
            { kg: '1kg', price: 6.99, stock: 80, options: ['Red', 'Green', 'Black', 'Seedless'] },
            { kg: '2kg', price: 12.99, stock: 60, options: ['Red', 'Green', 'Black', 'Seedless'] },
          ]),
          ...this.generateProducts('Mangoes', 'Sweet tropical mangoes', 'VW-MANG', [
            { unit: '4 pack', price: 7.99, stock: 100, options: ['Alphonso', 'Kesar', 'Chaunsa'] },
            { unit: '6 pack', price: 11.99, stock: 70, options: ['Alphonso', 'Kesar', 'Chaunsa'] },
          ]),
          ...this.generateProducts('Pineapple', 'Fresh tropical pineapple', 'VW-PINE', [
            { unit: '1 piece', price: 3.99, stock: 90, options: ['Regular', 'Golden', 'Sweet'] },
            { unit: '2 piece', price: 7.49, stock: 60, options: ['Regular', 'Golden', 'Sweet'] },
          ]),
          ...this.generateProducts('Watermelon', 'Sweet watermelon', 'VW-WATE', [
            { unit: '1 piece', price: 8.99, stock: 60, options: [] },
            { unit: '2 piece', price: 16.99, stock: 40, options: [] },
          ]),
          ...this.generateProducts('Blueberries', 'Fresh blueberries', 'VW-BLUB', [
            { gram: '200g', price: 4.99, stock: 80, options: ['Fresh', 'Organic'] },
            { gram: '500g', price: 11.99, stock: 50, options: ['Fresh', 'Organic'] },
          ]),
          ...this.generateProducts('Kiwi', 'Green kiwi fruit', 'VW-KIWI', [
            { unit: '6 pack', price: 4.99, stock: 100, options: [] },
            { unit: '12 pack', price: 8.99, stock: 70, options: [] },
          ]),
          ...this.generateProducts('Papaya', 'Sweet papaya', 'VW-PAPA', [
            { unit: '1 piece', price: 3.49, stock: 110, options: [] },
            { unit: '2 piece', price: 6.49, stock: 80, options: [] },
          ]),
          ...this.generateProducts('Guava', 'Fresh guava fruit', 'VW-GUAV', [
            { kg: '1kg', price: 3.99, stock: 100, options: [] },
            { kg: '2kg', price: 7.49, stock: 70, options: [] },
          ]),
          // Additional vegetables for variety
          ...this.generateProducts('Cauliflower', 'Fresh cauliflower head', 'VW-CAULI', [
            { unit: '1 head', price: 2.99, stock: 130, options: [] },
            { unit: '2 head', price: 5.49, stock: 100, options: [] },
          ]),
          ...this.generateProducts('Radish', 'Fresh radish bundle', 'VW-RADI', [
            { unit: '1 bunch', price: 1.49, stock: 180, options: [] },
            { unit: '2 bunch', price: 2.79, stock: 150, options: [] },
          ]),
          ...this.generateProducts('Zucchini', 'Green zucchini', 'VW-ZUCC', [
            { kg: '1kg', price: 2.99, stock: 140, options: [] },
            { kg: '2kg', price: 5.49, stock: 110, options: [] },
          ]),
          ...this.generateProducts('Eggplant', 'Purple eggplant', 'VW-EGPL', [
            { kg: '1kg', price: 3.49, stock: 120, options: [] },
            { kg: '2kg', price: 6.49, stock: 90, options: [] },
          ]),
          // Additional fruits
          ...this.generateProducts('Lime', 'Fresh lime', 'VW-LIME', [
            { kg: '1kg', price: 2.99, stock: 160, options: [] },
            { unit: '6 pack', price: 3.99, stock: 140, options: [] },
          ]),
          ...this.generateProducts('Lemon', 'Fresh lemon', 'VW-LEMO', [
            { kg: '1kg', price: 2.49, stock: 200, options: [] },
            { unit: '8 pack', price: 3.49, stock: 180, options: [] },
          ]),
          ...this.generateProducts('Pomegranate', 'Sweet pomegranate', 'VW-POME', [
            { unit: '4 pack', price: 7.99, stock: 80, options: [] },
            { unit: '6 pack', price: 11.99, stock: 60, options: [] },
          ]),
          ...this.generateProducts('Peach', 'Fresh peach fruit', 'VW-PEAC', [
            { kg: '1kg', price: 5.99, stock: 100, options: [] },
            { kg: '2kg', price: 10.99, stock: 70, options: [] },
          ]),
          ...this.generateProducts('Pear', 'Sweet pear fruit', 'VW-PEAR', [
            { kg: '1kg', price: 6.99, stock: 90, options: [] },
            { kg: '2kg', price: 12.99, stock: 60, options: [] },
          ]),
          // More vegetables & fruits
          ...this.generateProducts('Bean Sprouts', 'Fresh bean sprouts', 'VW-BEAN', [
            { pack: '200g', price: 1.99, stock: 250, options: [] },
            { pack: '500g', price: 3.99, stock: 200, options: [] },
          ]),
          ...this.generateProducts('Mushroom', 'Button mushroom', 'VW-MUSH', [
            { gram: '250g', price: 3.99, stock: 180, options: [] },
            { gram: '500g', price: 6.99, stock: 140, options: [] },
          ]),
          ...this.generateProducts('Corn', 'Fresh sweet corn', 'VW-CORN', [
            { unit: '2 cobs', price: 2.99, stock: 200, options: [] },
            { unit: '4 cobs', price: 5.49, stock: 150, options: [] },
          ]),
          ...this.generateProducts('Cherry', 'Sweet cherry', 'VW-CHER', [
            { gram: '250g', price: 5.99, stock: 120, options: [] },
            { gram: '500g', price: 10.99, stock: 80, options: [] },
          ]),
          ...this.generateProducts('Coconut', 'Fresh coconut', 'VW-COCO', [
            { unit: '1 piece', price: 2.99, stock: 150, options: [] },
            { unit: '3 piece', price: 7.99, stock: 100, options: [] },
          ]),
          ...this.generateProducts('Nuts Mix', 'Mixed nuts', 'VW-NUTS', [
            { gram: '200g', price: 4.99, stock: 180, options: ['Almonds', 'Cashews', 'Walnuts'] },
            { gram: '500g', price: 10.99, stock: 120, options: ['Almonds', 'Cashews', 'Walnuts'] },
          ]),
          ...this.generateProducts('Plum', 'Fresh plum', 'VW-PLUM', [
            { kg: '1kg', price: 4.99, stock: 140, options: [] },
            { kg: '2kg', price: 8.99, stock: 100, options: [] },
          ]),
          ...this.generateProducts('Date', 'Sweet date', 'VW-DATE', [
            { gram: '200g', price: 4.99, stock: 200, options: ['Dried', 'Fresh'] },
            { gram: '500g', price: 10.99, stock: 150, options: ['Dried', 'Fresh'] },
          ]),
          ...this.generateProducts('Chikoo', 'Sapodilla fruit', 'VW-CHIK', [
            { kg: '1kg', price: 3.99, stock: 140, options: [] },
            { kg: '2kg', price: 7.49, stock: 110, options: [] },
          ]),
          ...this.generateProducts('Dragon Fruit', 'Pink dragon fruit', 'VW-DRAG', [
            { unit: '2 pack', price: 8.99, stock: 90, options: [] },
            { unit: '4 pack', price: 15.99, stock: 60, options: [] },
          ]),
          ...this.generateProducts('Star Fruit', 'Carambola fruit', 'VW-STAR', [
            { unit: '3 pack', price: 4.99, stock: 130, options: [] },
            { unit: '6 pack', price: 8.99, stock: 100, options: [] },
          ]),
          ...this.generateProducts('Ginger Root', 'Fresh ginger', 'VW-GING', [
            { gram: '200g', price: 2.99, stock: 200, options: [] },
            { gram: '500g', price: 5.99, stock: 150, options: [] },
          ]),
        ],
      },

      KM001: {
        name: 'Kirana Mart',
        products: [
          // Groceries (50+ products)
          ...this.generateProducts('Rice', 'Premium basmati rice', 'KM-RICE', [
            {
              kg: '1kg',
              price: 8.99,
              stock: 200,
              options: ['White Basmati', 'Brown Basmati', 'Long Grain'],
            },
            {
              kg: '5kg',
              price: 39.99,
              stock: 100,
              options: ['White Basmati', 'Brown Basmati', 'Long Grain'],
            },
            {
              kg: '10kg',
              price: 74.99,
              stock: 50,
              options: ['White Basmati', 'Brown Basmati', 'Long Grain'],
            },
          ]),
          ...this.generateProducts('Flour', 'All-purpose flour', 'KM-FLOU', [
            {
              kg: '1kg',
              price: 2.49,
              stock: 300,
              options: ['Maida', 'Whole Wheat', 'Brown Bread'],
            },
            {
              kg: '5kg',
              price: 9.99,
              stock: 200,
              options: ['Maida', 'Whole Wheat', 'Brown Bread'],
            },
            {
              kg: '10kg',
              price: 17.99,
              stock: 100,
              options: ['Maida', 'Whole Wheat', 'Brown Bread'],
            },
          ]),
          ...this.generateProducts('Sugar', 'Granulated sugar', 'KM-SUGA', [
            { kg: '1kg', price: 3.49, stock: 250, options: ['White', 'Brown', 'Crystal'] },
            { kg: '5kg', price: 15.99, stock: 150, options: ['White', 'Brown', 'Crystal'] },
            { kg: '10kg', price: 28.99, stock: 80, options: ['White', 'Brown', 'Crystal'] },
          ]),
          ...this.generateProducts('Salt', 'Table salt', 'KM-SALT', [
            { kg: '1kg', price: 1.99, stock: 400, options: ['Plain', 'Iodized', 'Rock'] },
            { kg: '5kg', price: 7.99, stock: 200, options: ['Plain', 'Iodized', 'Rock'] },
          ]),
          ...this.generateProducts('Oil', 'Cooking oil', 'KM-COIL', [
            {
              liter: '1L',
              price: 9.99,
              stock: 200,
              options: ['Sunflower', 'Mustard', 'Sesame', 'Coconut'],
            },
            {
              liter: '2L',
              price: 18.99,
              stock: 150,
              options: ['Sunflower', 'Mustard', 'Sesame', 'Coconut'],
            },
            {
              liter: '5L',
              price: 44.99,
              stock: 80,
              options: ['Sunflower', 'Mustard', 'Sesame', 'Coconut'],
            },
          ]),
          ...this.generateProducts('Dal', 'Yellow split peas', 'KM-DALU', [
            { kg: '1kg', price: 6.99, stock: 180, options: ['Yellow', 'Red', 'Green'] },
            { kg: '5kg', price: 32.99, stock: 100, options: ['Yellow', 'Red', 'Green'] },
          ]),
          ...this.generateProducts('Spices Mix', 'Mixed spice blend', 'KM-SPIC', [
            {
              gram: '100g',
              price: 4.99,
              stock: 150,
              options: ['Garam Masala', 'Chaat Masala', 'Curry Powder'],
            },
            {
              gram: '250g',
              price: 11.99,
              stock: 80,
              options: ['Garam Masala', 'Chaat Masala', 'Curry Powder'],
            },
          ]),
          ...this.generateProducts('Turmeric', 'Pure turmeric powder', 'KM-TURM', [
            { gram: '100g', price: 3.99, stock: 200, options: ['Organic', 'Regular', 'Premium'] },
            { gram: '250g', price: 8.99, stock: 120, options: ['Organic', 'Regular', 'Premium'] },
          ]),
          ...this.generateProducts('Chili Powder', 'Red chili powder', 'KM-CHIL', [
            { gram: '100g', price: 2.99, stock: 250, options: ['Mild', 'Medium', 'Hot'] },
            { gram: '250g', price: 6.99, stock: 150, options: ['Mild', 'Medium', 'Hot'] },
          ]),
          ...this.generateProducts('Cumin Seeds', 'Roasted cumin', 'KM-CUMI', [
            { gram: '100g', price: 4.49, stock: 180, options: ['Regular', 'Organic'] },
            { gram: '250g', price: 9.99, stock: 120, options: ['Regular', 'Organic'] },
          ]),
          ...this.generateProducts('Black Pepper', 'Ground pepper', 'KM-BLAK', [
            { gram: '50g', price: 2.99, stock: 200, options: ['Coarse', 'Fine'] },
            { gram: '100g', price: 4.99, stock: 150, options: ['Coarse', 'Fine'] },
          ]),
          // Dairy Products (30+ products)
          ...this.generateProducts('Milk', 'Fresh dairy milk', 'KM-MILK', [
            { liter: '1L', price: 3.99, stock: 250, options: ['Full Fat', 'Toned', 'Low Fat'] },
            { liter: '2L', price: 7.49, stock: 200, options: ['Full Fat', 'Toned', 'Low Fat'] },
            { liter: '5L', price: 17.99, stock: 100, options: ['Full Fat', 'Toned', 'Low Fat'] },
          ]),
          ...this.generateProducts('Yogurt', 'Fresh yogurt', 'KM-YOGU', [
            { gram: '200g', price: 1.99, stock: 200, options: ['Plain', 'Fruit', 'Greek'] },
            { gram: '500g', price: 4.49, stock: 150, options: ['Plain', 'Fruit', 'Greek'] },
            { kg: '1kg', price: 7.99, stock: 100, options: ['Plain', 'Fruit', 'Greek'] },
          ]),
          ...this.generateProducts('Cheese', 'Cheddar cheese', 'KM-CHES', [
            { gram: '200g', price: 6.99, stock: 100, options: ['Mild', 'Medium', 'Sharp'] },
            { gram: '500g', price: 15.99, stock: 70, options: ['Mild', 'Medium', 'Sharp'] },
          ]),
          ...this.generateProducts('Butter', 'Pure butter', 'KM-BUTT', [
            { gram: '200g', price: 5.99, stock: 180, options: ['Salted', 'Unsalted'] },
            { gram: '500g', price: 13.99, stock: 120, options: ['Salted', 'Unsalted'] },
          ]),
          ...this.generateProducts('Paneer', 'Fresh paneer cheese', 'KM-PANE', [
            { gram: '200g', price: 3.99, stock: 150, options: ['Soft', 'Firm'] },
            { gram: '500g', price: 8.99, stock: 100, options: ['Soft', 'Firm'] },
          ]),
          ...this.generateProducts('Cream', 'Heavy cream', 'KM-CREM', [
            { ml: '200ml', price: 3.99, stock: 120, options: [] },
            { ml: '500ml', price: 8.99, stock: 80, options: [] },
          ]),
          // Bakery Products (25 products)
          ...this.generateProducts('Bread', 'Fresh bread loaf', 'KM-BRED', [
            {
              unit: '1 loaf',
              price: 3.49,
              stock: 150,
              options: ['White', 'Brown', 'Multigrain', 'Whole Wheat'],
            },
          ]),
          ...this.generateProducts('Croissants', 'Butter croissants', 'KM-CROS', [
            { unit: '4 pack', price: 5.99, stock: 100, options: ['Plain', 'Chocolate', 'Almond'] },
            { unit: '8 pack', price: 10.99, stock: 70, options: ['Plain', 'Chocolate', 'Almond'] },
          ]),
          ...this.generateProducts('Donuts', 'Glazed donuts', 'KM-DONU', [
            {
              unit: '6 pack',
              price: 4.49,
              stock: 120,
              options: ['Glazed', 'Chocolate', 'Sprinkled', 'Cream Filled'],
            },
            {
              unit: '12 pack',
              price: 7.99,
              stock: 80,
              options: ['Glazed', 'Chocolate', 'Sprinkled', 'Cream Filled'],
            },
          ]),
          ...this.generateProducts('Biscuits', 'Whole grain biscuits', 'KM-BISC', [
            { gram: '200g', price: 1.99, stock: 250, options: ['Plain', 'Chocolate', 'Cheese'] },
            { gram: '500g', price: 4.49, stock: 180, options: ['Plain', 'Chocolate', 'Cheese'] },
          ]),
          ...this.generateProducts('Muffins', 'Fresh muffins', 'KM-MUFF', [
            {
              unit: '3 pack',
              price: 3.99,
              stock: 100,
              options: ['Blueberry', 'Chocolate', 'Banana'],
            },
            {
              unit: '6 pack',
              price: 6.99,
              stock: 70,
              options: ['Blueberry', 'Chocolate', 'Banana'],
            },
          ]),
          ...this.generateProducts('Cake', 'Vanilla sponge cake', 'KM-CAKE', [
            {
              unit: '1 piece',
              price: 2.99,
              stock: 100,
              options: ['Vanilla', 'Chocolate', 'Strawberry'],
            },
          ]),
          // Cosmetics (20 products)
          ...this.generateProducts('Soap', 'Moisturizing soap', 'KM-SOAP', [
            {
              unit: '1 bar',
              price: 2.49,
              stock: 300,
              options: ['Glycerin', 'Aloe Vera', 'Rose', 'Charcoal'],
            },
            {
              unit: '3 pack',
              price: 5.99,
              stock: 200,
              options: ['Glycerin', 'Aloe Vera', 'Rose', 'Charcoal'],
            },
          ]),
          ...this.generateProducts('Shampoo', 'Hair shampoo', 'KM-SHAM', [
            {
              ml: '200ml',
              price: 3.99,
              stock: 200,
              options: ['Anti-Dandruff', 'Moisturizing', 'Volumizing'],
            },
            {
              ml: '500ml',
              price: 7.99,
              stock: 150,
              options: ['Anti-Dandruff', 'Moisturizing', 'Volumizing'],
            },
          ]),
          ...this.generateProducts('Toothpaste', 'Fluoride toothpaste', 'KM-TOOT', [
            { gram: '100g', price: 1.99, stock: 400, options: ['Mint', 'Cinnamon', 'Spice'] },
            { gram: '200g', price: 3.49, stock: 300, options: ['Mint', 'Cinnamon', 'Spice'] },
          ]),
          ...this.generateProducts('Lotion', 'Body lotion', 'KM-LOTI', [
            { ml: '200ml', price: 4.99, stock: 180, options: ['Almond', 'Cocoa Butter', 'Rose'] },
            { ml: '500ml', price: 9.99, stock: 120, options: ['Almond', 'Cocoa Butter', 'Rose'] },
          ]),
          ...this.generateProducts('Deodorant', 'Personal deodorant', 'KM-DEOD', [
            { ml: '50ml', price: 3.99, stock: 200, options: ['Spray', 'Roll-on'] },
            { ml: '150ml', price: 7.99, stock: 150, options: ['Spray', 'Roll-on'] },
          ]),
          // Additional cosmetics
          ...this.generateProducts('Face Wash', 'Foaming face wash', 'KM-FACE', [
            { ml: '100ml', price: 2.99, stock: 250, options: ['Regular', 'Oily Skin', 'Dry Skin'] },
            { ml: '200ml', price: 4.99, stock: 200, options: ['Regular', 'Oily Skin', 'Dry Skin'] },
          ]),
          ...this.generateProducts('Conditioner', 'Hair conditioner', 'KM-COND', [
            { ml: '200ml', price: 3.99, stock: 200, options: ['Regular', 'Smoothing', 'Repair'] },
            { ml: '500ml', price: 7.99, stock: 150, options: ['Regular', 'Smoothing', 'Repair'] },
          ]),
          // Additional groceries
          ...this.generateProducts('Tea', 'Premium tea leaves', 'KM-TEAL', [
            {
              gram: '100g',
              price: 3.99,
              stock: 200,
              options: ['Black Tea', 'Green Tea', 'Herbal'],
            },
            {
              gram: '250g',
              price: 8.99,
              stock: 150,
              options: ['Black Tea', 'Green Tea', 'Herbal'],
            },
          ]),
          ...this.generateProducts('Coffee', 'Ground coffee', 'KM-COFE', [
            {
              gram: '100g',
              price: 4.99,
              stock: 180,
              options: ['Dark Roast', 'Medium Roast', 'Light Roast'],
            },
            {
              gram: '250g',
              price: 10.99,
              stock: 140,
              options: ['Dark Roast', 'Medium Roast', 'Light Roast'],
            },
          ]),
          ...this.generateProducts('Honey', 'Pure honey', 'KM-HONE', [
            { gram: '250g', price: 6.99, stock: 150, options: ['Acacia', 'Wildflower', 'Manuka'] },
            { gram: '500g', price: 12.99, stock: 100, options: ['Acacia', 'Wildflower', 'Manuka'] },
          ]),
          ...this.generateProducts('Peanut Butter', 'Creamy peanut butter', 'KM-PEAB', [
            { gram: '250g', price: 3.99, stock: 200, options: ['Creamy', 'Crunchy'] },
            { gram: '500g', price: 6.99, stock: 160, options: ['Creamy', 'Crunchy'] },
          ]),
          ...this.generateProducts('Jam', 'Fruit jam', 'KM-JAMF', [
            {
              gram: '200g',
              price: 2.99,
              stock: 250,
              options: ['Strawberry', 'Raspberry', 'Mixed Berry'],
            },
            {
              gram: '400g',
              price: 4.99,
              stock: 200,
              options: ['Strawberry', 'Raspberry', 'Mixed Berry'],
            },
          ]),
          ...this.generateProducts('Cornflakes', 'Breakfast cereal', 'KM-CRNF', [
            { gram: '200g', price: 2.99, stock: 250, options: ['Regular', 'Honey', 'Fruity'] },
            { gram: '500g', price: 5.99, stock: 200, options: ['Regular', 'Honey', 'Fruity'] },
          ]),
          ...this.generateProducts('Oats', 'Rolled oats', 'KM-OATS', [
            { gram: '250g', price: 2.49, stock: 280, options: ['Regular', 'Steel Cut', 'Instant'] },
            { gram: '500g', price: 4.49, stock: 220, options: ['Regular', 'Steel Cut', 'Instant'] },
          ]),
          ...this.generateProducts('Pasta', 'Wheat pasta', 'KM-PSTA', [
            { gram: '400g', price: 1.99, stock: 300, options: ['Penne', 'Spaghetti', 'Fusilli'] },
            { gram: '1kg', price: 4.49, stock: 200, options: ['Penne', 'Spaghetti', 'Fusilli'] },
          ]),
          // More grocery items
          ...this.generateProducts('Noodles', 'Instant noodles', 'KM-NOOD', [
            {
              pack: '6 pack',
              price: 1.99,
              stock: 400,
              options: ['Chicken', 'Vegetable', 'Shrimp'],
            },
            {
              pack: '12 pack',
              price: 3.49,
              stock: 300,
              options: ['Chicken', 'Vegetable', 'Shrimp'],
            },
          ]),
          ...this.generateProducts('Biscuit', 'Cookies', 'KM-BISC2', [
            { pack: '200g', price: 2.99, stock: 300, options: ['Chocolate', 'Plain', 'Vanilla'] },
            { pack: '400g', price: 4.99, stock: 250, options: ['Chocolate', 'Plain', 'Vanilla'] },
          ]),
          ...this.generateProducts('Snack Mix', 'Savory snacks', 'KM-SNCK', [
            { gram: '100g', price: 1.99, stock: 400, options: ['Spicy', 'Mild', 'Plain'] },
            { gram: '250g', price: 3.99, stock: 300, options: ['Spicy', 'Mild', 'Plain'] },
          ]),
          ...this.generateProducts('Chocolate', 'Dark chocolate', 'KM-CHOC', [
            { gram: '50g', price: 1.99, stock: 300, options: ['Dark', 'Milk', 'White'] },
            { gram: '100g', price: 3.49, stock: 250, options: ['Dark', 'Milk', 'White'] },
          ]),
          ...this.generateProducts('Candy', 'Assorted candy', 'KM-CAND', [
            { pack: '100g', price: 1.49, stock: 400, options: ['Hard', 'Gummy', 'Chocolate'] },
            { pack: '250g', price: 2.99, stock: 300, options: ['Hard', 'Gummy', 'Chocolate'] },
          ]),
          ...this.generateProducts('Butter', 'Creamery butter', 'KM-BUTT2', [
            { gram: '200g', price: 4.99, stock: 200, options: ['Salted', 'Unsalted'] },
            { gram: '500g', price: 10.99, stock: 150, options: ['Salted', 'Unsalted'] },
          ]),
          ...this.generateProducts('Cheese Spread', 'Processed cheese', 'KM-CHES2', [
            { gram: '200g', price: 3.99, stock: 250, options: ['Plain', 'Herbs', 'Pepper'] },
            { gram: '400g', price: 6.99, stock: 200, options: ['Plain', 'Herbs', 'Pepper'] },
          ]),
          ...this.generateProducts('Yogurt Drink', 'Drinkable yogurt', 'KM-YOGD', [
            { ml: '200ml', price: 2.49, stock: 300, options: ['Mango', 'Strawberry', 'Plain'] },
            {
              pack: '6x200ml',
              price: 12.99,
              stock: 200,
              options: ['Mango', 'Strawberry', 'Plain'],
            },
          ]),
          ...this.generateProducts('Vinegar', 'Apple cider vinegar', 'KM-VINE', [
            { ml: '500ml', price: 3.99, stock: 200, options: [] },
            { ml: '1000ml', price: 6.99, stock: 150, options: [] },
          ]),
          ...this.generateProducts('Sauce', 'Tomato sauce', 'KM-SAUC', [
            { ml: '250ml', price: 1.99, stock: 300, options: ['Mild', 'Medium', 'Hot'] },
            { ml: '500ml', price: 3.49, stock: 250, options: ['Mild', 'Medium', 'Hot'] },
          ]),
          ...this.generateProducts('Pickle', 'Mixed vegetables pickle', 'KM-PICK', [
            { gram: '300g', price: 2.99, stock: 250, options: ['Spicy', 'Mild'] },
            { gram: '500g', price: 4.49, stock: 200, options: ['Spicy', 'Mild'] },
          ]),
        ],
      },

      DH001: {
        name: 'Digital Helper',
        products: [
          // Mobile Phones (15 products)
          ...this.generateProducts('Smartphone', 'Latest smartphone', 'DH-SMPH', [
            {
              model: '6GB/128GB',
              price: 299.99,
              stock: 30,
              options: ['Black', 'Blue', 'Red', 'Gold'],
            },
            {
              model: '8GB/256GB',
              price: 399.99,
              stock: 25,
              options: ['Black', 'Blue', 'Red', 'Gold'],
            },
            {
              model: '12GB/512GB',
              price: 599.99,
              stock: 15,
              options: ['Black', 'Blue', 'Red', 'Gold'],
            },
          ]),
          ...this.generateProducts('Feature Phone', 'Dual SIM phone', 'DH-FEPH', [
            { model: 'Basic', price: 79.99, stock: 50, options: ['Black', 'White', 'Silver'] },
            { model: 'Advanced', price: 129.99, stock: 40, options: ['Black', 'White', 'Silver'] },
          ]),
          // Mobile Accessories (50 products)
          ...this.generateProducts('Phone Case', 'Protective phone case', 'DH-PHCA', [
            {
              model: 'Standard',
              price: 9.99,
              stock: 200,
              options: ['Black', 'Blue', 'Red', 'Transparent'],
            },
            {
              model: 'Premium',
              price: 19.99,
              stock: 150,
              options: ['Black', 'Blue', 'Red', 'Transparent'],
            },
            {
              model: 'Luxury',
              price: 34.99,
              stock: 80,
              options: ['Black', 'Blue', 'Red', 'Transparent'],
            },
          ]),
          ...this.generateProducts('Screen Protector', 'Tempered glass protector', 'DH-SCPR', [
            {
              pack: '1 pack',
              price: 4.99,
              stock: 300,
              options: ['Clear', 'Matte', 'Anti-Blue Light'],
            },
            {
              pack: '3 pack',
              price: 12.99,
              stock: 200,
              options: ['Clear', 'Matte', 'Anti-Blue Light'],
            },
          ]),
          ...this.generateProducts('Phone Charger', 'Fast charging charger', 'DH-CHGR', [
            { type: '18W', price: 12.99, stock: 200, options: ['USB-C', 'Micro USB', 'Lightning'] },
            { type: '33W', price: 24.99, stock: 150, options: ['USB-C', 'Micro USB', 'Lightning'] },
          ]),
          ...this.generateProducts('USB Cable', 'Durable USB cable', 'DH-USBC', [
            { type: 'USB-C', price: 7.99, stock: 300, options: ['1m', '2m', '3m'] },
            { type: 'Micro USB', price: 5.99, stock: 350, options: ['1m', '2m', '3m'] },
          ]),
          ...this.generateProducts('Power Bank', 'Portable battery', 'DH-PWBK', [
            { capacity: '10000mAh', price: 19.99, stock: 150, options: ['Black', 'White', 'Blue'] },
            { capacity: '20000mAh', price: 34.99, stock: 100, options: ['Black', 'White', 'Blue'] },
            { capacity: '30000mAh', price: 49.99, stock: 60, options: ['Black', 'White', 'Blue'] },
          ]),
          ...this.generateProducts('Phone Stand', 'Adjustable stand', 'DH-PHST', [
            { type: 'Desk Mount', price: 8.99, stock: 180, options: ['Black', 'Silver'] },
            { type: 'Car Mount', price: 14.99, stock: 140, options: ['Black', 'Silver'] },
          ]),
          ...this.generateProducts('Screen Lens', 'Camera lens protector', 'DH-LENS', [
            { type: 'Rear Camera', price: 6.99, stock: 250, options: ['Standard', 'Premium'] },
            { type: 'Front Camera', price: 4.99, stock: 280, options: ['Standard', 'Premium'] },
          ]),
          ...this.generateProducts('Phone Ring', 'Metal finger ring', 'DH-RING', [
            { style: 'Basic', price: 3.99, stock: 400, options: ['Silver', 'Gold', 'Black'] },
            { style: 'Diamond', price: 8.99, stock: 200, options: ['Silver', 'Gold', 'Black'] },
          ]),
          // Laptops & Computers (20 products)
          ...this.generateProducts('Laptop', 'Performance laptop', 'DH-LAPT', [
            { config: 'i5/8GB/256GB', price: 599.99, stock: 20, options: ['Silver', 'Black'] },
            { config: 'i7/16GB/512GB', price: 899.99, stock: 15, options: ['Silver', 'Black'] },
          ]),
          ...this.generateProducts('Desktop PC', 'Complete desktop', 'DH-DESK', [
            { config: 'Basic', price: 499.99, stock: 15, options: ['Black', 'White'] },
            { config: 'Gaming', price: 1299.99, stock: 10, options: ['Black', 'White'] },
          ]),
          ...this.generateProducts('Monitor', 'LCD display', 'DH-MONIT', [
            { size: '24 inch', price: 149.99, stock: 40, options: ['1080p', '1440p', '4K'] },
            { size: '27 inch', price: 249.99, stock: 30, options: ['1080p', '1440p', '4K'] },
          ]),
          ...this.generateProducts('Keyboard', 'Mechanical keyboard', 'DH-KEYBR', [
            { type: 'Wired', price: 39.99, stock: 100, options: ['RGB', 'Non-RGB', 'Silent'] },
            { type: 'Wireless', price: 59.99, stock: 80, options: ['RGB', 'Non-RGB', 'Silent'] },
          ]),
          ...this.generateProducts('Mouse', 'Precision mouse', 'DH-MOUS', [
            { type: 'Wired', price: 14.99, stock: 150, options: ['Gaming', 'Office', 'Silent'] },
            { type: 'Wireless', price: 24.99, stock: 120, options: ['Gaming', 'Office', 'Silent'] },
          ]),
          // Headphones & Audio (15 products)
          ...this.generateProducts('Headphones', 'Over-ear headphones', 'DH-HEDP', [
            { type: 'Wired', price: 49.99, stock: 100, options: ['Black', 'White', 'Blue'] },
            { type: 'Wireless', price: 99.99, stock: 70, options: ['Black', 'White', 'Blue'] },
          ]),
          ...this.generateProducts('Earbuds', 'Wireless earbuds', 'DH-EBUD', [
            { type: 'Standard', price: 39.99, stock: 150, options: ['Black', 'White', 'Silver'] },
            { type: 'Premium', price: 99.99, stock: 80, options: ['Black', 'White', 'Silver'] },
          ]),
          ...this.generateProducts('Speaker', 'Bluetooth speaker', 'DH-SPKR', [
            { size: 'Mini', price: 29.99, stock: 120, options: ['Red', 'Black', 'Blue'] },
            { size: 'Portable', price: 59.99, stock: 80, options: ['Red', 'Black', 'Blue'] },
          ]),
          // Cameras & Photography (10 products)
          ...this.generateProducts('Webcam', 'HD webcam', 'DH-WCAM', [
            {
              resolution: '720p',
              price: 29.99,
              stock: 100,
              options: ['Auto Focus', 'Manual Focus'],
            },
            {
              resolution: '1080p',
              price: 49.99,
              stock: 70,
              options: ['Auto Focus', 'Manual Focus'],
            },
          ]),
          ...this.generateProducts('Camera Tripod', 'Adjustable tripod', 'DH-TRPD', [
            { height: '2ft', price: 14.99, stock: 150, options: ['Aluminum', 'Steel'] },
            { height: '3ft', price: 24.99, stock: 100, options: ['Aluminum', 'Steel'] },
          ]),
          // Cables & Connectors (15 products)
          ...this.generateProducts('HDMI Cable', 'High-speed HDMI', 'DH-HDMI', [
            { length: '1m', price: 7.99, stock: 300, options: ['2.0', '2.1'] },
            { length: '2m', price: 12.99, stock: 250, options: ['2.0', '2.1'] },
            { length: '5m', price: 24.99, stock: 150, options: ['2.0', '2.1'] },
          ]),
          ...this.generateProducts('Audio Cable', 'Stereo audio cable', 'DH-AUDC', [
            { type: '3.5mm', price: 4.99, stock: 400, options: ['1m', '2m', '3m'] },
            { type: 'RCA', price: 6.99, stock: 350, options: ['1m', '2m', '3m'] },
          ]),
          // Adapters & Converters (10 products)
          ...this.generateProducts('USB Hub', 'Multi-port hub', 'DH-USBH', [
            { ports: '4 port', price: 19.99, stock: 120, options: ['USB 2.0', 'USB 3.0'] },
            { ports: '7 port', price: 34.99, stock: 80, options: ['USB 2.0', 'USB 3.0'] },
          ]),
          ...this.generateProducts('HDMI Adapter', 'Video adapter', 'DH-HDMA', [
            { type: 'HDMI to VGA', price: 12.99, stock: 150, options: ['Standard', 'Premium'] },
            { type: 'HDMI to USB-C', price: 19.99, stock: 100, options: ['Standard', 'Premium'] },
          ]),
          // Additional electronics
          ...this.generateProducts('Screen Protector Film', 'Anti-glare film', 'DH-SCRN', [
            { size: '13 inch', price: 8.99, stock: 200, options: [] },
            { size: '15 inch', price: 10.99, stock: 180, options: [] },
          ]),
          ...this.generateProducts('Cable Organizer', 'Cable management', 'DH-CORG', [
            { type: 'Clips', price: 4.99, stock: 300, options: [] },
            { type: 'Sleeves', price: 7.99, stock: 250, options: [] },
          ]),
          ...this.generateProducts('Phone Stand', 'Adjustable stand', 'DH-PHST2', [
            { type: 'Desktop', price: 9.99, stock: 200, options: ['Aluminum', 'Plastic'] },
            { type: 'Magnetic', price: 14.99, stock: 150, options: ['Aluminum', 'Plastic'] },
          ]),
          ...this.generateProducts('USB-C Cable', 'Fast charging cable', 'DH-USBC2', [
            { length: '1m', price: 7.99, stock: 350, options: ['2.4A', '3.0A'] },
            { length: '2m', price: 10.99, stock: 300, options: ['2.4A', '3.0A'] },
          ]),
          ...this.generateProducts('Laptop Stand', 'Cooling laptop stand', 'DH-LPST', [
            { type: 'Basic', price: 19.99, stock: 100, options: ['Aluminum', 'Metal'] },
            { type: 'Premium', price: 39.99, stock: 60, options: ['Aluminum', 'Metal'] },
          ]),
          ...this.generateProducts('Monitor Riser', 'Desktop monitor lift', 'DH-MRSE', [
            { load: '15kg', price: 24.99, stock: 80, options: ['Black', 'White'] },
            { load: '25kg', price: 34.99, stock: 60, options: ['Black', 'White'] },
          ]),
          ...this.generateProducts('Cooling Pad', 'Laptop cooling pad', 'DH-COOL', [
            { size: '13 inch', price: 22.99, stock: 90, options: [] },
            { size: '15 inch', price: 28.99, stock: 70, options: [] },
          ]),
          // Additional electronics
          ...this.generateProducts('Mouse Pad', 'Gaming mouse pad', 'DH-MPAD', [
            { size: 'Small', price: 8.99, stock: 250, options: ['Normal', 'Gaming'] },
            { size: 'Large', price: 14.99, stock: 200, options: ['Normal', 'Gaming'] },
          ]),
          ...this.generateProducts('Mechanical Keyboard', 'RGB keyboard', 'DH-MKBD', [
            { type: 'USB', price: 49.99, stock: 100, options: ['Black', 'White'] },
            { type: 'Wireless', price: 69.99, stock: 70, options: ['Black', 'White'] },
          ]),
          ...this.generateProducts('Monitor', '4K display', 'DH-MON4', [
            { size: '24 inch', price: 249.99, stock: 30, options: ['60Hz', '144Hz'] },
            { size: '27 inch', price: 349.99, stock: 25, options: ['60Hz', '144Hz'] },
          ]),
          ...this.generateProducts('Desk Lamp', 'LED desk lamp', 'DH-DLMP', [
            { type: 'Adjustable', price: 24.99, stock: 120, options: ['Warm', 'Cool'] },
            { type: 'Smart', price: 44.99, stock: 80, options: ['Warm', 'Cool', 'RGB'] },
          ]),
          ...this.generateProducts('Surge Protector', 'Power strip', 'DH-SURG', [
            { outlets: '4 outlet', price: 12.99, stock: 200, options: [] },
            { outlets: '6 outlet', price: 18.99, stock: 170, options: [] },
          ]),
          ...this.generateProducts('Extension Cord', 'Power cable', 'DH-EXTN', [
            { length: '5m', price: 7.99, stock: 300, options: [] },
            { length: '10m', price: 12.99, stock: 250, options: [] },
          ]),
          ...this.generateProducts('Wireless Mouse', 'RF mouse', 'DH-WMSE', [
            { type: 'Standard', price: 14.99, stock: 200, options: ['Black', 'White'] },
            { type: 'Ergonomic', price: 24.99, stock: 150, options: ['Black', 'White'] },
          ]),
          ...this.generateProducts('USB Flash Drive', 'Memory stick', 'DH-USBF', [
            { capacity: '32GB', price: 9.99, stock: 250, options: [] },
            { capacity: '64GB', price: 14.99, stock: 200, options: [] },
            { capacity: '128GB', price: 24.99, stock: 150, options: [] },
          ]),
          ...this.generateProducts('SD Card', 'Memory card', 'DH-SDCA', [
            { capacity: '32GB', price: 7.99, stock: 200, options: [] },
            { capacity: '64GB', price: 12.99, stock: 180, options: [] },
            { capacity: '128GB', price: 19.99, stock: 150, options: [] },
          ]),
          ...this.generateProducts('Card Reader', 'Multi card reader', 'DH-CRDR', [
            { type: 'USB 2.0', price: 6.99, stock: 250, options: [] },
            { type: 'USB 3.0', price: 12.99, stock: 200, options: [] },
          ]),
          ...this.generateProducts('Portable SSD', 'External hard drive', 'DH-PSSD', [
            { capacity: '256GB', price: 39.99, stock: 80, options: [] },
            { capacity: '512GB', price: 69.99, stock: 60, options: [] },
            { capacity: '1TB', price: 99.99, stock: 40, options: [] },
          ]),
          ...this.generateProducts('Thumb Keyboard', 'Mini keyboard', 'DH-TKBD', [
            { type: 'Touchpad', price: 34.99, stock: 100, options: ['Black', 'White'] },
            { type: 'Laser', price: 49.99, stock: 70, options: ['Black', 'White'] },
          ]),
          ...this.generateProducts('Graphics Tablet', 'Drawing pad', 'DH-GRAT', [
            { size: 'A6', price: 49.99, stock: 90, options: [] },
            { size: 'A5', price: 79.99, stock: 60, options: [] },
          ]),
          ...this.generateProducts('Microphone', 'USB microphone', 'DH-MICR', [
            { type: 'Condenser', price: 34.99, stock: 110, options: [] },
            { type: 'Cardioid', price: 49.99, stock: 80, options: [] },
          ]),
          ...this.generateProducts('Pop Filter', 'Mic pop shield', 'DH-POPF', [
            { type: 'Mesh', price: 9.99, stock: 200, options: [] },
            { type: 'Premium', price: 14.99, stock: 170, options: [] },
          ]),
          ...this.generateProducts('Boom Arm', 'Microphone stand', 'DH-BOOM', [
            { type: 'Standard', price: 19.99, stock: 150, options: [] },
            { type: 'Professional', price: 34.99, stock: 100, options: [] },
          ]),
          ...this.generateProducts('USB Switch', 'KVM switch', 'DH-KSW2', [
            { ports: '2 port', price: 24.99, stock: 120, options: [] },
            { ports: '4 port', price: 39.99, stock: 80, options: [] },
          ]),
        ],
      },

      MH001: {
        name: 'My Home',
        products: [
          // Kitchen Ware (50 products)
          ...this.generateProducts('Plate', 'Ceramic plate', 'MH-PLAT', [
            { size: '6 inch', price: 4.99, stock: 200, options: ['White', 'Blue', 'Red'] },
            { size: '8 inch', price: 6.99, stock: 180, options: ['White', 'Blue', 'Red'] },
            { set: 'Set of 4', price: 18.99, stock: 120, options: ['White', 'Blue', 'Red'] },
          ]),
          ...this.generateProducts('Bowl', 'Kitchen bowl', 'MH-BOWL', [
            { size: 'Small', price: 3.99, stock: 250, options: ['Ceramic', 'Stainless Steel'] },
            { size: 'Large', price: 7.99, stock: 200, options: ['Ceramic', 'Stainless Steel'] },
            { set: 'Set of 3', price: 16.99, stock: 150, options: ['Ceramic', 'Stainless Steel'] },
          ]),
          ...this.generateProducts('Glass', 'Drinking glass', 'MH-GLSS', [
            { capacity: '200ml', price: 2.99, stock: 300, options: ['Clear', 'Colored'] },
            { capacity: '400ml', price: 3.99, stock: 280, options: ['Clear', 'Colored'] },
            { set: 'Set of 6', price: 14.99, stock: 180, options: ['Clear', 'Colored'] },
          ]),
          ...this.generateProducts('Mug', 'Coffee mug', 'MH-MUGC', [
            {
              capacity: '250ml',
              price: 4.99,
              stock: 200,
              options: ['Ceramic', 'Glass', 'Stainless Steel'],
            },
            {
              capacity: '350ml',
              price: 6.99,
              stock: 180,
              options: ['Ceramic', 'Glass', 'Stainless Steel'],
            },
            {
              set: 'Set of 4',
              price: 19.99,
              stock: 120,
              options: ['Ceramic', 'Glass', 'Stainless Steel'],
            },
          ]),
          ...this.generateProducts('Cutlery', 'Stainless steel spoon', 'MH-CUTL', [
            { type: 'Spoon', price: 2.99, stock: 300, options: ['Regular', 'Large', 'Small'] },
            { type: 'Fork', price: 2.99, stock: 300, options: ['Regular', 'Large', 'Small'] },
            { set: 'Set of 12', price: 24.99, stock: 150, options: ['Standard', 'Fancy'] },
          ]),
          ...this.generateProducts('Knife', 'Kitchen knife', 'MH-KNIF', [
            { type: 'Paring', price: 8.99, stock: 120, options: ['3 inch', '4 inch'] },
            { type: 'Chef', price: 19.99, stock: 80, options: ['6 inch', '8 inch'] },
            {
              set: 'Block Set',
              price: 49.99,
              stock: 40,
              options: ['3 piece', '5 piece', '7 piece'],
            },
          ]),
          ...this.generateProducts('Cutting Board', 'Kitchen board', 'MH-CUTTB', [
            { material: 'Plastic', price: 6.99, stock: 150, options: ['Small', 'Medium', 'Large'] },
            { material: 'Wood', price: 14.99, stock: 100, options: ['Small', 'Medium', 'Large'] },
          ]),
          ...this.generateProducts('Baking Tray', 'Baking sheet', 'MH-BAKTR', [
            { size: 'Small', price: 7.99, stock: 120, options: ['Round', 'Square', 'Rectangular'] },
            {
              size: 'Large',
              price: 12.99,
              stock: 100,
              options: ['Round', 'Square', 'Rectangular'],
            },
          ]),
          ...this.generateProducts('Pan', 'Cooking pan', 'MH-PANC', [
            { size: '6 inch', price: 9.99, stock: 130, options: ['Non-stick', 'Stainless Steel'] },
            { size: '8 inch', price: 14.99, stock: 110, options: ['Non-stick', 'Stainless Steel'] },
            { size: '10 inch', price: 19.99, stock: 90, options: ['Non-stick', 'Stainless Steel'] },
          ]),
          ...this.generateProducts('Pot', 'Cooking pot', 'MH-POTC', [
            { capacity: '2L', price: 12.99, stock: 110, options: ['Stainless Steel', 'Aluminum'] },
            { capacity: '5L', price: 24.99, stock: 80, options: ['Stainless Steel', 'Aluminum'] },
            { set: 'Set of 3', price: 44.99, stock: 60, options: ['Cookware Set'] },
          ]),
          ...this.generateProducts('Lid', 'Pot lid', 'MH-LIDP', [
            { diameter: '6 inch', price: 4.99, stock: 200, options: ['Glass', 'Stainless Steel'] },
            { diameter: '8 inch', price: 5.99, stock: 190, options: ['Glass', 'Stainless Steel'] },
            { diameter: '10 inch', price: 7.99, stock: 170, options: ['Glass', 'Stainless Steel'] },
          ]),
          ...this.generateProducts('Spatula', 'Cooking spatula', 'MH-SPAT', [
            { type: 'Plastic', price: 3.99, stock: 250, options: ['Standard', 'Silicone'] },
            { type: 'Metal', price: 6.99, stock: 180, options: ['Slotted', 'Solid'] },
          ]),
          ...this.generateProducts('Whisk', 'Wire whisk', 'MH-WHSK', [
            { size: 'Small', price: 3.99, stock: 200, options: ['Standard', 'Balloon'] },
            { size: 'Large', price: 5.99, stock: 170, options: ['Standard', 'Balloon'] },
          ]),
          ...this.generateProducts('Ladle', 'Serving ladle', 'MH-LADL', [
            { capacity: '50ml', price: 3.99, stock: 200, options: ['Stainless', 'Plastic'] },
            { capacity: '100ml', price: 5.99, stock: 180, options: ['Stainless', 'Plastic'] },
          ]),
          // Home Ware (35 products)
          ...this.generateProducts('Bedsheet', 'Cotton bedsheet', 'MH-BEDS', [
            {
              size: 'Single',
              price: 14.99,
              stock: 100,
              options: ['White', 'Blue', 'Red', 'Green'],
            },
            { size: 'Double', price: 24.99, stock: 80, options: ['White', 'Blue', 'Red', 'Green'] },
            { size: 'King', price: 34.99, stock: 60, options: ['White', 'Blue', 'Red', 'Green'] },
          ]),
          ...this.generateProducts('Pillow', 'Comfort pillow', 'MH-PILL', [
            { size: 'Standard', price: 9.99, stock: 120, options: ['Soft', 'Medium', 'Firm'] },
            { size: 'King', price: 14.99, stock: 100, options: ['Soft', 'Medium', 'Firm'] },
          ]),
          ...this.generateProducts('Duvet', 'Bed duvet', 'MH-DUV', [
            { size: 'Single', price: 24.99, stock: 80, options: ['Light', 'Medium', 'Heavy'] },
            { size: 'Double', price: 39.99, stock: 60, options: ['Light', 'Medium', 'Heavy'] },
          ]),
          ...this.generateProducts('Towel', 'Bath towel', 'MH-TOWL', [
            { size: 'Hand', price: 4.99, stock: 250, options: ['White', 'Colored'] },
            { size: 'Bath', price: 8.99, stock: 200, options: ['White', 'Colored'] },
            { set: 'Set of 3', price: 22.99, stock: 150, options: ['White', 'Colored'] },
          ]),
          ...this.generateProducts('Rug', 'Floor rug', 'MH-RUGF', [
            { size: '2x3', price: 24.99, stock: 60, options: ['Cotton', 'Wool', 'Synthetic'] },
            { size: '3x5', price: 44.99, stock: 50, options: ['Cotton', 'Wool', 'Synthetic'] },
            { size: '5x8', price: 79.99, stock: 35, options: ['Cotton', 'Wool', 'Synthetic'] },
          ]),
          ...this.generateProducts('Curtain', 'Window curtain', 'MH-CURT', [
            {
              length: '4ft',
              price: 12.99,
              stock: 100,
              options: ['Blackout', 'Semi-Sheer', 'Sheer'],
            },
            {
              length: '6ft',
              price: 18.99,
              stock: 80,
              options: ['Blackout', 'Semi-Sheer', 'Sheer'],
            },
            {
              pair: '2 panel',
              price: 28.99,
              stock: 60,
              options: ['Blackout', 'Semi-Sheer', 'Sheer'],
            },
          ]),
          ...this.generateProducts('Lamp', 'Table lamp', 'MH-LAMP', [
            {
              type: 'LED',
              price: 19.99,
              stock: 90,
              options: ['Warm White', 'Cool White', 'Adjustable'],
            },
            {
              type: 'Desk',
              price: 24.99,
              stock: 80,
              options: ['Warm White', 'Cool White', 'Adjustable'],
            },
          ]),
          ...this.generateProducts('Picture Frame', 'Wall frame', 'MH-FRAM', [
            { size: '4x6', price: 4.99, stock: 200, options: ['Wood', 'Metal', 'Plastic'] },
            { size: '8x10', price: 7.99, stock: 170, options: ['Wood', 'Metal', 'Plastic'] },
            { size: '12x16', price: 12.99, stock: 120, options: ['Wood', 'Metal', 'Plastic'] },
          ]),
          ...this.generateProducts('Mirror', 'Wall mirror', 'MH-MIRR', [
            { size: 'Small', price: 9.99, stock: 120, options: ['Round', 'Square', 'Rectangle'] },
            { size: 'Medium', price: 19.99, stock: 90, options: ['Round', 'Square', 'Rectangle'] },
            { size: 'Large', price: 34.99, stock: 60, options: ['Round', 'Square', 'Rectangle'] },
          ]),
          ...this.generateProducts('Clock', 'Wall clock', 'MH-CLOK', [
            { style: 'Analog', price: 12.99, stock: 100, options: ['Wood', 'Metal', 'Plastic'] },
            { style: 'Digital', price: 19.99, stock: 80, options: ['LED', 'LCD'] },
          ]),
          ...this.generateProducts('Wardrobe', 'Clothing cabinet', 'MH-WARD', [
            { size: '3 door', price: 149.99, stock: 20, options: ['Wooden', 'Metallic'] },
            { size: '4 door', price: 199.99, stock: 15, options: ['Wooden', 'Metallic'] },
          ]),
          // Cleaning Supplies (30 products)
          ...this.generateProducts('Detergent', 'Laundry detergent', 'MH-DETE', [
            { capacity: '500ml', price: 4.99, stock: 200, options: ['Powder', 'Liquid', 'Gel'] },
            { capacity: '1L', price: 8.99, stock: 150, options: ['Powder', 'Liquid', 'Gel'] },
            { capacity: '5L', price: 34.99, stock: 80, options: ['Powder', 'Liquid', 'Gel'] },
          ]),
          ...this.generateProducts('Dish Soap', 'Dishwashing soap', 'MH-DISH', [
            { capacity: '250ml', price: 1.99, stock: 300, options: ['Lemon', 'Lime', 'Rose'] },
            { capacity: '500ml', price: 3.49, stock: 250, options: ['Lemon', 'Lime', 'Rose'] },
          ]),
          ...this.generateProducts('Cleaner', 'Multi-purpose cleaner', 'MH-CLEN', [
            { capacity: '500ml', price: 3.99, stock: 250, options: ['Spray', 'Concentrate'] },
            { capacity: '1L', price: 6.99, stock: 200, options: ['Spray', 'Concentrate'] },
          ]),
          ...this.generateProducts('Disinfectant', 'Floor disinfectant', 'MH-DISF', [
            { capacity: '500ml', price: 4.99, stock: 200, options: ['Pine', 'Lemon', 'Lavender'] },
            { capacity: '1L', price: 7.99, stock: 150, options: ['Pine', 'Lemon', 'Lavender'] },
          ]),
          ...this.generateProducts('Bleach', 'Chlorine bleach', 'MH-BLCH', [
            { capacity: '500ml', price: 2.49, stock: 300, options: ['Standard', 'Non-Chlorine'] },
            { capacity: '1L', price: 4.49, stock: 250, options: ['Standard', 'Non-Chlorine'] },
          ]),
          ...this.generateProducts('Air Freshener', 'Room freshener', 'MH-AIRFR', [
            { type: 'Spray', price: 3.99, stock: 250, options: ['Lavender', 'Rose', 'Lemon'] },
            { type: 'Gel', price: 5.99, stock: 200, options: ['Lavender', 'Rose', 'Lemon'] },
          ]),
          ...this.generateProducts('Mop', 'Floor mop', 'MH-MOPP', [
            {
              type: 'Wet Mop',
              price: 12.99,
              stock: 100,
              options: ['Microfiber', 'Cotton', 'Synthetic'],
            },
            {
              type: 'Dry Mop',
              price: 8.99,
              stock: 120,
              options: ['Microfiber', 'Cotton', 'Synthetic'],
            },
          ]),
          ...this.generateProducts('Broom', 'Cleaning broom', 'MH-BROM', [
            { type: 'Soft', price: 6.99, stock: 150, options: ['Short', 'Long'] },
            { type: 'Stiff', price: 7.99, stock: 140, options: ['Short', 'Long'] },
          ]),
          ...this.generateProducts('Sponge', 'Cleaning sponge', 'MH-SPNG', [
            { pack: '1 pack', price: 1.99, stock: 400, options: ['Regular', 'Scrubbing'] },
            { pack: '3 pack', price: 4.99, stock: 300, options: ['Regular', 'Scrubbing'] },
          ]),
          ...this.generateProducts('Cloth', 'Microfiber cloth', 'MH-CLTH', [
            { pack: '1 pack', price: 2.99, stock: 350, options: ['Small', 'Large'] },
            { pack: '5 pack', price: 11.99, stock: 250, options: ['Small', 'Large'] },
          ]),
          // Additional home items
          ...this.generateProducts('Sheets Set', 'Complete bed sheet set', 'MH-SHTS', [
            { size: 'Single', price: 29.99, stock: 80, options: ['Cotton', 'Polyester'] },
            { size: 'Double', price: 44.99, stock: 60, options: ['Cotton', 'Polyester'] },
          ]),
          ...this.generateProducts('Comforter', 'Quilted comforter', 'MH-COMF', [
            { size: 'Single', price: 34.99, stock: 70, options: ['Light', 'Medium'] },
            { size: 'Double', price: 49.99, stock: 50, options: ['Light', 'Medium'] },
          ]),
          ...this.generateProducts('Cushion', 'Decorative pillow', 'MH-CUSH', [
            { size: 'Small', price: 7.99, stock: 180, options: ['Round', 'Square', 'Rectangle'] },
            { size: 'Large', price: 14.99, stock: 140, options: ['Round', 'Square', 'Rectangle'] },
          ]),
          ...this.generateProducts('Table Cloth', 'Dining table cover', 'MH-TCLO', [
            {
              size: '4 seater',
              price: 19.99,
              stock: 100,
              options: ['Cotton', 'Synthetic', 'Plastic'],
            },
            {
              size: '6 seater',
              price: 29.99,
              stock: 80,
              options: ['Cotton', 'Synthetic', 'Plastic'],
            },
          ]),
          ...this.generateProducts('Napkins', 'Paper napkins', 'MH-NAPK', [
            { pack: '50 pack', price: 2.99, stock: 400, options: ['White', 'Colored'] },
            { pack: '100 pack', price: 4.99, stock: 350, options: ['White', 'Colored'] },
          ]),
          ...this.generateProducts('Trash Can', 'Waste bin', 'MH-TRAS', [
            { capacity: '5L', price: 8.99, stock: 150, options: ['Stainless Steel', 'Plastic'] },
            { capacity: '10L', price: 14.99, stock: 120, options: ['Stainless Steel', 'Plastic'] },
          ]),
          ...this.generateProducts('Storage Box', 'Plastic storage', 'MH-STOR', [
            { size: 'Small', price: 6.99, stock: 200, options: ['Transparent', 'Opaque'] },
            { size: 'Large', price: 12.99, stock: 150, options: ['Transparent', 'Opaque'] },
          ]),
          ...this.generateProducts('Shelf Organizer', 'Multi-tier shelf', 'MH-SHEL', [
            { tiers: '3 tier', price: 24.99, stock: 80, options: ['Wooden', 'Metallic'] },
            { tiers: '5 tier', price: 39.99, stock: 60, options: ['Wooden', 'Metallic'] },
          ]),
        ],
      },
    }

    let totalProducts = 0

    for (const [storeCode, storeData] of Object.entries(storeProducts)) {
      const org = organisations.find((o) => o.organisationUniqueCode === storeCode)

      if (!org) {
        console.log(`Organisation ${storeCode} not found, skipping...`)
        continue
      }

      // Fetch categories for this organization
      const categories = await ProductCategory.query()
        .where('organisationId', org.id)
        .where('isActive', true)

      if (categories.length === 0) {
        console.log(`No categories found for ${storeData.name}, skipping product creation...`)
        continue
      }

      // Helper to get category by name
      const getCategoryId = (productName: string): number => {
        const nameLower = productName.toLowerCase()

        // Vegetable Wings categories
        if (
          nameLower.includes('tomato') ||
          nameLower.includes('carrot') ||
          nameLower.includes('broccoli') ||
          nameLower.includes('spinach') ||
          nameLower.includes('pepper') ||
          nameLower.includes('onion') ||
          nameLower.includes('potato') ||
          nameLower.includes('cucumber') ||
          nameLower.includes('lettuce') ||
          nameLower.includes('garlic') ||
          nameLower.includes('cabbage') ||
          nameLower.includes('cauliflower') ||
          nameLower.includes('radish') ||
          nameLower.includes('zucchini') ||
          nameLower.includes('eggplant')
        ) {
          const vegCategory = categories.find((c) => c.name.toLowerCase() === 'vegetables')
          if (vegCategory) return vegCategory.id
        }

        if (
          nameLower.includes('apple') ||
          nameLower.includes('banana') ||
          nameLower.includes('orange') ||
          nameLower.includes('strawberr') ||
          nameLower.includes('grape') ||
          nameLower.includes('mango') ||
          nameLower.includes('pineapple') ||
          nameLower.includes('watermelon') ||
          nameLower.includes('blueberr') ||
          nameLower.includes('kiwi') ||
          nameLower.includes('papaya') ||
          nameLower.includes('guava') ||
          nameLower.includes('lime') ||
          nameLower.includes('lemon') ||
          nameLower.includes('pomegranate')
        ) {
          const fruitCategory = categories.find((c) => c.name.toLowerCase() === 'fruits')
          if (fruitCategory) return fruitCategory.id
        }

        // Kirana Mart categories
        if (
          nameLower.includes('milk') ||
          nameLower.includes('yogurt') ||
          nameLower.includes('cheese') ||
          nameLower.includes('butter') ||
          nameLower.includes('paneer') ||
          nameLower.includes('cream')
        ) {
          const dairyCategory = categories.find((c) => c.name.toLowerCase() === 'dairy')
          if (dairyCategory) return dairyCategory.id
        }

        if (
          nameLower.includes('bread') ||
          nameLower.includes('croissant') ||
          nameLower.includes('donut') ||
          nameLower.includes('bagel') ||
          nameLower.includes('muffin') ||
          nameLower.includes('cake') ||
          nameLower.includes('cookie') ||
          nameLower.includes('bun')
        ) {
          const bakeryCategory = categories.find((c) => c.name.toLowerCase() === 'bakery')
          if (bakeryCategory) return bakeryCategory.id
        }

        if (
          nameLower.includes('chips') ||
          nameLower.includes('popcorn') ||
          nameLower.includes('crackers') ||
          nameLower.includes('nuts') ||
          nameLower.includes('candy') ||
          nameLower.includes('chocolate')
        ) {
          const snacksCategory = categories.find((c) => c.name.toLowerCase() === 'snacks')
          if (snacksCategory) return snacksCategory.id
        }

        if (
          nameLower.includes('juice') ||
          nameLower.includes('soda') ||
          nameLower.includes('water') ||
          nameLower.includes('coffee') ||
          nameLower.includes('tea') ||
          nameLower.includes('energy drink')
        ) {
          const beveragesCategory = categories.find((c) => c.name.toLowerCase() === 'beverages')
          if (beveragesCategory) return beveragesCategory.id
        }

        // Digital Helper categories
        if (
          nameLower.includes('phone') ||
          nameLower.includes('laptop') ||
          nameLower.includes('tablet') ||
          nameLower.includes('camera') ||
          nameLower.includes('speaker') ||
          nameLower.includes('monitor')
        ) {
          const electronicsCategory = categories.find((c) => c.name.toLowerCase() === 'electronics')
          if (electronicsCategory) return electronicsCategory.id
        }

        if (
          nameLower.includes('charger') ||
          nameLower.includes('cable') ||
          nameLower.includes('case') ||
          nameLower.includes('screen protector') ||
          nameLower.includes('earbuds') ||
          nameLower.includes('adapter')
        ) {
          const accessoriesCategory = categories.find((c) => c.name.toLowerCase() === 'accessories')
          if (accessoriesCategory) return accessoriesCategory.id
        }

        // My Home categories
        if (
          nameLower.includes('towel') ||
          nameLower.includes('curtain') ||
          nameLower.includes('rug') ||
          nameLower.includes('lamp') ||
          nameLower.includes('frame') ||
          nameLower.includes('vase') ||
          nameLower.includes('sheet') ||
          nameLower.includes('comforter') ||
          nameLower.includes('cushion') ||
          nameLower.includes('table cloth') ||
          nameLower.includes('napkin')
        ) {
          const homeCategory = categories.find((c) => c.name.toLowerCase() === 'home')
          if (homeCategory) return homeCategory.id
        }

        if (
          nameLower.includes('detergent') ||
          nameLower.includes('soap') ||
          nameLower.includes('cleaner') ||
          nameLower.includes('wipes') ||
          nameLower.includes('mop') ||
          nameLower.includes('broom') ||
          nameLower.includes('trash can')
        ) {
          const cleaningCategory = categories.find((c) => c.name.toLowerCase() === 'cleaning')
          if (cleaningCategory) return cleaningCategory.id
        }

        if (
          nameLower.includes('pan') ||
          nameLower.includes('pot') ||
          nameLower.includes('knife') ||
          nameLower.includes('cutting board') ||
          nameLower.includes('spatula') ||
          nameLower.includes('peeler') ||
          nameLower.includes('storage box') ||
          nameLower.includes('shelf')
        ) {
          const kitchenCategory = categories.find((c) => c.name.toLowerCase() === 'kitchen')
          if (kitchenCategory) return kitchenCategory.id
        }

        // Default to first category if no match
        return categories[0].id
      }

      const productsList = storeData.products

      for (const product of productsList) {
        const categoryId = getCategoryId(product.name)

        // Create images for this product
        const { bannerImage, mainImage, galleryImages } = await this.createSampleImages(
          product.name,
          org.id
        )

        // Create product with images
        const createdProduct = await Product.create({
          organisationId: org.id,
          categoryId: categoryId,
          name: product.name,
          description: product.description,
          sku: product.sku,
          price: product.price,
          currency: org.currency,
          stock: product.stock,
          unit: product.unit,
          imageUrl: product.imageUrl,
          bannerImageId: bannerImage.id,
          imageId: mainImage.id,
          details: `<h2>About ${product.name}</h2><p>${product.description}</p><h3>Features</h3><ul><li>High quality</li><li>Fresh and organic</li><li>Best price guaranteed</li></ul>`,
          options:
            product.options && product.options.length > 0
              ? JSON.stringify(product.options)
              : JSON.stringify([]),
          productGroupId: product.productGroupId || null,
          isActive: true,
        })

        // Create product gallery images
        for (const galleryImage of galleryImages) {
          await ProductImage.create({
            productId: createdProduct.id,
            uploadId: galleryImage.id,
          })
        }

        totalProducts++
      }

      console.log(`✅ Created ${productsList.length} products for ${storeData.name} (${storeCode})`)
    }

    console.log(`✅ Total: ${totalProducts} products created across 4 stores`)
  }

  private productGroupCounter = 0

  private generateProducts(
    baseName: string,
    description: string,
    skuBase: string,
    variants: any[]
  ) {
    const products = []
    let variantIndex = 0

    // Increment and assign the same productGroupId to all variants of this product
    this.productGroupCounter++
    const currentGroupId = this.productGroupCounter

    for (const variant of variants) {
      variantIndex++
      const key = Object.keys(variant).find(
        (k) => k !== 'price' && k !== 'stock' && k !== 'options'
      )
      const value = key ? variant[key] : ''
      const name = value ? `${baseName} ${value}` : baseName

      products.push({
        name,
        description,
        sku: `${skuBase}-${String(variantIndex).padStart(3, '0')}`,
        price: variant.price,
        stock: variant.stock,
        unit: value,
        imageUrl: null,
        options: variant.options || [],
        productGroupId: currentGroupId,
      })
    }

    return products
  }

  private async createSampleImages(productName: string, _organisationId: number) {
    // Generate random seed for consistent images per product name
    const seed = productName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

    // Use picsum.photos for placeholder images - these URLs will work directly
    const bannerWidth = 1200
    const bannerHeight = 400
    const productWidth = 800
    const productHeight = 800

    // Create banner image (wide format)
    const bannerImage = await Upload.create({
      name: `${productName} Banner`,
      mimeType: 'image/jpeg',
      size: 150000,
      key: `https://picsum.photos/seed/${seed}-banner/${bannerWidth}/${bannerHeight}`,
      urlPrefix: '',
      driver: 'external', // Use 'external' driver for third-party URLs
    })

    // Create main product image (square format)
    const mainImage = await Upload.create({
      name: `${productName} Main`,
      mimeType: 'image/jpeg',
      size: 100000,
      key: `https://picsum.photos/seed/${seed}-main/${productWidth}/${productHeight}`,
      urlPrefix: '',
      driver: 'external',
    })

    // Create 2-4 additional images for the gallery
    const galleryImages = []
    const imageCount = Math.floor(Math.random() * 3) + 2 // 2-4 images

    for (let i = 0; i < imageCount; i++) {
      const galleryImage = await Upload.create({
        name: `${productName} Gallery ${i + 1}`,
        mimeType: 'image/jpeg',
        size: 80000,
        key: `https://picsum.photos/seed/${seed}-gallery${i}/${productWidth}/${productHeight}`,
        urlPrefix: '',
        driver: 'external',
      })
      galleryImages.push(galleryImage)
    }

    return { bannerImage, mainImage, galleryImages }
  }
}
