import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppService } from './app.service';
import { EnvModule } from './env/env.module';
import { UserModule } from './user/user.module';
import { KeyModule } from './key/key.module';
import { PointsModule } from './points/points.module';
import { CampaignModule } from './campaign/campaign.module';
import { ormconfig } from './orm-config';

@Module({
  imports: [
    EnvModule,
    UserModule,
    KeyModule,
    CampaignModule,
    PointsModule,
    TypeOrmModule.forRoot(ormconfig),
  ],
  providers: [AppService],
})
export class AppModule {}
