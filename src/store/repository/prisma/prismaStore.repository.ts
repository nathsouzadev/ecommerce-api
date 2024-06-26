import { Injectable } from '@nestjs/common';
import { StoreRepository } from '../store.repository';
import { PrismaService } from '../../../config/prisma/prisma.service';
import { NewStoreModel } from '../../../store/model/new-store.model';
import { Store } from '@prisma/client';

@Injectable()
export class PrismaStoreRepository implements StoreRepository {
  constructor(private readonly prisma: PrismaService) {}

  create = async (newStore: NewStoreModel): Promise<Store> =>
    this.prisma.store.create({ data: newStore });

  get = async (userId: string, storeId: string): Promise<Store> =>
    this.prisma.store.findFirst({ where: { id: storeId, userId } });

  getByUserId = async (userId: string): Promise<Store> =>
    this.prisma.store.findFirst({ where: { userId } });

  getAllUserStores = async (userId: string): Promise<Store[]> => {
    return this.prisma.store.findMany({ where: { userId } });
  };

  update = async (
    userId: string,
    storeId: string,
    name: string,
  ): Promise<Store> =>
    this.prisma.store.update({
      where: {
        id: storeId,
        userId,
      },
      data: { name },
    });

  delete = async (userId: string, storeId: string): Promise<Store> =>
    this.prisma.store.delete({ where: { id: storeId, userId } });
}
