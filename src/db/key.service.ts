import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Key } from './entities/key.entity';
import { User } from './entities/user.entity';
import { Campaign } from './entities/campaign.entity';

@Injectable()
export class KeyService {
  private readonly saltRounds = 10;

  constructor(
    @InjectRepository(Key)
    private readonly keyRepository: Repository<Key>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
  ) {}

  async createKey(key: Partial<Key>): Promise<Key> {
    return this.keyRepository.save(key);
  }

  async findAll(): Promise<Key[]> {
    return this.keyRepository.find();
  }

  async findOne(id: string): Promise<Key | null> {
    return this.keyRepository.findOneBy({ id });
  }

  async findOneByHashedKey(hashedKey: string): Promise<Key | null> {
    return this.keyRepository.findOneBy({ hashedKey });
  }

  async remove(id: string): Promise<void> {
    await this.keyRepository.delete(id);
  }
}
