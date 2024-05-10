import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient({ log: ['query'] });

const clearDb = async () => {
  await prismaClient.billboard.deleteMany();
  await prismaClient.store.deleteMany();
};

clearDb();
