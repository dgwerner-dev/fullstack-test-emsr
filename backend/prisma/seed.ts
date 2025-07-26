import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin1234', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      email: 'admin@admin.com',
      name: 'Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create regular user
  const userPassword = await bcrypt.hash('user1234', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@user.com' },
    update: {},
    create: {
      email: 'user@user.com',
      name: 'User',
      password: userPassword,
      role: 'USER',
    },
  });

  // Create sample events
  const now = new Date();
  for (let i = 1; i <= 3; i++) {
    const eventName = `Sample Event ${i}`;
    const existing = await prisma.event.findFirst({ where: { name: eventName } });
    if (!existing) {
      await prisma.event.create({
        data: {
          name: eventName,
          description: `This is sample event number ${i}.`,
          eventDate: new Date(now.getTime() + i * 86400000),
          maxCapacity: 100,
          creatorId: admin.id,
        },
      });
    }
  }


}

main()
  .catch(e => {
  
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 