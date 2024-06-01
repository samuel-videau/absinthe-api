import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResourceAccess } from 'src/interfaces/api-request.interface';

import { Points } from './entities/points.entity';
import { Campaign } from '../campaign/entities/campaign.entity';
import { Key } from '../key/entities/key.entity';
import { CreatePointDto } from './dto/create-point.dto';
import { FindPointsDto } from './dto/find-points.dto';

@Injectable()
export class PointsService {
  constructor(
    @InjectRepository(Points)
    private readonly pointsRepository: Repository<Points>,
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(Key)
    private readonly keyRepository: Repository<Key>,
  ) {}

  async create(points: CreatePointDto, access: ResourceAccess): Promise<Points> {
    this.verifyResourceAccess(access, points.campaignId);

    return this.pointsRepository.save({
      ...points,
      campaign: { id: points.campaignId },
      key: { id: access.keyId },
    });
  }

  async findAll(query: FindPointsDto, access: ResourceAccess): Promise<Points[]> {
    this.verifyResourceAccess(access, query.campaignId);
    return this.pointsRepository.find({
      where: {
        campaign: { id: query.campaignId },
        address: query.address,
        eventName: query.eventName,
      },
    });
  }

  async remove(id: number): Promise<void> {
    await this.pointsRepository.delete(id);
  }

  protected async verifyResourceAccess(
    access: ResourceAccess,
    campaignId: number,
  ): Promise<boolean> {
    const campaign = await this.campaignRepository.findOne({
      where: { id: campaignId },
      relations: ['user'],
    });

    if (!campaign) throw new NotFoundException('Campaign not found');

    if (access.userId == campaign.user.id) {
      if (!access.campaignId) {
        return true;
      } else if (access.campaignId == campaignId) {
        return true;
      }
    }
    throw new ForbiddenException('Unauthorized');
  }
}
