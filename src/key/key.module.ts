import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from 'src/campaign/entities/campaign.entity';
import { User } from 'src/user/entities/user.entity';

import { KeyController } from './key.controller';
import { KeyService } from './key.service';
import { Key } from './entities/key.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Campaign, Key])],
  controllers: [KeyController],
  providers: [KeyService],
})
export class KeyModule {}
