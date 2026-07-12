import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@transitops.com';
  const existing = await prisma.user.findUnique({ where: { email } });
  
  if (!existing) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'FLEET_MANAGER'
      }
    });
    console.log('Test user created successfully!');
  } else {
    console.log('Test user already exists.');
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
