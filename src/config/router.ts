import { UserModule } from '../user/user.module';
import { StoreModule } from '../store/store.module';
import { HealthModule } from '../health/health.module';

export const router = [
  {
    path: '/api',
    children: [
      {
        path: 'user',
        module: UserModule,
        children: [
          {
            path: 'store',
            module: StoreModule,
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
