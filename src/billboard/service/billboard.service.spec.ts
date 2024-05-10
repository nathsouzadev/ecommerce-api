import { Test, TestingModule } from '@nestjs/testing';
import { BillboardService } from './billboard.service';
import { BillboardRepository } from '../repository/billboards.repository';
import { StoreService } from '../../store/service/store.service';
import { randomUUID } from 'crypto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('BillboardService', () => {
  let service: BillboardService;
  let mockBillboardRepository: BillboardRepository;
  let mockStoreService: StoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillboardService,
        {
          provide: BillboardRepository,
          useValue: {
            create: jest.fn(),
            getAll: jest.fn(),
          },
        },
        {
          provide: StoreService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BillboardService>(BillboardService);
    mockBillboardRepository =
      module.get<BillboardRepository>(BillboardRepository);
    mockStoreService = module.get<StoreService>(StoreService);
  });

  it('should create a new billboard', async () => {
    const mockUserId = randomUUID();
    const mockStoreId = randomUUID();
    const mockBillboardData = {
      label: 'Billboard',
      imageUrl: 'https://example.com/image.jpg',
      userId: mockUserId,
      storeId: mockStoreId,
    };

    jest.spyOn(mockStoreService, 'get').mockImplementation(() =>
      Promise.resolve({
        id: randomUUID(),
        userId: mockUserId,
        name: 'Store',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );
    jest
      .spyOn<any, any>(mockBillboardRepository, 'create')
      .mockImplementation(() =>
        Promise.resolve({
          id: randomUUID(),
          label: 'Billboard',
          imageUrl: 'https://example.com/image.jpg',
          storeId: mockStoreId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      );

    const billboard = await service.create(mockBillboardData);
    expect(mockStoreService.get).toHaveBeenCalledWith(mockUserId, mockStoreId);
    expect(mockBillboardRepository.create).toHaveBeenCalledWith({
      label: 'Billboard',
      imageUrl: 'https://example.com/image.jpg',
      storeId: mockStoreId,
    });
    expect(billboard).toMatchObject({
      billboard: {
        id: expect.any(String),
        label: 'Billboard',
        imageUrl: 'https://example.com/image.jpg',
        storeId: mockStoreId,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    });
  });

  it('throw error if try create billboard with store does not exists', async () => {
    const mockUserId = randomUUID();
    const mockStoreId = randomUUID();
    const mockBillboardData = {
      label: 'Billboard',
      imageUrl: 'https://example.com/image.jpg',
      userId: mockUserId,
      storeId: mockStoreId,
    };

    jest
      .spyOn(mockStoreService, 'get')
      .mockImplementation(() =>
        Promise.reject(new NotFoundException('Store not found')),
      );

    await expect(service.create(mockBillboardData)).rejects.toThrow(
      new UnauthorizedException('Unauthorized'),
    );
  });

  it('should get all billboards with storeId', async () => {
    const mockStoreId = randomUUID();
    const getMockBillboard = (label: string, storeId: string) => ({
      id: randomUUID(),
      label,
      imageUrl: 'https://example.com/image.jpg',
      storeId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const expectedBillboards = [
      getMockBillboard('Test Billboard', mockStoreId),
      getMockBillboard('Test Billboard 3', mockStoreId),
    ];
    jest
      .spyOn<any, any>(mockBillboardRepository, 'getAll')
      .mockImplementation(() => Promise.resolve(expectedBillboards));

    const billboards = await service.findAll(mockStoreId);
    expect(mockBillboardRepository.getAll).toHaveBeenCalledWith({
      storeId: mockStoreId,
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

  it('throw error if no billboards found', async () => {
    const mockStoreId = randomUUID();
    jest
      .spyOn<any, any>(mockBillboardRepository, 'getAll')
      .mockImplementation(() => Promise.resolve([]));

    await expect(service.findAll(mockStoreId)).rejects.toThrow(
      new NotFoundException('No billboards found'),
    );
  });
});
