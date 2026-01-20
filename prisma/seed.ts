import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '../generated/prisma/client';
import { Roles } from '../generated/prisma/enums';

dotenv.config();

import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const superAdminEmail = 'superadmin@edunode.com';
  const hashedPassword = await bcrypt.hash('Superpassword@123', 10);

  const adminData = {
    email: superAdminEmail,
    password: hashedPassword,
    fullName: 'Superadmin',
    role: Roles.superadmin,
    isActive: true,
    updatedAt: new Date(),
  };

  const superAdmin = await prisma.users.upsert({
    where: { email: superAdminEmail },
    update: adminData,
    create: {
      ...adminData,
      id: uuidv4(),
      createdAt: new Date(),
    },
  });

  console.log(`Superadmin user configured: ${superAdmin.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
