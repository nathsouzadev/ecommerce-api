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
});
