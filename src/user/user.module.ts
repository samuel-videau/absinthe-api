import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CampaignModule } from './campaign/campaign.module';

@Module({
  imports: [CampaignModule, DbModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
