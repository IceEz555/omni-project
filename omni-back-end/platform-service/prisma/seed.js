import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding...');

  // 1. Roles
  const roles = ['ADMIN', 'OPERATOR', 'SUPPORTER', 'USER'];
  const roleMap = {};

  for (const r of roles) {
    const role = await prisma.role.upsert({
      where: { name: r },
      update: {},
      create: { name: r, description: `Default ${r} role` },
    });
    roleMap[r] = role.id;
    console.log(`Created Role: ${r}`);
  }

  // 2. Users (Matches UI + Admin)
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const usersData = [
    { name: 'System Admin', email: 'admin@omni.com', username: 'admin', role: 'ADMIN' },
    { name: 'Sarah Chen', email: 'sarah.chen@example.com', username: 'sarah', role: 'OPERATOR' },
    { name: 'Dr. Martinez', email: 'martinez@example.com', username: 'martinez', role: 'SUPPORTER' },
    { name: 'John Smith', email: 'john.smith@example.com', username: 'john', role: 'OPERATOR' },
    { name: 'Emma Wilson', email: 'emma.w@example.com', username: 'emma', role: 'SUPPORTER' },
    { name: 'David Kim', email: 'david.k@example.com', username: 'david', role: 'OPERATOR' }
  ];

  for (const u of usersData) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        username: u.username,
        password_hash: passwordHash,
        role_id: roleMap[u.role]
      }
    });
    console.log(`Created User: ${u.username}`);

    // Seed projects for specific users - REMOVED
    // if (u.username === 'sarah') { ... }
  }

  console.log('✅ Seeding finished.');
}

// function createProject() ... REMOVED
// function createSession() ... REMOVED

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
