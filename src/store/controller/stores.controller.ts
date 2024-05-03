import { Controller, Param, Get } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { StoreService } from '../service/store.service';

@Controller()
export class StoresController {
  constructor(private readonly storeService: StoreService) {}

  @ApiOkResponse({
    description: 'Get all stores of with userId',
    schema: {
      example: {
        stores: Array.from({ length: 3 }, (_, index) => ({
          id: randomUUID(),
          name: `Store ${index + 1}`,
          userId: 'user_2fYgThng9k3ZvaPI7g9fRWOYrWi',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })),
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Store not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Store not found',
      },
    },
  })
  @Get()
  async getStoresByUser(@Param('userId') userId: string) {
    console.log('HERE');
    const stores = await this.storeService.getAllUserStores(userId);

    return { stores };
  }
}
