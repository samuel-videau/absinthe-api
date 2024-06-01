import { Injectable } from '@nestjs/common';
import { KeyTableService } from 'src/db/tables/key.service';
import { randomBytes } from 'crypto';
import { Campaign } from 'src/db/entities/campaign.entity';

import { CreateKeyDto, CreateKeyResponseDto } from './dto/create-key.dto';
import { UpdateKeyDto } from './dto/update-key.dto';
import { KeyResponseDto } from './dto/key-response.dto';
import { FindKeysDto } from './dto/find-keys.dto';
import { hashApiKey } from './utils';

@Injectable()
export class KeyService {
  constructor(protected keyTable: KeyTableService) {}

  public async create(createKeyDto: CreateKeyDto): Promise<CreateKeyResponseDto> {
    const { endDate, permissions, campaignId } = createKeyDto;
    const keySecret = this.generateApiKey();
    const hashedKey = await hashApiKey(keySecret);
    const keyRow = await this.keyTable.create(createKeyDto.userId, {
      hashedKey,
      endDate,
      permissions,
      campaign: campaignId ? ({ id: campaignId } as Campaign) : null,
    });

    return { apiKey: `${keyRow.id}.${keySecret}` };
  }

  public async findAll(config: FindKeysDto): Promise<KeyResponseDto[]> {
    const { userId, campaignId } = config;
    const keys = await this.keyTable.findAll(userId, campaignId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return keys.map(({ hashedKey, ...rest }) => rest);
  }

  public async update(id: string, updateKeyDto: UpdateKeyDto): Promise<void> {
    const { endDate, permissions, campaignId } = updateKeyDto;
    await this.keyTable.update(id, {
      endDate,
      permissions,
      campaign: campaignId ? ({ id: campaignId } as Campaign) : null,
    });
  }

  public remove(id: string): Promise<void> {
    return this.keyTable.remove(id);
  }

  protected generateApiKey(): string {
    return randomBytes(32).toString('hex');
  }
}
