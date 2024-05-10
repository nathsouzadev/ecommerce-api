import { PrismaClient } from '@prisma/client';

const prismadb = new PrismaClient({ log: ['query'] });

export default prismadb;
