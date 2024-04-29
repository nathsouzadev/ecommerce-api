import { Store } from '@prisma/client';

export interface DeletedStoreModel {
  deleted: {
    store: Store;
  };
}
