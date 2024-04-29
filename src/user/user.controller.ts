import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';
import { UserService } from './service/user.service';
import { CreateStoreDto } from '../store/dto/create-store.dto';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { UpdateStoreDto } from '../store/dto/update-store.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UserService) {}

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
  @Post(':userId/store')
  async create(
    @Body() createStoreDto: CreateStoreDto,
    @Param('userId') userId: string,
  ) {
    const store = await this.usersService.createStore({
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
  @Get(':userId/store/:storeId')
  async getStore(
    @Param('userId') userId: string,
    @Param('storeId') storeId: string,
  ) {
    const store = await this.usersService.getStore(userId, storeId);

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
  @Get(':userId/store')
  async getStoreByUser(@Param('userId') userId: string) {
    const store = await this.usersService.getStoreByUserId(userId);

    return { store };
  }

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
  @Get(':userId/stores')
  async getStoresByUser(@Param('userId') userId: string) {
    const stores = await this.usersService.getAllUserStores(userId);

    return { stores };
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
  @Patch(':userId/store/:storeId')
  async updateStore(
    @Body() updateStoreDto: UpdateStoreDto,
    @Param('userId') userId: string,
    @Param('storeId') storeId: string,
  ) {
    const store = await this.usersService.updateStore(
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
  @Delete(':userId/store/:storeId')
  async deleteStore(
    @Param('userId') userId: string,
    @Param('storeId') storeId: string,
  ) {
    const store = await this.usersService.deleteStore(userId, storeId);

    return store;
  }
}
