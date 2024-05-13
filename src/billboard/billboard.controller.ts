import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BillboardService } from './service/billboard.service';
import { CreateBillboardDto } from './dto/create-billboard.dto';
import { UpdateBillboardDto } from './dto/update-billboard.dto';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { randomUUID } from 'crypto';

@Controller()
export class BillboardController {
  constructor(private readonly billboardService: BillboardService) {}

  @ApiCreatedResponse({
    description: 'Billboard created',
    schema: {
      example: {
        billboard: {
          id: randomUUID(),
          storeId: randomUUID(),
          label: 'Store 1',
          imageUrl: 'https://example.com/image.jpg',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @Post()
  async create(
    @Body() createBillBoardDto: CreateBillboardDto,
    @Param('userId') userId: string,
    @Param('storeId') storeId: string,
  ) {
    const billboard = await this.billboardService.create({
      ...createBillBoardDto,
      userId,
      storeId,
    });

    return billboard;
  }

  @ApiCreatedResponse({
    description: 'Return all billboards with storeId',
    schema: {
      example: {
        billboards: [
          {
            id: randomUUID(),
            storeId: randomUUID(),
            label: 'Store 1',
            imageUrl: 'https://example.com/image.jpg',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Not found billboards',
    schema: {
      example: {
        statusCode: 404,
        message: 'No billboards found',
      },
    },
  })
  @Get()
  async findAll(
    @Param('userId') userId: string,
    @Param('storeId') storeId: string,
  ) {
    const billboards = await this.billboardService.findAll({ userId, storeId });

    return { billboards };
  }

  @ApiOkResponse({
    description: 'Return all billboards with storeId',
    schema: {
      example: {
        billboard: {
          id: randomUUID(),
          storeId: randomUUID(),
          label: 'Store 1',
          imageUrl: 'https://example.com/image.jpg',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Not found billboards',
    schema: {
      example: {
        statusCode: 404,
        message: 'Record to update not found.',
      },
    },
  })
  @Patch(':id')
  async update(
    @Body() updateBillboardDto: UpdateBillboardDto,
    @Param('userId') userId: string,
    @Param('storeId') storeId: string,
    @Param('id') id: string,
  ) {
    const billboard = await this.billboardService.update({
      ...updateBillboardDto,
      userId,
      storeId,
      id,
    });

    return billboard;
  }

  @ApiCreatedResponse({
    description: 'Return all billboards with storeId',
    schema: {
      example: {
        deleted: {
          billboards: [
            {
              id: randomUUID(),
              storeId: randomUUID(),
              label: 'Store 1',
              imageUrl: 'https://example.com/image.jpg',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Not found billboards',
    schema: {
      example: {
        statusCode: 404,
        message: 'Billboard not found',
      },
    },
  })
  @Delete(':id')
  async delete(
    @Param('userId') userId: string,
    @Param('storeId') storeId: string,
    @Param('id') id: string,
  ) {
    const deleted = await this.billboardService.delete({
      userId,
      storeId,
      id,
    });

    return deleted;
  }

  @ApiOkResponse({
    description: 'Return billboard with storeId',
    schema: {
      example: {
        billboard: {
          id: randomUUID(),
          storeId: randomUUID(),
          label: 'Store 1',
          imageUrl: 'https://example.com/image.jpg',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Not found billboards',
    schema: {
      example: {
        statusCode: 404,
        message: 'Billboard not found',
      },
    },
  })
  @Get(':id')
  async get(
    @Param('userId') userId: string,
    @Param('storeId') storeId: string,
    @Param('id') id: string,
  ) {
    const billboard = await this.billboardService.get({
      userId,
      storeId,
      id,
    });

    return billboard;
  }
}
