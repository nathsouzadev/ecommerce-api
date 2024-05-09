import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { PrismaService } from '../config/prisma/prisma.service';

@Module({
  providers: [UserService, PrismaService],
})
export class UserModule {}
