import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { PrismaService } from '../config/prisma/prisma.service';

@ApiTags('health')
@Controller()
export class HealthController {
  constructor(
    private readonly healtCheckService: HealthCheckService,
    private readonly prisma: PrismaService,
  ) {}

  @ApiOkResponse({ description: 'Service information' })
  @Get()
  @HealthCheck()
  async health() {
    return this.healtCheckService.check([() => this.prismaHealth()]);
  }

  async prismaHealth(): Promise<HealthIndicatorResult> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        db: { status: 'up' },
      };
    } catch (error) {
      return {
        db: {
          status: 'down',
          error: error.message,
        },
      };
    }
  }
}
