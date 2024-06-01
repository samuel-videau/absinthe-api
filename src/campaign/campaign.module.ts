import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';
import { Campaign } from './entities/campaign.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Campaign])],
  controllers: [CampaignController],
  providers: [CampaignService],
})
export class CampaignModule {}
