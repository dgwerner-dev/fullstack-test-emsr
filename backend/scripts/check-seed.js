const { PrismaClient } = require('@prisma/client');

async function checkAndSeed() {
  const prisma = new PrismaClient();
  
  try {
    const count = await prisma.event.count();
    console.log('Events count:', count);
    
    if (count === 0) {
      console.log('Running seed...');
      require('../dist/prisma/seed.js');
    } else {
      console.log('Data already exists, skipping seed');
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndSeed(); 