import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UsersController } from './user.controller';
import { StoreService } from '../store/service/store.service';
import { StoreRepository } from '../store/repository/store.repository';
import { PrismaStoreRepository } from '../store/repository/prisma/prismaStore.repository';
import { PrismaService } from '../config/prisma/prisma.service';

@Module({
  controllers: [UsersController],
  providers: [
    UserService,
    StoreService,
    {
      provide: StoreRepository,
      useClass: PrismaStoreRepository,
    },
    PrismaService,
  ],
})
export class UserModule {}
