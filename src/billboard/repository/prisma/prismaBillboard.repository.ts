import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../config/prisma/prisma.service';
import { Billboard } from '@prisma/client';
import { BillboardRepository } from '../billboards.repository';
import { NewBillboardDataModel } from '../../../billboard/models/new-billboard.model';
import { UpdateBillboardModel } from '../../../billboard/models/update-billboard.model';

@Injectable()
export class PrismaBillboardRepository implements BillboardRepository {
  constructor(private readonly prisma: PrismaService) {}

  create = async (data: NewBillboardDataModel): Promise<Billboard> =>
    this.prisma.billboard.create({ data });

  getAll = async (data: { storeId: string }): Promise<Billboard[]> =>
    this.prisma.billboard.findMany({
      where: { storeId: data.storeId },
    });

  delete = (data: { id: string; storeId: string }): Promise<Billboard> =>
    this.prisma.billboard.delete({ where: data });

  update = async (data: UpdateBillboardModel): Promise<Billboard> => {
    const { id, storeId, ...rest } = data;
    return this.prisma.billboard.update({ where: { id, storeId }, data: rest });
  };
}
