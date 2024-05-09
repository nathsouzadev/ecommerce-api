import { Module } from '@nestjs/common';
import { BillboardService } from './service/billboard.service';
import { BillboardController } from './billboard.controller';
import { StoreService } from '../store/service/store.service';
import { StoreRepository } from '../store/repository/store.repository';
import { PrismaStoreRepository } from '../store/repository/prisma/prismaStore.repository';
import { PrismaService } from '../config/prisma/prisma.service';
import { BillboardRepository } from './repository/billboards.repository';
import { PrismaBillboardRepository } from './repository/prisma/prismaBillboard.repository';

@Module({
  controllers: [BillboardController],
  providers: [
    BillboardService,
    StoreService,
    {
      provide: StoreRepository,
      useClass: PrismaStoreRepository,
    },
    {
      provide: BillboardRepository,
      useClass: PrismaBillboardRepository,
    },
    PrismaService,
  ],
})
export class BillboardModule {}
