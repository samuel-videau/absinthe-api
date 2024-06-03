import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { isAddress } from 'ethers';

import { Points } from './entities/points.entity';
import { Campaign } from '../campaign/entities/campaign.entity';
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
    const { campaignId, address, points, metadata } = input;
    this.verifyResourceAccess(access, campaignId);

    if (!isAddress(address) || !campaignId || !points) {
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
      campaign: { id: campaignId },
      key: { id: access.keyId },
    });
  }

  async findAll(query: FindPointsDto, access: ResourceAccess): Promise<Points[]> {
    const { campaignId, address, eventName } = query;
    this.verifyResourceAccess(access, campaignId);

    if (address && !isAddress(address)) {
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
