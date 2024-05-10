import { Billboard } from '@prisma/client';
import { NewBillboardDataModel } from '../models/new-billboard.model';

export abstract class BillboardRepository {
  create: (data: NewBillboardDataModel) => Promise<Billboard>;

  getAll: (data: { storeId: string }) => Promise<Billboard[]>;

  delete: (data: { id: string; storeId: string }) => Promise<Billboard>;
}
