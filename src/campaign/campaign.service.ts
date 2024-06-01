import { Injectable } from '@nestjs/common';
import { CampaignTableService } from 'src/db/tables/campaign.service';
import { Campaign } from 'src/db/entities/campaign.entity';

import { CreateCampaignDto } from './dto/create-campaign.dto';

@Injectable()
export class CampaignService {
  constructor(protected campaignTable: CampaignTableService) {}

  async create(campaign: CreateCampaignDto): Promise<Campaign> {
    return await this.campaignTable.createCampaign(campaign.userId, campaign);
  }

  async findAll(userId: string): Promise<Campaign[]> {
    return await this.campaignTable.findAll(userId);
  }

  async update(campaign: Partial<Campaign>): Promise<Campaign> {
    return await this.campaignTable.updateCampaign(campaign);
  }
}
