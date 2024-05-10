import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { randomUUID } from 'crypto';
import prismadb from './prisma';

describe('BillboardController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('create billboard', async () => {
    const userId = randomUUID();
    const storeId = randomUUID();

    await prismadb.store.create({
      data: {
        id: storeId,
        userId,
        name: 'store',
      },
    });

    return request(app.getHttpServer())
      .post(`/api/user/${userId}/store/${storeId}/billboard`)
      .send({
        label: 'store1',
        imageUrl: 'https://example.com/image.jpg',
      })
      .expect(201)
      .then(async (response) => {
        expect(response.body).toMatchObject({
          billboard: {
            id: expect.any(String),
            label: 'store1',
            imageUrl: 'https://example.com/image.jpg',
            storeId,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        });

        await prismadb.billboard.delete({
          where: {
            id: response.body.billboard.id,
          },
        });

        await prismadb.store.delete({
          where: {
            id: storeId,
          },
        });
      });
  });

  it('return a error if try create billboard with store does not exists', async () => {
    const userId = randomUUID();
    const storeId = randomUUID();
    return request(app.getHttpServer())
      .post(`/api/user/${userId}/store/${storeId}/billboard`)
      .send({
        label: 'store1',
        imageUrl: 'https://example.com/image.jpg',
      })
      .expect(401)
      .then(async (response) => {
        expect(response.body).toMatchObject({
          statusCode: 401,
          message: 'Unauthorized',
        });
      });
  });

  it('return a error if try create billboard with store does not have same userId', async () => {
    const userId = randomUUID();
    const storeId = randomUUID();

    await prismadb.store.create({
      data: {
        id: storeId,
        userId: randomUUID(),
        name: 'store',
      },
    });

    return request(app.getHttpServer())
      .post(`/api/user/${userId}/store/${storeId}/billboard`)
      .send({
        label: 'store1',
        imageUrl: 'https://example.com/image.jpg',
      })
      .expect(401)
      .then(async (response) => {
        expect(response.body).toMatchObject({
          statusCode: 401,
          message: 'Unauthorized',
        });

        await prismadb.store.delete({
          where: {
            id: storeId,
          },
        });
      });
  });

  it('get all billboards with storeId', async () => {
    const userId = randomUUID();
    const storeId = randomUUID();

    await prismadb.store.create({
      data: {
        id: storeId,
        userId,
        name: 'store',
      },
    });

    await prismadb.billboard.create({
      data: {
        label: 'store1',
        imageUrl: 'https://example.com/image.jpg',
        storeId,
      },
    });

    await prismadb.billboard.create({
      data: {
        label: 'store2',
        imageUrl: 'https://example.com/image.jpg',
        storeId,
      },
    });

    return request(app.getHttpServer())
      .get(`/api/user/${userId}/store/${storeId}/billboard`)
      .expect(200)
      .then(async (response) => {
        expect(response.body).toMatchObject({
          billboards: [
            {
              id: expect.any(String),
              label: 'store1',
              imageUrl: 'https://example.com/image.jpg',
              storeId,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
            {
              id: expect.any(String),
              label: 'store2',
              imageUrl: 'https://example.com/image.jpg',
              storeId,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
          ],
        });

        await prismadb.billboard.deleteMany({
          where: {
            storeId,
          },
        });
      });
  });

  it('return a error if try get billboards with storeId does not exists', async () => {
    const userId = randomUUID();
    const storeId = randomUUID();
    return request(app.getHttpServer())
      .get(`/api/user/${userId}/store/${storeId}/billboard`)
      .expect(404)
      .then(async (response) => {
        expect(response.body).toMatchObject({
          statusCode: 404,
          message: 'No billboards found',
        });
      });
  });
});
