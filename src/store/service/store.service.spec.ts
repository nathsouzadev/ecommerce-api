import { Test, TestingModule } from '@nestjs/testing';
import { StoreService } from './store.service';
import { randomUUID } from 'crypto';
import { StoreRepository } from '../repository/store.repository';
import { NotFoundException } from '@nestjs/common';

describe('StoreService', () => {
  let service: StoreService;
  let mockStoreRepository: StoreRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreService,
        {
          provide: StoreRepository,
          useValue: {
            create: jest.fn(),
            get: jest.fn(),
            getByUserId: jest.fn(),
            getAllUserStores: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StoreService>(StoreService);
    mockStoreRepository = module.get<StoreRepository>(StoreRepository);
  });

  it('create a new store', async () => {
    const userId = randomUUID();
    const mockStore = {
      name: 'Store',
      userId,
    };

    jest.spyOn<any, any>(mockStoreRepository, 'create').mockImplementation(() =>
      Promise.resolve({
        ...mockStore,
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    );

    const store = await service.create(mockStore);
    expect(store).toMatchObject({
      ...mockStore,
      id: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('get store by id and userId', async () => {
    const userId = randomUUID();
    const storeId = randomUUID();
    const mockStore = {
      id: storeId,
      name: 'Store',
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    jest
      .spyOn<any, any>(mockStoreRepository, 'get')
      .mockImplementation(() => Promise.resolve(mockStore));

    const store = await service.get(userId, storeId);
    expect(store).toMatchObject(mockStore);
  });

  it('throw error if not found', async () => {
    const userId = randomUUID();
    const storeId = randomUUID();

    jest
      .spyOn<any, any>(mockStoreRepository, 'get')
      .mockImplementation(() => Promise.resolve(null));

    await expect(service.get(userId, storeId)).rejects.toThrow(
      new NotFoundException('Store not found'),
    );
  });

  it('get store by userId', async () => {
    const userId = randomUUID();
    const mockStore = {
      id: randomUUID(),
      name: 'Store',
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    jest
      .spyOn<any, any>(mockStoreRepository, 'getByUserId')
      .mockImplementation(() => Promise.resolve(mockStore));

    const store = await service.getByUserId(userId);
    expect(store).toMatchObject(mockStore);
  });

  it('throw error user does not have store', async () => {
    const userId = randomUUID();

    jest
      .spyOn<any, any>(mockStoreRepository, 'getByUserId')
      .mockImplementation(() => Promise.resolve(null));

    await expect(service.getByUserId(userId)).rejects.toThrow(
      new NotFoundException('Store not found'),
    );
  });

  it('get all user stores', async () => {
    const mockUserId = 'user_2fYgThng9k3ZvaPI7g9fRWOYrWi';
    const mockStores = Array.from({ length: 3 }, (_, index) => ({
      id: randomUUID(),
      name: `Store ${index + 1}`,
      userId: mockUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    jest
      .spyOn<any, any>(mockStoreRepository, 'getAllUserStores')
      .mockImplementation(() => Promise.resolve(mockStores));

    const stores = await service.getAllUserStores(mockUserId);
    expect(stores).toMatchObject(mockStores);
  });

  it('throw error if user does not have stores', async () => {
    const mockUserId = 'user_2fYgThng9k3ZvaPI7g9fRWOYrWi';

    jest
      .spyOn<any, any>(mockStoreRepository, 'getAllUserStores')
      .mockImplementation(() => Promise.resolve([]));

    await expect(service.getAllUserStores(mockUserId)).rejects.toThrow(
      new NotFoundException('Stores not found'),
    );
  });

  it('update store name', async () => {
    const userId = randomUUID();
    const storeId = randomUUID();
    const storeName = 'Store Name';
    const mockStore = {
      id: storeId,
      name: storeName,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    jest
      .spyOn<any, any>(mockStoreRepository, 'get')
      .mockImplementation(() => Promise.resolve(mockStore));

    jest
      .spyOn<any, any>(mockStoreRepository, 'update')
      .mockImplementation(() => Promise.resolve(mockStore));

    const store = await service.update(userId, storeId, storeName);
    expect(store).toMatchObject(mockStore);
  });

  it('throw error if try update stores does not exists', async () => {
    const mockUserId = 'user_2fYgThng9k3ZvaPI7g9fRWOYrWi';
    const mockStoreId = randomUUID();
    const mockStoreName = 'Store Name';

    jest
      .spyOn<any, any>(mockStoreRepository, 'update')
      .mockImplementation(() => Promise.resolve([]));

    await expect(
      service.update(mockUserId, mockStoreId, mockStoreName),
    ).rejects.toThrow(new NotFoundException('Store not found'));
  });
});
