
import { Role, Category } from '../constants/enum';
import bcrypt from 'bcrypt';

import { prisma } from '../config/database';


async function main() {
  console.log('🌱 Seeding database...');
  
  // 1. Seed Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pos.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@pos.com',
      phone: '081234567890',
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  });
  console.log('✅ Admin created:', admin.email);
  
  // 2. Seed Employee User
  const employeePassword = await bcrypt.hash('employee123', 10);
  const employee = await prisma.user.upsert({
    where: { email: 'employee@pos.com' },
    update: {},
    create: {
      name: 'Kasir 1',
      email: 'employee@pos.com',
      phone: '081234567891',
      passwordHash: employeePassword,
      role: Role.EMPLOYEE,
    },
  });
  console.log('✅ Employee created:', employee.email);
  
  // 3. Seed Products
  const products = [
{ name: 'Nasi Goreng Spesial', category: Category.FOOD, price: 35000, description: 'Nasi goreng dengan telur, ayam, dan udang' },
{ name: 'Mie Goreng Jawa', category: Category.FOOD, price: 28000, description: 'Mie goreng khas Jawa dengan rasa manis' },
{ name: 'Ayam Bakar', category: Category.FOOD, price: 45000, description: 'Ayam bakar dengan bumbu kecap' },
{ name: 'Es Teh Manis', category: Category.BEVERAGE, price: 5000, description: 'Es teh segar dengan gula asli' },
{ name: 'Es Jeruk Peras', category: Category.BEVERAGE, price: 8000, description: 'Jeruk peras segar tanpa pengawet' },
{ name: 'Kopi Hitam', category: Category.BEVERAGE, price: 10000, description: 'Kopi hitam original' },
{ name: 'Brownies Chocolate', category: Category.DESSERT, price: 18000, description: 'Brownies lembut dengan topping coklat' },
{ name: 'Puding Cendol', category: Category.DESSERT, price: 12000, description: 'Puding cendol dengan sirup gula merah' },
{ name: 'Es Krim Vanilla', category: Category.DESSERT, price: 15000, description: 'Es krim vanilla dengan topping coklat' },
  ];
  
  for (const product of products) {
    const existingProduct = await prisma.product.findFirst({
      where: { name: product.name },
    });
    
    if (!existingProduct) {
      await prisma.product.create({ data: product });
      console.log(`✅ Product created: ${product.name}`);
    } else {
      console.log(`⏭️ Product already exists: ${product.name}`);
    }
  }
  
  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

