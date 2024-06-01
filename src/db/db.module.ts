import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { Campaign } from './entities/campaign.entity';
import { Key } from './entities/key.entity';
import { UserTableService } from './tables/user.service';
import { CampaignTableService } from './tables/campaign.service';
import { KeyTableService } from './tables/key.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Campaign, Key])],
  providers: [UserTableService, CampaignTableService, KeyTableService],
  exports: [UserTableService, CampaignTableService, KeyTableService],
})
export class DbModule {}
