import { Injectable } from '@nestjs/common';
import { StoreService } from '../../store/service/store.service';
import { NewStoreModel } from '../../store/model/new-store.model';
import { Store } from '@prisma/client';
import { DeletedStoreModel } from '../../store/model/deleted-store.model';

@Injectable()
export class UserService {
  constructor(private readonly storeService: StoreService) {}

  createStore = async (newStore: NewStoreModel): Promise<Store> =>
    this.storeService.create(newStore);

  getStore = async (userId: string, storeId: string): Promise<Store> =>
    this.storeService.get(userId, storeId);

  getStoreByUserId = async (userId: string): Promise<Store> =>
    this.storeService.getByUserId(userId);

  getAllUserStores = async (userId: string): Promise<Store[]> =>
    this.storeService.getAllUserStores(userId);

  updateStore = async (
    userId: string,
    storeId: string,
    name: string,
  ): Promise<Store> => this.storeService.update(userId, storeId, name);

  deleteStore = async (
    userId: string,
    storeId: string,
  ): Promise<DeletedStoreModel> => this.storeService.delete(userId, storeId);
}
