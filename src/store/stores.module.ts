import { Module } from '@nestjs/common';
import { StoreService } from './service/store.service';
import { PrismaService } from '../config/prisma/prisma.service';
import { StoreRepository } from './repository/store.repository';
import { PrismaStoreRepository } from './repository/prisma/prismaStore.repository';
import { StoresController } from './controller/stores.controller';

@Module({
  controllers: [StoresController],
  providers: [
    StoreService,
    PrismaService,
    {
      provide: StoreRepository,
      useClass: PrismaStoreRepository,
    },
  ],
})
export class StoresModule {}
