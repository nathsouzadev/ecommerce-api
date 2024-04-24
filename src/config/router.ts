import { UserModule } from '../user/user.module';
import { StoreModule } from '../store/store.module';

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
    ],
  },
];
