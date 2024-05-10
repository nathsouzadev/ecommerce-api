import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../config/prisma/prisma.service';
import { Billboard } from '@prisma/client';
import { BillboardRepository } from '../billboards.repository';
import { NewBillboardDataModel } from '../../../billboard/models/new-billboard.model';

@Injectable()
export class PrismaBillboardRepository implements BillboardRepository {
  constructor(private readonly prisma: PrismaService) {}

  create = async (data: NewBillboardDataModel): Promise<Billboard> =>
    this.prisma.billboard.create({ data });

  getAll = async (data: { storeId: string }): Promise<Billboard[]> =>
    this.prisma.billboard.findMany({
      where: { storeId: data.storeId },
    });
}
