import { Injectable } from '@nestjs/common';
import { KeyTableService } from 'src/db/tables/key.service';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { Campaign } from 'src/db/entities/campaign.entity';

import { CreateKeyDto, CreateKeyResponseDto } from './dto/create-key.dto';
import { UpdateKeyDto } from './dto/update-key.dto';
import { KeyResponseDto } from './dto/key-response.dto';
import { FindKeysDto } from './dto/find-keys.dto';

@Injectable()
export class KeyService {
  constructor(protected keyTable: KeyTableService) {}

  public async create(createKeyDto: CreateKeyDto): Promise<CreateKeyResponseDto> {
    const { endDate, permission, campaignId } = createKeyDto;
    const apiKey = this.generateApiKey();
    const hashedKey = await this.hashApiKey(apiKey);
    const keyRow = await this.keyTable.create({
      hashedKey,
      endDate,
      permission,
      campaign: campaignId ? ({ id: campaignId } as Campaign) : null,
    });

    return { id: keyRow.id, key: apiKey };
  }

  public async findAll(config: FindKeysDto): Promise<KeyResponseDto[]> {
    const { userId, campaignId } = config;
    const keys = await this.keyTable.findAll(userId, campaignId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return keys.map(({ hashedKey, ...rest }) => rest);
  }

  public async update(id: string, updateKeyDto: UpdateKeyDto): Promise<void> {
    const { endDate, permission, campaignId } = updateKeyDto;
    await this.keyTable.update(id, {
      endDate,
      permission,
      campaign: campaignId ? ({ id: campaignId } as Campaign) : null,
    });
  }

  public remove(id: string): Promise<void> {
    return this.keyTable.remove(id);
  }

  protected generateApiKey(): string {
    return randomBytes(32).toString('hex').slice(0, length);
  }

  protected async hashApiKey(apiKey: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(apiKey, saltRounds);
  }
}
