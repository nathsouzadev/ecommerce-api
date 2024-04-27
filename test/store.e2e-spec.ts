import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { randomUUID } from 'crypto';
import prismadb from './prisma';

describe('StoreController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('create store', async () => {
    const userId = randomUUID();
    return request(app.getHttpServer())
      .post(`/api/user/${userId}/store`)
      .send({ name: 'store1' })
      .expect(201)
      .then(async (response) => {
        expect(response.body).toMatchObject({
          store: {
            id: expect.any(String),
            name: 'store1',
            userId,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        });

        await prismadb.store.delete({
          where: {
            id: response.body.store.id,
          },
        });
      });
  });

  it('get store', async () => {
    const userId = randomUUID();
    const store = await prismadb.store.create({
      data: {
        id: randomUUID(),
        name: 'store',
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return request(app.getHttpServer())
      .get(`/api/user/${userId}/store/${store.id}`)
      .expect(200)
      .then(async (response) => {
        expect(response.body).toMatchObject({
          store: {
            id: store.id,
            name: 'store',
            userId,
            createdAt: store.createdAt.toISOString(),
            updatedAt: store.updatedAt.toISOString(),
          },
        });

        await prismadb.store.delete({
          where: {
            id: store.id,
          },
        });
      });
  });

  it('return 404 if store not found', async () => {
    const userId = randomUUID();
    return request(app.getHttpServer())
      .get(`/api/user/${userId}/store/${randomUUID()}`)
      .expect(404)
      .then(async (response) => {
        expect(response.body).toMatchObject({
          statusCode: 404,
          message: 'Store not found',
        });
      });
  });

  it('get store by userId', async () => {
    const userId = randomUUID();
    const store = await prismadb.store.create({
      data: {
        id: randomUUID(),
        name: 'store',
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return request(app.getHttpServer())
      .get(`/api/user/${userId}/store`)
      .expect(200)
      .then(async (response) => {
        expect(response.body).toMatchObject({
          store: {
            id: store.id,
            name: 'store',
            userId,
            createdAt: store.createdAt.toISOString(),
            updatedAt: store.updatedAt.toISOString(),
          },
        });

        await prismadb.store.delete({
          where: {
            id: store.id,
          },
        });
      });
  });

  it('return 404 if store not found by userId', async () => {
    const userId = randomUUID();
    return request(app.getHttpServer())
      .get(`/api/user/${userId}/store`)
      .expect(404)
      .then(async (response) => {
        expect(response.body).toMatchObject({
          statusCode: 404,
          message: 'Store not found',
        });
      });
  });

  it('should return all stores with userId', async () => {
    const mockUserId = 'user_5fYgThng9k3ZvaPI7g9fRWOYrWi';
    const mockStores = Array.from({ length: 3 }, (_, index) => ({
      id: randomUUID(),
      name: `Store ${index + 1}`,
      userId: mockUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    for (const store of mockStores) {
      await prismadb.store.create({
        data: store,
      });
    }

    const mockStoreIds = mockStores.map((store) => store.id);

    return request(app.getHttpServer())
      .get(`/api/user/${mockUserId}/stores`)
      .expect(200)
      .then(async (response) => {
        expect(response.body).toMatchObject({
          stores: mockStores,
        });

        await prismadb.store.deleteMany({
          where: {
            id: {
              in: mockStoreIds,
            },
          },
        });
      });
  });

  it('should return 404 if user does not have store', async () => {
    const userId = randomUUID();
    return request(app.getHttpServer())
      .get(`/api/user/${userId}/stores`)
      .expect(404)
      .then(async (response) => {
        expect(response.body).toMatchObject({
          statusCode: 404,
          message: 'Stores not found',
        });
      });
  });
});
