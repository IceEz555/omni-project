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

    // Seed projects for specific users
    if (u.username === 'sarah') {
       await createProject(user.id, "Yoga Research Lab");
       // Add dummy session
       await createSession(user.id, "Yoga Research Lab");
    } else if (u.username === 'john') {
       await createProject(user.id, "Physical Therapy Clinic");
    }
  }

  console.log('✅ Seeding finished.');
}

async function createProject(ownerId, projectName) {
    const existing = await prisma.project.findFirst({ where: { name: projectName }});
    let projectId = existing?.id;

    if (!existing) {
        const p = await prisma.project.create({
            data: {
                name: projectName,
                owner_id: ownerId,
            }
        });
        projectId = p.id;
        console.log(`Created Project: ${projectName}`);
    }

    // Add owner as member
    await prisma.projectUser.upsert({
        where: { project_id_user_id: { project_id: projectId, user_id: ownerId } },
        update: {},
        create: {
            project_id: projectId,
            user_id: ownerId,
            role_in_project: 'ADMIN' 
        }
    });
}

async function createSession(userId, projectName) {
    const project = await prisma.project.findFirst({ where: { name: projectName }});
    const profile = await prisma.deviceProfile.upsert({
        where: { profile_id: 'yoga_mat_v1' },
        update: {},
        create: { profile_id: 'yoga_mat_v1', data_type: 'matrix', schema_definition: {} }
    });
    
    const device = await prisma.device.upsert({
        where: { project_id_device_name: { project_id: project.id, device_name: 'Mat 1' } },
        update: {},
        create: { 
            device_name: 'Mat 1', 
            project_id: project.id, 
            device_profile_id: profile.id 
        }
    });

    await prisma.session.create({
        data: {
            project_id: project.id,
            device_id: device.id,
            user_id: userId,
            start_time: new Date()
        }
    });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
