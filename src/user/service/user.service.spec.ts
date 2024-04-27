import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { StoreService } from '../../store/service/store.service';
import { randomUUID } from 'crypto';

describe('UsersService', () => {
  let service: UserService;
  let mockStoreService: StoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: StoreService,
          useValue: {
            create: jest.fn(),
            get: jest.fn(),
            getByUserId: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    mockStoreService = module.get<StoreService>(StoreService);
  });

  it('should create new store', async () => {
    const userId = randomUUID();
    const mockStore = {
      name: 'Store',
      userId,
    };
    jest.spyOn<any, any>(mockStoreService, 'create').mockImplementation(() =>
      Promise.resolve({
        ...mockStore,
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    );

    const store = await service.createStore(mockStore);
    expect(mockStoreService.create).toHaveBeenCalledWith(mockStore);
    expect(store).toMatchObject({
      ...mockStore,
      id: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('should get store by id', async () => {
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
      .spyOn<any, any>(mockStoreService, 'get')
      .mockImplementation(() => Promise.resolve(mockStore));

    const store = await service.getStore(userId, storeId);
    expect(mockStoreService.get).toHaveBeenCalledWith(userId, storeId);
    expect(store).toMatchObject(mockStore);
  });

  it('should get store by userId', async () => {
    const userId = randomUUID();
    const mockStore = {
      id: randomUUID(),
      name: 'Store',
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    jest
      .spyOn<any, any>(mockStoreService, 'getByUserId')
      .mockImplementation(() => Promise.resolve(mockStore));

    const store = await service.getStoreByUserId(userId);
    expect(mockStoreService.getByUserId).toHaveBeenCalledWith(userId);
    expect(store).toMatchObject(mockStore);
  });
});
