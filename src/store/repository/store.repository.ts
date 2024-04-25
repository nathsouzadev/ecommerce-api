import { Store } from '@prisma/client';
import { NewStoreModel } from '../model/new-store.model';

export abstract class StoreRepository {
  create: (newStore: NewStoreModel) => Promise<Store>;

  get: (userId: string, storeId: string) => Promise<Store>;
}
