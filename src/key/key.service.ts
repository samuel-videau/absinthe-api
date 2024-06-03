import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateKeyDto, CreateKeyResponseDto } from './dto/create-key.dto';
import { UpdateKeyDto } from './dto/update-key.dto';
import { KeyResponseDto } from './dto/key-response.dto';
import { FindKeysDto } from './dto/find-keys.dto';
import { hashApiKey } from './utils';
import { Key } from './entities/key.entity';
import { Campaign } from '../campaign/entities/campaign.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class KeyService {
  constructor(
    @InjectRepository(Key)
    private readonly keyRepository: Repository<Key>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
  ) {}

  public async create(createKeyDto: CreateKeyDto): Promise<CreateKeyResponseDto> {
    const { userId, endDate, permissions, campaignId } = createKeyDto;

    if (endDate && endDate < new Date()) {
      throw new BadRequestException('Invalid end date');
    }
    if (permissions.length === 0) {
      throw new BadRequestException('Permissions are required');
    }
    if (campaignId) {
      const campaign = await this.campaignRepository.findOneBy({ id: campaignId });
      if (!campaign) {
        throw new BadRequestException('Invalid campaign');
      }
      if (campaign.user.id !== userId) {
        throw new ForbiddenException('Invalid campaign');
      }
    }

    const keySecret = this.generateApiKey();
    const hashedKey = await hashApiKey(keySecret);
    const keyRow = await this.keyRepository.save({
      hashedKey,
      endDate,
      permissions,
      campaign: campaignId ? ({ id: campaignId } as Campaign) : null,
      user: { id: userId },
    });

    return { apiKey: `${keyRow.id}.${keySecret}` };
  }

  public async findAll(config: FindKeysDto): Promise<KeyResponseDto[]> {
    const { userId, campaignId } = config;
    const keys = await this.keyRepository.findBy({
      user: userId ? { id: userId } : undefined,
      campaign: campaignId ? { id: campaignId } : undefined,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return keys.map(({ hashedKey, ...rest }) => rest);
  }

  public async update(id: string, updateKeyDto: UpdateKeyDto): Promise<void> {
    const { endDate, permissions, campaignId } = updateKeyDto;

    const key = await this.keyRepository.findOneBy({ id });
    if (!key) {
      throw new BadRequestException('Invalid key');
    }

    if (endDate && endDate < new Date()) {
      throw new BadRequestException('Invalid end date');
    }
    if (permissions && permissions.length === 0) {
      throw new BadRequestException('Permissions are required');
    }
    if (campaignId) {
      const campaign = await this.campaignRepository.findOneBy({ id: campaignId });
      if (!campaign) {
        throw new BadRequestException('Invalid campaign');
      }
      if (campaign.user.id !== key.user.id) {
        throw new ForbiddenException('Invalid campaign');
      }
    }

    await await this.keyRepository.update(id, {
      endDate,
      permissions,
      campaign: campaignId ? ({ id: campaignId } as Campaign) : null,
    });
  }

  async remove(id: string): Promise<void> {
    await this.keyRepository.delete(id);
  }

  protected generateApiKey(): string {
    return randomBytes(32).toString('hex');
  }
}
