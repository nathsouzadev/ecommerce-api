import { Injectable } from '@nestjs/common';
import { NewStoreModel } from '../model/new-store.model';
import { StoreRepository } from '../repository/store.repository';
import { Store } from '@prisma/client';

@Injectable()
export class StoreService {
  constructor(private readonly storeRepository: StoreRepository) {}
  create = async (newStore: NewStoreModel): Promise<Store> =>
    this.storeRepository.create(newStore);
}
