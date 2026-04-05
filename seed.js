const sequelize = require('./config/db');
const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced');

    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await User.create({
      username: 'Daniel Sunday',
      email: 'testuser@example.com',
      password: hashedPassword,
      role: 'customer'
    });
    console.log('Test user created');

    const categories = await Category.bulkCreate([
      { name: 'Electronics', description: 'Next-generation hardware for the modern visionary.', image: 'electronics_bg.jpg' },
      { name: 'Fashion', description: 'Curated apparel and luxury accessories.', image: 'fashion_bg.jpg' },
      { name: 'Computing', description: 'Laptops, desktops, and industrial hardware.', image: 'computing_bg.jpg' },
      { name: 'Gaming', description: 'Consoles, high-refresh monitors, and elite peripherals.', image: 'gaming_bg.jpg' },
      { name: 'Appliances', description: 'High-end home electronics and kitchen essentials.', image: 'appliances_bg.jpg' },
      { name: 'Home & Garden', description: 'Artisanal furniture and organic garden essentials.', image: 'home_garden_bg.jpg' },
      { name: 'Beauty & Wellness', description: 'Holistic care routines for the conscious individual.', image: 'beauty_bg.jpg' },
    ]);
    console.log('Categories created');

    const products = await Product.bulkCreate([
      // Computing
      { name: 'Aether Ultra-Slim Laptop', description: 'Charcoal metallic finish, 16" OLED display, 32GB RAM.', price: 1899.99, stock: 10, categoryId: categories[2].id, imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=1000' },
      
      // Fashion
      { name: 'Heritage Series Watch', description: 'Silver chronograph with sapphire crystal.', price: 1250.00, stock: 5, categoryId: categories[1].id, imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=1000' },
      { name: 'Tobacco Carry-on Bag', description: 'Premium leather travel bag.', price: 495.00, stock: 15, categoryId: categories[1].id, imageUrl: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=1000' },
      
      // Gaming
      { name: 'Studio-X Pro Headphones', description: 'Noise-cancelling wireless headphones.', price: 349.99, stock: 20, categoryId: categories[3].id, imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000' },
      
      // Home & Garden / Appliances
      { name: 'Emerald Velvet Sofa', description: 'Minimalist olive green velvet sofa with dark oak legs.', price: 899.00, stock: 12, categoryId: categories[5].id, imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1000' },
      { name: 'Fiddle Leaf Fig', description: 'Stunning live plant in a handcrafted ceramic pot.', price: 45.00, stock: 54, categoryId: categories[5].id, imageUrl: 'https://images.unsplash.com/photo-1597055181300-e3633a9079ed?auto=format&fit=crop&q=80&w=1000' },
      { name: 'Matte Pour-Over Set', description: 'Matte black cast iron kettle and ceramic dripper.', price: 120.00, stock: 210, categoryId: categories[4].id, imageUrl: 'https://images.unsplash.com/photo-1544787210-2211d4301667?auto=format&fit=crop&q=80&w=1000' },
      { name: 'Bohemian Hammock', description: 'Artisanal hand-woven outdoor hammock with fringes.', price: 75.00, stock: 2, categoryId: categories[5].id, imageUrl: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&q=80&w=1000' },
      { name: 'Lunar Brass Clock', description: 'Minimalist brass wall clock with no numbers.', price: 150.00, stock: 42, categoryId: categories[5].id, imageUrl: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&q=80&w=1000' },
      { name: 'Terracotta Trio', description: 'Set of three organic clay garden pots.', price: 38.00, stock: 15, categoryId: categories[5].id, imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=1000' },
      { name: 'Architect Desk Lamp', description: 'Modern brushed steel lamp with geometric bulb.', price: 185.00, stock: 67, categoryId: categories[4].id, imageUrl: 'https://images.unsplash.com/photo-1534073828943-f801091bbff8?auto=format&fit=crop&q=80&w=1000' },
      { name: 'Signature Steel Set', description: '12-piece professional stainless steel cookware.', price: 499.00, stock: 345, categoryId: categories[4].id, imageUrl: 'https://images.unsplash.com/photo-1584990333939-7290082697e3?auto=format&fit=crop&q=80&w=1000' },
      
      // Beauty
      { name: 'Radiance Serum', description: 'Active Vitamin C complex for bright skin.', price: 64.00, stock: 88, categoryId: categories[6].id, imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1000' },
    ]);
    console.log('Products seeded');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
