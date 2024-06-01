import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Points } from '../entities/points.entity';
import { Campaign } from '../entities/campaign.entity';
import { Key } from '../entities/key.entity';

@Injectable()
export class PointsTableService {
  constructor(
    @InjectRepository(Points)
    private readonly pointsRepository: Repository<Points>,
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(Key)
    private readonly keyRepository: Repository<Key>,
  ) {}

  async createPoints(points: Partial<Points>): Promise<Points> {
    return this.pointsRepository.save(points);
  }

  async findAll(): Promise<Points[]> {
    return this.pointsRepository.find();
  }

  async findByAddress(address: string): Promise<Points[]> {
    return this.pointsRepository.find({ where: { address } });
  }

  async findByAddressAndEvent(address: string, eventName: string): Promise<Points[]> {
    return this.pointsRepository.find({ where: { address, metadata: eventName } });
  }

  async remove(id: number): Promise<void> {
    await this.pointsRepository.delete(id);
  }
}
