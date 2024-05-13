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

  it('should get all billboards with storeId', async () => {
    const mockStoreId = randomUUID();
    const getMockBillboard = (label: string, storeId: string) => ({
      label,
      imageUrl: 'https://example.com/image.jpg',
      storeId,
    });

    const expectedBillboards = [
      getMockBillboard('Test Billboard', mockStoreId),
      getMockBillboard('Test Billboard 3', mockStoreId),
    ];
    for (const billboard of [
      ...expectedBillboards,
      getMockBillboard('Test Billboard 2', randomUUID()),
    ]) {
      mockPrismaService.billboard.create({ data: billboard });
    }

    jest.spyOn<any, any>(mockPrismaService.billboard, 'findMany');

    const billboards = await repository.getAll({ storeId: mockStoreId });
    expect(mockPrismaService.billboard.findMany).toHaveBeenCalledWith({
      where: { storeId: mockStoreId },
    });
    expect(billboards).toHaveLength(2);
    expect(billboards).toMatchObject(
      expectedBillboards.map((billboard) => ({
        ...billboard,
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })),
    );
  });

  it('should be delete billboard with id and storeId', async () => {
    const mockStoreId = randomUUID();
    const mockBillboardId = randomUUID();
    mockPrismaService.billboard.create({
      data: {
        id: mockBillboardId,
        label: 'Test Billboard',
        imageUrl: 'https://example.com/image.jpg',
        storeId: mockStoreId,
      },
    });
    console.log(mockBillboardId);
    console.log(mockPrismaService['db']);

    jest.spyOn<any, any>(mockPrismaService.billboard, 'delete');

    await repository.delete({ id: mockBillboardId, storeId: mockStoreId });
    expect(mockPrismaService.billboard.delete).toHaveBeenCalledWith({
      where: { id: mockBillboardId, storeId: mockStoreId },
    });
    expect(mockPrismaService['db']).toHaveLength(0);
  });

  it('should be update billboard with id and storeId', async () => {
    const mockStoreId = randomUUID();
    const mockBillboardId = randomUUID();
    mockPrismaService.billboard.create({
      data: {
        id: mockBillboardId,
        label: 'Test Billboard',
        imageUrl: 'https://example.com/image.jpg',
        storeId: mockStoreId,
      },
    });

    const updateBillboard = {
      label: 'Test Billboard Updated',
      imageUrl: 'https://example.com/image-updated.jpg',
    };
    jest.spyOn<any, any>(mockPrismaService.billboard, 'update');

    const billboard = await repository.update({
      id: mockBillboardId,
      storeId: mockStoreId,
      ...updateBillboard,
    });
    expect(mockPrismaService.billboard.update).toHaveBeenCalledWith({
      where: { id: mockBillboardId, storeId: mockStoreId },
      data: updateBillboard,
    });
    expect(billboard).toMatchObject({
      ...updateBillboard,
      id: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('should get billboard with id and storeId', async () => {
    const mockStoreId = randomUUID();
    const mockBillboardId = randomUUID();
    const mockBillboard = {
      id: mockBillboardId,
      label: 'Test Billboard',
      imageUrl: 'https://example.com/image.jpg',
      storeId: mockStoreId,
    };
    mockPrismaService.billboard.create({ data: mockBillboard });

    jest.spyOn<any, any>(mockPrismaService.billboard, 'findUnique');

    const billboard = await repository.get({
      id: mockBillboardId,
      storeId: mockStoreId,
    });
    expect(mockPrismaService.billboard.findUnique).toHaveBeenCalledWith({
      where: { id: mockBillboardId, storeId: mockStoreId },
    });
    expect(billboard).toMatchObject({
      ...mockBillboard,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });
});
