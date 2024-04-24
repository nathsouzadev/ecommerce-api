import { Controller, Post, Body, Param } from '@nestjs/common';
import { UserService } from './service/user.service';
import { CreateStoreDto } from '../store/dto/create-store.dto';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { randomUUID } from 'crypto';

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
}
