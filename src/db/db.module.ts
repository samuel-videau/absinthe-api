import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { ormconfig } from './orm-config';
import { Campaign } from './entities/campaign.entity';
import { Points } from './entities/points.entity';
import { Key } from './entities/key.entity';
import { UserService } from './user.service';
import { CampaignService } from './campaign.service';
import { KeyService } from './key.service';
import { PointsService } from './points.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    TypeOrmModule.forFeature([User, Campaign, Points, Key]),
  ],
  providers: [UserService, PointsService, CampaignService, KeyService],
  exports: [UserService, PointsService, CampaignService, KeyService],
})
export class DbModule {}
