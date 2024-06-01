import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';

import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';

@Module({
  imports: [DbModule],
  controllers: [CampaignController],
  providers: [CampaignService],
})
export class CampaignModule {}
