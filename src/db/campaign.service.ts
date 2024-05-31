import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Campaign } from './entities/campaign.entity';
import { User } from './entities/user.entity';

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createCampaign(campaign: Partial<Campaign>): Promise<Campaign> {
    return this.campaignRepository.save(campaign);
  }

  async findAll(): Promise<Campaign[]> {
    return this.campaignRepository.find();
  }

  async findOne(id: number): Promise<Campaign | null> {
    return this.campaignRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.campaignRepository.delete(id);
  }
}
