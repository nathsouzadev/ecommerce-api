import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoreService } from './service/store.service';

@Controller()
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @ApiCreatedResponse({
    description: 'Store created',
    schema: {
      example: {
        strore: {
          id: randomUUID(),
          name: 'Store Name',
          userId: randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    },
  })
  @Post()
  async create(
    @Body() createStoreDto: CreateStoreDto,
    @Param('userId') userId: string,
  ) {
    const store = await this.storeService.create({
      ...createStoreDto,
      userId,
    });
    return { store };
  }

  @ApiOkResponse({
    description: 'Store found',
    schema: {
      example: {
        store: {
          id: randomUUID(),
          name: 'Store Name',
          userId: randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
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
  @Get(':storeId')
  async getStore(
    @Param('userId') userId: string,
    @Param('storeId') storeId: string,
  ) {
    const store = await this.storeService.get(userId, storeId);

    return { store };
  }

  @ApiOkResponse({
    description: 'Store found',
    schema: {
      example: {
        store: {
          id: randomUUID(),
          name: 'Store Name',
          userId: randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
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
  async getStoreByUser(@Param('userId') userId: string) {
    const store = await this.storeService.getByUserId(userId);

    return { store };
  }

  @ApiOkResponse({
    description: 'Return store updated',
    schema: {
      example: {
        store: {
          id: randomUUID(),
          name: 'Store Name Updated',
          userId: randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
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
  @Patch(':storeId')
  async updateStore(
    @Body() updateStoreDto: UpdateStoreDto,
    @Param('userId') userId: string,
    @Param('storeId') storeId: string,
  ) {
    const store = await this.storeService.update(
      userId,
      storeId,
      updateStoreDto.name,
    );

    return { store };
  }

  @ApiOkResponse({
    description: 'Return store deleted',
    schema: {
      example: {
        deleted: {
          store: {
            id: randomUUID(),
            name: 'Store Name',
            userId: randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
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
  @Delete(':storeId')
  async deleteStore(
    @Param('userId') userId: string,
    @Param('storeId') storeId: string,
  ) {
    const store = await this.storeService.delete(userId, storeId);

    return store;
  }
}
