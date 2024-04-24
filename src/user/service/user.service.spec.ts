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
});
