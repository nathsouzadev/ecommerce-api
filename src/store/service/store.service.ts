import { Injectable, NotFoundException } from '@nestjs/common';
import { NewStoreModel } from '../model/new-store.model';
import { StoreRepository } from '../repository/store.repository';
import { Store } from '@prisma/client';
import { DeletedStoreModel } from '../model/deleted-store.model';

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

  getByUserId = async (userId: string): Promise<Store> => {
    const store = await this.storeRepository.getByUserId(userId);

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    return store;
  };

  getAllUserStores = async (userId: string): Promise<Store[]> => {
    const stores = await this.storeRepository.getAllUserStores(userId);

    if (stores.length === 0) {
      throw new NotFoundException('Stores not found');
    }

    return stores;
  };

  update = async (
    userId: string,
    storeId: string,
    name: string,
  ): Promise<Store> => {
    const store = await this.storeRepository.get(userId, storeId);

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    return this.storeRepository.update(userId, storeId, name);
  };

  delete = async (
    userId: string,
    storeId: string,
  ): Promise<DeletedStoreModel> => {
    try {
      const store = await this.storeRepository.delete(userId, storeId);
      return { deleted: { store } };
    } catch (error) {
      console.log(error);
      throw new NotFoundException(error.meta.cause);
    }
  };
}
