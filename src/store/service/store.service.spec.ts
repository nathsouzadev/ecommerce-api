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

    const store = await service.get(storeId, userId);
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
});
