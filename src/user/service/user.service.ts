import { Injectable } from '@nestjs/common';
import { StoreService } from '../../store/service/store.service';
import { NewStoreModel } from '../../store/model/new-store.model';
import { Store } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly storeService: StoreService) {}

  createStore = async (newStore: NewStoreModel): Promise<Store> =>
    this.storeService.create(newStore);
}
