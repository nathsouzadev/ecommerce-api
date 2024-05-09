import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { validationSchema } from './config/config.schema';
import config from './config/config';
import { ConfigModule } from '@nestjs/config';
import { router } from './config/router';
import { StoreModule } from './store/store.module';
import { UserModule } from './user/user.module';
import { HealthModule } from './health/health.module';
import { StoresModule } from './store/stores.module';
import { BillboardModule } from './billboard/billboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [config],
    }),
    RouterModule.register(router),
    StoreModule,
    StoresModule,
    UserModule,
    HealthModule,
    BillboardModule,
  ],
})
export class AppModule {}
