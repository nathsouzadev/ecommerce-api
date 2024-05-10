import { randomUUID } from 'crypto';

export class MockPrismaService {
  protected db: any[] = [];
  private filterKeys = (data: any, entity: any) =>
    Object.keys(data).every((key) => entity[key] === data[key]);

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
      const store = this.db.find((store) => this.filterKeys(args.where, store));

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
        this.filterKeys(args.where, store),
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
        this.filterKeys(args.where, store),
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
        this.filterKeys(args.where, store),
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
  billboard = {
    create: (args: {
      data: { label: string; imageUrl: string; storeId: string; id?: string };
    }) => {
      const billboard = {
        ...args.data,
        id: args.data.id || randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.db.push(billboard);
      return {
        ...billboard,
        createdAt: billboard.createdAt.toISOString(),
        updatedAt: billboard.updatedAt.toISOString(),
      };
    },
    findMany: (args: { where: any }) => {
      const billboards = this.db.filter((billboard) =>
        this.filterKeys(args.where, billboard),
      );
      return billboards.length > 0
        ? billboards.map((billboard) => ({
            ...billboard,
            createdAt: billboard.createdAt.toISOString(),
            updatedAt: billboard.updatedAt.toISOString(),
          }))
        : [];
    },
    delete: (args: { where: any }) => {
      const billboardIndex = this.db.findIndex((billboard) =>
        this.filterKeys(args.where, billboard),
      );

      if (billboardIndex === -1) return null;

      const billboard = this.db[billboardIndex];
      this.db.splice(billboardIndex, 1);

      return {
        ...billboard,
        createdAt: billboard.createdAt.toISOString(),
        updatedAt: billboard.updatedAt.toISOString(),
      };
    },
    update: (args: { where: any; data: any }) => {
      const billboardIndex = this.db.findIndex((billboard) =>
        this.filterKeys(args.where, billboard),
      );

      if (billboardIndex === -1) return null;

      const billboard = {
        ...this.db[billboardIndex],
        ...args.data,
      };
      this.db[billboardIndex] = billboard;

      return {
        ...billboard,
        createdAt: billboard.createdAt.toISOString(),
        updatedAt: billboard.updatedAt.toISOString(),
      };
    },
  };
}
