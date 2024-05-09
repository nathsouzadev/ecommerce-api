import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { PrismaBillboardRepository } from './prismaBillboard.repository';
import { PrismaService } from '../../../config/prisma/prisma.service';
import { MockPrismaService } from '../../../__mocks__/prismaService.mock';

describe('PrismaBillboardRepository', () => {
  let repository: PrismaBillboardRepository;
  let mockPrismaService: PrismaService = new MockPrismaService() as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaBillboardRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<PrismaBillboardRepository>(
      PrismaBillboardRepository,
    );
    mockPrismaService = module.get<PrismaService>(PrismaService);
    mockPrismaService['reset']();
  });

  it('should create billboard', async () => {
    const mockBillboard = {
      label: 'Test Billboard',
      imageUrl: 'https://example.com/image.jpg',
      storeId: randomUUID(),
    };
    jest.spyOn<any, any>(mockPrismaService.billboard, 'create');

    const billboard = await repository.create(mockBillboard);
    expect(mockPrismaService.billboard.create).toHaveBeenCalledWith({
      data: mockBillboard,
    });
    expect(billboard).toMatchObject({
      ...mockBillboard,
      id: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
    expect(mockPrismaService['db']).toHaveLength(1);
  });
});
