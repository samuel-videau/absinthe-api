import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EnvModule } from './env/env.module';
import { UserModule } from './user/user.module';
import { KeyModule } from './key/key.module';
import { PointsModule } from './points/points.module';
import { CampaignModule } from './campaign/campaign.module';
import { ormconfig } from './orm-config';
import { LoggerMiddleware } from './middlewares/logger.middleware';

@Module({
  imports: [
    EnvModule,
    UserModule,
    KeyModule,
    CampaignModule,
    PointsModule,
    TypeOrmModule.forRoot(ormconfig),
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
