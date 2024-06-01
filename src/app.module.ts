import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvModule } from './env/env.module';
import { DbModule } from './db/db.module';
import { UserModule } from './user/user.module';
import { KeyModule } from './key/key.module';
import { CampaignModule } from './campaign/campaign.module';

@Module({
  imports: [EnvModule, DbModule, UserModule, KeyModule, CampaignModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
