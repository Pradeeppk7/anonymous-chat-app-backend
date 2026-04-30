const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

(async () => {
  const prisma = new PrismaClient();
  try {
    const admin = await prisma.admin.findUnique({ where: { username: 'admin' } });
    console.log('admin', admin ? { username: admin.username, hash: admin.password.slice(0, 15) + '...' } : null);
    if (admin) {
      const match = await bcrypt.compare('Admin123', admin.password);
      console.log('matches Admin123?', match);
    }
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
})();