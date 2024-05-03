import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { PrismaStoreRepository } from './prismaStore.repository';
import { PrismaService } from '../../../config/prisma/prisma.service';
import { MockPrismaService } from '../../../__mocks__/prismaService.mock';

describe('PrismaStoreRepository', () => {
  let repository: PrismaStoreRepository;
  let mockPrismaService: PrismaService = new MockPrismaService() as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaStoreRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<PrismaStoreRepository>(PrismaStoreRepository);
    mockPrismaService = module.get<PrismaService>(PrismaService);
    mockPrismaService['reset']();
  });

  it('should create store', async () => {
    const mockNewStore = {
      name: 'Store',
      userId: randomUUID(),
    };
    jest.spyOn<any, any>(mockPrismaService.store, 'create');

    const store = await repository.create(mockNewStore);
    expect(mockPrismaService.store.create).toHaveBeenCalledWith({
      data: mockNewStore,
    });
    expect(store).toMatchObject({
      ...mockNewStore,
      id: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
    expect(mockPrismaService['db']).toHaveLength(1);
  });

  it('should find store by id and userId', async () => {
    const mockStoreId = randomUUID();
    const mockUserId = randomUUID();
    const mockStore = {
      id: mockStoreId,
      name: 'Store',
      userId: mockUserId,
    };
    mockPrismaService.store.create({ data: mockStore });

    jest.spyOn<any, any>(mockPrismaService.store, 'findFirst');

    const store = await repository.get(mockUserId, mockStoreId);
    expect(mockPrismaService.store.findFirst).toHaveBeenCalledWith({
      where: {
        id: mockStoreId,
        userId: mockUserId,
      },
    });
    expect(store).toMatchObject({
      ...mockStore,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('should find store by userId', async () => {
    const mockUserId = randomUUID();
    const mockStore = {
      id: randomUUID(),
      name: 'Store',
      userId: mockUserId,
    };
    mockPrismaService.store.create({ data: mockStore });
    mockPrismaService.store.create({
      data: { ...mockStore, userId: randomUUID() },
    });

    jest.spyOn<any, any>(mockPrismaService.store, 'findFirst');

    const store = await repository.getByUserId(mockUserId);
    expect(mockPrismaService.store.findFirst).toHaveBeenCalledWith({
      where: {
        userId: mockUserId,
      },
    });
    expect(store).toMatchObject(mockStore);
  });

  it('should find all stores by userId', async () => {
    const mockUserId = 'user_2fYgThng9k3ZvaPI7g9fRWOYrWi';
    const mockStores = Array.from({ length: 3 }, (_, index) => ({
      id: randomUUID(),
      name: `Store ${index + 1}`,
      userId: mockUserId,
    }));
    mockStores.forEach((store) =>
      mockPrismaService.store.create({ data: store }),
    );

    jest.spyOn<any, any>(mockPrismaService.store, 'findMany');

    const stores = await repository.getAllUserStores(mockUserId);
    expect(mockPrismaService.store.findMany).toHaveBeenCalledWith({
      where: {
        userId: mockUserId,
      },
    });
    expect(stores).toMatchObject(
      mockStores.map((store) => ({
        ...store,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })),
    );
  });

  it('should update store by id and userId', async () => {
    const mockStoreId = randomUUID();
    const mockUserId = randomUUID();
    const mockNewStoreName = 'New Store Name';
    const mockStore = {
      id: mockStoreId,
      name: mockNewStoreName,
      userId: mockUserId,
    };
    mockPrismaService.store.create({ data: mockStore });

    jest.spyOn<any, any>(mockPrismaService.store, 'update');

    const store = await repository.update(
      mockUserId,
      mockStoreId,
      mockNewStoreName,
    );
    expect(mockPrismaService.store.update).toHaveBeenCalledWith({
      where: {
        id: mockStoreId,
        userId: mockUserId,
      },
      data: {
        name: mockNewStoreName,
      },
    });
    expect(store).toMatchObject(mockStore);
  });

  it('should delete store', async () => {
    const mockStoreId = randomUUID();
    const mockUserId = randomUUID();
    const mockStore = {
      id: mockStoreId,
      name: 'Store name',
      userId: mockUserId,
    };
    mockPrismaService.store.create({ data: mockStore });

    jest.spyOn<any, any>(mockPrismaService.store, 'delete');

    const store = await repository.delete(mockUserId, mockStoreId);
    expect(mockPrismaService.store.delete).toHaveBeenCalledWith({
      where: {
        id: mockStoreId,
        userId: mockUserId,
      },
    });
    expect(store).toMatchObject(mockStore);
    expect(mockPrismaService['db']).toHaveLength(0);
  });
});
