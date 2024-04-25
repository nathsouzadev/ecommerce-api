import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { PrismaStoreRepository } from './prismaStore.repository';
import { PrismaService } from '../../../config/prisma/prisma.service';

describe('PrismaStoreRepository', () => {
  let repository: PrismaStoreRepository;
  let mockPrismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaStoreRepository,
        {
          provide: PrismaService,
          useValue: {
            store: {
              create: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<PrismaStoreRepository>(PrismaStoreRepository);
    mockPrismaService = module.get<PrismaService>(PrismaService);
  });

  it('should create store', async () => {
    const mockNewStore = {
      name: 'Store',
      userId: randomUUID(),
    };
    jest
      .spyOn<any, any>(mockPrismaService.store, 'create')
      .mockImplementation(() =>
        Promise.resolve({
          ...mockNewStore,
          id: randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      );

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
  });

  it('should find store by id and userId', async () => {
    const mockStoreId = randomUUID();
    const mockUserId = randomUUID();
    const mockStore = {
      id: mockStoreId,
      name: 'Store',
      userId: mockUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    jest
      .spyOn<any, any>(mockPrismaService.store, 'findFirst')
      .mockImplementation(() => Promise.resolve(mockStore));

    const store = await repository.get(mockUserId, mockStoreId);
    expect(mockPrismaService.store.findFirst).toHaveBeenCalledWith({
      where: {
        id: mockStoreId,
        userId: mockUserId,
      },
    });
    expect(store).toMatchObject(mockStore);
  });
});
