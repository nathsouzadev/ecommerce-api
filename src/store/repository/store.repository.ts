import { Store } from '@prisma/client';
import { NewStoreModel } from '../model/new-store.model';

export abstract class StoreRepository {
  create: (newStore: NewStoreModel) => Promise<Store>;

  get: (userId: string, storeId: string) => Promise<Store>;

  getByUserId: (userId: string) => Promise<Store>;

  getAllUserStores: (userId: string) => Promise<Store[]>;

  update: (userId: string, storeId: string, name: string) => Promise<Store>;

  delete: (userId: string, storeId: string) => Promise<Store>;
}
