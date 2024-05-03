import { Module } from '@nestjs/common';
import { StoreService } from './service/store.service';
import { PrismaService } from '../config/prisma/prisma.service';
import { StoreRepository } from './repository/store.repository';
import { PrismaStoreRepository } from './repository/prisma/prismaStore.repository';
import { StoreController } from './controller/store.controller';

@Module({
  controllers: [StoreController],
  providers: [
    StoreService,
    PrismaService,
    {
      provide: StoreRepository,
      useClass: PrismaStoreRepository,
    },
  ],
})
export class StoreModule {}
