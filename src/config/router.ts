import { UserModule } from '../user/user.module';
import { StoreModule } from '../store/store.module';
import { HealthModule } from '../health/health.module';
import { StoresModule } from '../store/stores.module';
import { BillboardModule } from '../billboard/billboard.module';

export const router = [
  {
    path: '/api',
    children: [
      {
        path: 'user',
        module: UserModule,
        children: [
          {
            path: ':userId/store',
            module: StoreModule,
            children: [
              {
                path: ':storeId/billboard',
                module: BillboardModule,
              },
            ],
          },
          {
            path: ':userId/stores',
            module: StoresModule,
          },
        ],
      },
      {
        path: 'health',
        module: HealthModule,
      },
    ],
  },
];
