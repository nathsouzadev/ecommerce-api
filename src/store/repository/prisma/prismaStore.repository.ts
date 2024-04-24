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
}
