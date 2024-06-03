import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCampaignDto } from './dto/create-campaign.dto';
import { Campaign } from './entities/campaign.entity';
import { User } from '../user/entities/user.entity';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(campaign: CreateCampaignDto): Promise<Campaign> {
    const { userId, name, startDate, endDate } = campaign;

    if (!name) {
      throw new BadRequestException('Name is required');
    }

    if (endDate && (endDate < startDate || endDate < new Date())) {
      throw new BadRequestException('End date must be after start date');
    }

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

  async findOne(id: number): Promise<Campaign> {
    const res = await this.campaignRepository.findOneBy({ id });
    if (res !== null) {
      return res;
    } else {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }
  }

  async update(id: number, campaign: UpdateCampaignDto): Promise<Campaign> {
    const campaignRow = await this.campaignRepository.findOneBy({ id: id });
    if (!campaignRow) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    return this.campaignRepository.save({ ...campaignRow, ...campaign });
  }
}
