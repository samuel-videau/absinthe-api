import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { getAddress } from 'ethers';

import { Points } from './entities/points.entity';
import { CAMPAIGN_STATUS, Campaign } from '../campaign/entities/campaign.entity';
import { Key } from '../key/entities/key.entity';
import { CreatePointDto } from './dto/create-point.dto';
import { FindPointsDto } from './dto/find-points.dto';
import { ResourceAccess } from '../interfaces/api-request.interface';

@Injectable()
export class PointsService {
  constructor(
    @InjectRepository(Points)
    private readonly pointsRepository: Repository<Points>,
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(Key)
    private readonly keyRepository: Repository<Key>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async create(input: CreatePointDto, access: ResourceAccess): Promise<Points> {
    const { campaignId, points, metadata } = input;
    let address: string;
    this.verifyResourceAccess(access, campaignId);

    const campaign = await this.campaignRepository.findOneBy({ id: campaignId });
    if (!campaign) throw new NotFoundException('Campaign not found');
    if (campaign.status !== CAMPAIGN_STATUS.ON)
      throw new BadRequestException('Campaign is not active');

    try {
      address = getAddress(input.address.toLowerCase());
    } catch (e) {
      throw new BadRequestException('Invalid address');
    }

    if (!campaignId || !points) {
      throw new BadRequestException('Invalid parameters');
    }
    if (metadata) {
      try {
        JSON.parse(metadata);
      } catch (e) {
        throw new BadRequestException('Invalid metadata');
      }
    }

    return this.pointsRepository.save({
      ...input,
      address,
      campaign: { id: campaignId },
      key: { id: access.keyId },
    });
  }

  async findAll(query: FindPointsDto, access: ResourceAccess): Promise<Points[]> {
    const { campaignId, eventName } = query;
    this.verifyResourceAccess(access, campaignId);
    let address: string;

    if (!query.address) throw new BadRequestException('Address is required');
    try {
      address = getAddress(query.address.toLowerCase());
    } catch (e) {
      throw new BadRequestException('Invalid address');
    }

    const queryBuilder = this.entityManager
      .createQueryBuilder(Points, 'points')
      .where('points.campaignId = :campaignId', { campaignId });

    if (address) {
      queryBuilder.andWhere('LOWER(points.address) = LOWER(:address)', { address });
    }

    if (eventName) {
      queryBuilder.andWhere('LOWER(points.eventName) = LOWER(:eventName)', { eventName });
    }

    return queryBuilder.getMany();
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
