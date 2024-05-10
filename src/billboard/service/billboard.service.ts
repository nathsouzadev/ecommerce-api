import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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

  private validateStore = async (userId: string, storeId: string) =>
    await this.storeService.get(userId, storeId);

  create = async (
    data: CreateBillboardDto & {
      userId: string;
      storeId: string;
    },
  ): Promise<{ billboard: Billboard }> => {
    try {
      await this.validateStore(data.userId, data.storeId);

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

  findAll = async (data: { userId: string; storeId: string }) => {
    const { userId, storeId } = data;
    await this.validateStore(userId, storeId);

    const billboards = await this.billboardRepository.getAll({ storeId });

    if (billboards.length === 0)
      throw new NotFoundException('No billboards found');

    return billboards;
  };

  delete = async (data: { id: string; storeId: string; userId: string }) => {
    try {
      const { id, storeId, userId } = data;

      await this.validateStore(userId, storeId);

      const billboard = await this.billboardRepository.delete({
        id,
        storeId,
      });

      return { deleted: { billboard } };
    } catch (error) {
      throw new NotFoundException('Billboard not found');
    }
  };

  findOne(id: number) {
    return `This action returns a #${id} billboard`;
  }

  update(id: number, updateBillboardDto: UpdateBillboardDto) {
    return `This action updates a #${id} billboard`;
  }
}
