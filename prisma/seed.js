const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🕶️  Seeding IMF database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123456', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@imf.gov' },
    update: {},
    create: {
      email: 'admin@imf.gov',
      password: adminPassword,
      role: 'ADMIN'
    }
  });

  // Create handler user
  const handlerPassword = await bcrypt.hash('handler123456', 12);
  const handler = await prisma.user.upsert({
    where: { email: 'handler@imf.gov' },
    update: {},
    create: {
      email: 'handler@imf.gov',
      password: handlerPassword,
      role: 'HANDLER'
    }
  });

  // Create agent user
  const agentPassword = await bcrypt.hash('agent123456', 12);
  const agent = await prisma.user.upsert({
    where: { email: 'agent@imf.gov' },
    update: {},
    create: {
      email: 'agent@imf.gov',
      password: agentPassword,
      role: 'AGENT'
    }
  });

  // Create some sample gadgets
  const gadgets = [
    {
      name: 'Explosive Gum',
      codename: 'The Nightingale',
      description: 'Chewing gum that explodes with the force of a grenade when activated',
      status: 'AVAILABLE'
    },
    {
      name: 'Face Mask Printer',
      codename: 'Project Phantom',
      description: 'Portable device that creates realistic face masks for disguise',
      status: 'DEPLOYED'
    },
    {
      name: 'Magnetic Climbing Gloves',
      codename: 'Operation Spider',
      description: 'Gloves that allow climbing on any metal surface',
      status: 'AVAILABLE'
    },
    {
      name: 'Sonic Screwdriver',
      codename: 'The Kraken',
      description: 'Multi-tool that can unlock doors, disable electronics, and more',
      status: 'DESTROYED'
    },
    {
      name: 'Invisible Ink Pen',
      codename: 'Shadow Cipher',
      description: 'Pen that writes with ink only visible under specific light wavelengths',
      status: 'DECOMMISSIONED',
      decommissionedAt: new Date('2023-12-01')
    }
  ];

  for (const gadgetData of gadgets) {
    await prisma.gadget.upsert({
      where: { codename: gadgetData.codename },
      update: {},
      create: gadgetData
    });
  }

  console.log('✅ Database seeding completed!');
  console.log('🎭 Test users created:');
  console.log('   Admin: admin@imf.gov / admin123456');
  console.log('   Handler: handler@imf.gov / handler123456');
  console.log('   Agent: agent@imf.gov / agent123456');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });