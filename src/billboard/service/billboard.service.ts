import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateBillboardDto } from '../dto/create-billboard.dto';
import { UpdateBillboardDto } from '../dto/update-billboard.dto';
import { StoreService } from '../../store/service/store.service';
import { Billboard } from '@prisma/client';
import { BillboardRepository } from '../repository/billboards.repository';

@Injectable()
export class BillboardService {
  constructor(
    private readonly billboardRepository: BillboardRepository,
    private readonly storeService: StoreService,
  ) {}

  create = async (
    data: CreateBillboardDto & {
      userId: string;
      storeId: string;
    },
  ): Promise<{ billboard: Billboard }> => {
    try {
      await this.storeService.get(data.userId, data.storeId);

      const billboard = await this.billboardRepository.create({
        label: data.label,
        imageUrl: data.imageUrl,
        storeId: data.storeId,
      });

      return { billboard };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Unauthorized');
    }
  };

  findAll() {
    return 'This action returns all billboard';
  }

  findOne(id: number) {
    return `This action returns a #${id} billboard`;
  }

  update(id: number, updateBillboardDto: UpdateBillboardDto) {
    return `This action updates a #${id} billboard`;
  }

  remove(id: number) {
    return `This action removes a #${id} billboard`;
  }
}
