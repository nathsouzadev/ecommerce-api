import { Injectable, NotFoundException } from '@nestjs/common';
import { NewStoreModel } from '../model/new-store.model';
import { StoreRepository } from '../repository/store.repository';
import { Store } from '@prisma/client';

@Injectable()
export class StoreService {
  constructor(private readonly storeRepository: StoreRepository) {}
  create = async (newStore: NewStoreModel): Promise<Store> =>
    this.storeRepository.create(newStore);

  get = async (userId: string, storeId: string): Promise<Store> => {
    const store = await this.storeRepository.get(userId, storeId);

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    return store;
  };
}
