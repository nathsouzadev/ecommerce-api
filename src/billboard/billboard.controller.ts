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
  async findAll(@Param('storeId') storeId: string) {
    const billboards = await this.billboardService.findAll(storeId);

    return { billboards };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.billboardService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBillboardDto: UpdateBillboardDto,
  ) {
    return this.billboardService.update(+id, updateBillboardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.billboardService.remove(+id);
  }
}
