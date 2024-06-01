import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KeyController } from './key.controller';
import { KeyService } from './key.service';
import { Key } from './entities/key.entity';
import { Campaign } from '../campaign/entities/campaign.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Campaign, Key])],
  controllers: [KeyController],
  providers: [KeyService],
})
export class KeyModule {}
