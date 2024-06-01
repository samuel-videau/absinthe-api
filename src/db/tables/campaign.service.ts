import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Campaign } from '../entities/campaign.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class CampaignTableService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createCampaign(userId: string, campaign: Partial<Campaign>): Promise<Campaign> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const campaignRow = this.campaignRepository.create({ ...campaign, user, status: 0 });
    return this.campaignRepository.save(campaignRow);
  }

  async findAll(userId: string): Promise<Campaign[]> {
    return this.campaignRepository.findBy({ user: { id: userId } });
  }

  async findOne(id: number): Promise<Campaign | null> {
    return this.campaignRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.campaignRepository.delete(id);
  }

  async updateCampaign(campaign: Partial<Campaign>): Promise<Campaign> {
    const campaignRow = await this.campaignRepository.findOneBy({ id: campaign.id });
    if (!campaignRow) {
      throw new NotFoundException(`Campaign with ID ${campaign.id} not found`);
    }

    return this.campaignRepository.save({ ...campaignRow, ...campaign });
  }
}
