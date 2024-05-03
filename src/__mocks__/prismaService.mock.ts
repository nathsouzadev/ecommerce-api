import { Store } from '@prisma/client';
import { randomUUID } from 'crypto';

export class MockPrismaService {
  private db: Store[] = [];
  reset = () => (this.db = []);
  store = {
    create: (args: { data: { name: string; userId: string; id?: string } }) => {
      const store = {
        ...args.data,
        id: args.data.id || randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.db.push(store);
      return {
        ...store,
        createdAt: store.createdAt.toISOString(),
        updatedAt: store.updatedAt.toISOString(),
      };
    },
    findFirst: (args: { where: any }) => {
      const store = this.db.find((store) =>
        Object.keys(args.where).every((key) => store[key] === args.where[key]),
      );

      return store
        ? {
            ...store,
            createdAt: store.createdAt.toISOString(),
            updatedAt: store.updatedAt.toISOString(),
          }
        : null;
    },
    findMany: (args: { where: any }) => {
      const stores = this.db.filter((store) =>
        Object.keys(args.where).every((key) => store[key] === args.where[key]),
      );
      return stores.length > 0
        ? stores.map((store) => ({
            ...store,
            createdAt: store.createdAt.toISOString(),
            updatedAt: store.updatedAt.toISOString(),
          }))
        : [];
    },
    update: (args: { where: any; data: any }) => {
      const storeIndex = this.db.findIndex((store) =>
        Object.keys(args.where).every((key) => store[key] === args.where[key]),
      );

      if (storeIndex === -1) return null;

      const store = {
        ...this.db[storeIndex],
        ...args.data,
      };
      this.db[storeIndex] = store;

      return {
        ...store,
        createdAt: store.createdAt.toISOString(),
        updatedAt: store.updatedAt.toISOString(),
      };
    },
    delete: (args: { where: any; data: any }) => {
      const storeIndex = this.db.findIndex((store) =>
        Object.keys(args.where).every((key) => store[key] === args.where[key]),
      );

      if (storeIndex === -1) return null;

      const store = this.db[storeIndex];
      this.db.splice(storeIndex, 1);

      return {
        ...store,
        createdAt: store.createdAt.toISOString(),
        updatedAt: store.updatedAt.toISOString(),
      };
    },
  };
}
