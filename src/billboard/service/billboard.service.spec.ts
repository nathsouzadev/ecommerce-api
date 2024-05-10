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
            delete: jest.fn(),
            update: jest.fn(),
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
    const mockUserId = randomUUID();
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
    jest.spyOn(mockStoreService, 'get').mockImplementation(() =>
      Promise.resolve({
        id: mockUserId,
        userId: mockUserId,
        name: 'Store',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );
    jest
      .spyOn<any, any>(mockBillboardRepository, 'getAll')
      .mockImplementation(() => Promise.resolve(expectedBillboards));

    const billboards = await service.findAll({
      userId: mockUserId,
      storeId: mockStoreId,
    });
    expect(mockStoreService.get).toHaveBeenCalledWith(mockUserId, mockStoreId);
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
    const mockUserId = randomUUID();
    const mockStoreId = randomUUID();

    jest
      .spyOn<any, any>(mockBillboardRepository, 'getAll')
      .mockImplementation(() => Promise.resolve([]));

    await expect(
      service.findAll({
        userId: mockUserId,
        storeId: mockStoreId,
      }),
    ).rejects.toThrow(new NotFoundException('No billboards found'));
    expect(mockStoreService.get).toHaveBeenCalledWith(mockUserId, mockStoreId);
    expect(mockBillboardRepository.getAll).toHaveBeenCalledWith({
      storeId: mockStoreId,
    });
  });

  it('throw error if try get billboards with storeId does not exists', async () => {
    const mockUserId = randomUUID();
    const mockStoreId = randomUUID();

    jest
      .spyOn(mockStoreService, 'get')
      .mockImplementation(() =>
        Promise.reject(new NotFoundException('Store not found')),
      );

    await expect(
      service.findAll({
        userId: mockUserId,
        storeId: mockStoreId,
      }),
    ).rejects.toThrow(new NotFoundException('Store not found'));
  });

  it('should delete billboard', async () => {
    const mockUserId = randomUUID();
    const mockStoreId = randomUUID();
    const mockBillboardId = randomUUID();

    jest.spyOn(mockStoreService, 'get').mockImplementation(() =>
      Promise.resolve({
        id: mockStoreId,
        userId: mockUserId,
        name: 'Store',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );
    jest
      .spyOn<any, any>(mockBillboardRepository, 'delete')
      .mockImplementation(() =>
        Promise.resolve({
          id: mockBillboardId,
          storeId: mockStoreId,
          label: 'Billboard',
          imageUrl: 'https://example.com/image.jpg',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      );

    const response = await service.delete({
      id: mockBillboardId,
      storeId: mockStoreId,
      userId: mockUserId,
    });
    expect(mockStoreService.get).toHaveBeenCalledWith(mockUserId, mockStoreId);
    expect(mockBillboardRepository.delete).toHaveBeenCalledWith({
      id: mockBillboardId,
      storeId: mockStoreId,
    });
    expect(response).toMatchObject({
      deleted: {
        billboard: {
          id: mockBillboardId,
          label: 'Billboard',
          imageUrl: 'https://example.com/image.jpg',
          storeId: mockStoreId,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      },
    });
  });

  it('throw error if try delete billboard with store does not exists', async () => {
    const mockUserId = randomUUID();
    const mockStoreId = randomUUID();
    const mockBillboardId = randomUUID();

    jest
      .spyOn(mockStoreService, 'get')
      .mockImplementation(() =>
        Promise.reject(new NotFoundException('Store not found')),
      );

    await expect(
      service.delete({
        id: mockBillboardId,
        storeId: mockStoreId,
        userId: mockUserId,
      }),
    ).rejects.toThrow(new NotFoundException('Billboard not found'));
  });

  it('should update billboard', async () => {
    const mockUserId = randomUUID();
    const mockStoreId = randomUUID();
    const mockBillboardId = randomUUID();
    const mockUpdateBillboard = {
      label: 'Billboard Updated',
      imageUrl: 'https://example.com/image-updated.jpg',
    };

    jest.spyOn(mockStoreService, 'get').mockImplementation(() =>
      Promise.resolve({
        id: mockStoreId,
        userId: mockUserId,
        name: 'Store',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );
    jest
      .spyOn<any, any>(mockBillboardRepository, 'update')
      .mockImplementation(() =>
        Promise.resolve({
          id: mockBillboardId,
          label: 'Billboard Updated',
          imageUrl: 'https://example.com/image-updated.jpg',
          storeId: mockStoreId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      );

    const billboard = await service.update({
      id: mockBillboardId,
      storeId: mockStoreId,
      userId: mockUserId,
      ...mockUpdateBillboard,
    });
    expect(mockStoreService.get).toHaveBeenCalledWith(mockUserId, mockStoreId);
    expect(mockBillboardRepository.update).toHaveBeenCalledWith({
      id: mockBillboardId,
      storeId: mockStoreId,
      ...mockUpdateBillboard,
    });
    expect(billboard).toMatchObject({
      billboard: {
        id: mockBillboardId,
        label: 'Billboard Updated',
        imageUrl: 'https://example.com/image-updated.jpg',
        storeId: mockStoreId,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    });
  });

  it('throw error if try update billboard with store does not exists', async () => {
    const mockUserId = randomUUID();
    const mockStoreId = randomUUID();
    const mockBillboardId = randomUUID();
    const mockUpdateBillboard = {
      label: 'Billboard Updated',
      imageUrl: 'https://example.com/image-updated.jpg',
    };

    jest
      .spyOn(mockStoreService, 'get')
      .mockImplementation(() =>
        Promise.reject(new NotFoundException('Store not found')),
      );

    await expect(
      service.update({
        id: mockBillboardId,
        storeId: mockStoreId,
        userId: mockUserId,
        ...mockUpdateBillboard,
      }),
    ).rejects.toThrow(new NotFoundException('Store not found'));
    expect(mockStoreService.get).toHaveBeenCalledWith(mockUserId, mockStoreId);
    expect(mockBillboardRepository.update).not.toHaveBeenCalled();
  });

  it('throw error if try update billboard fail', async () => {
    const mockUserId = randomUUID();
    const mockStoreId = randomUUID();
    const mockBillboardId = randomUUID();
    const mockUpdateBillboard = {
      label: 'Billboard Updated',
      imageUrl: 'https://example.com/image-updated.jpg',
    };

    jest.spyOn(mockStoreService, 'get').mockImplementation(() =>
      Promise.resolve({
        id: mockStoreId,
        userId: mockUserId,
        name: 'Store',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );
    jest
      .spyOn<any, any>(mockBillboardRepository, 'update')
      .mockImplementation(() =>
        Promise.reject({
          clientVersion: '5.13.0',
          code: 'P2025',
          meta: {
            modelName: 'Billboard',
            cause: 'Record to update not found.',
          },
          name: 'PrismaClientKnownRequestError',
        }),
      );

    await expect(
      service.update({
        id: mockBillboardId,
        storeId: mockStoreId,
        userId: mockUserId,
        ...mockUpdateBillboard,
      }),
    ).rejects.toThrow(new Error('Record to update not found.'));
    expect(mockStoreService.get).toHaveBeenCalledWith(mockUserId, mockStoreId);
    expect(mockBillboardRepository.update).toHaveBeenCalledWith({
      id: mockBillboardId,
      storeId: mockStoreId,
      ...mockUpdateBillboard,
    });
  });
});
