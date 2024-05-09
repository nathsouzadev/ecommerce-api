import { Billboard } from '@prisma/client';
import { NewBillboardDataModel } from '../models/new-billboard.model';

export abstract class BillboardRepository {
  create: (data: NewBillboardDataModel) => Promise<Billboard>;
}
