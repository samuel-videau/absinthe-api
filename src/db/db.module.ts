import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { ormconfig } from './orm-config';
import { Campaign } from './entities/campaign.entity';
import { Points } from './entities/points.entity';
import { Key } from './entities/key.entity';
import { UserTableService } from './tables/user.service';
import { CampaignTableService } from './tables/campaign.service';
import { KeyTableService } from './tables/key.service';
import { PointsTableService } from './tables/points.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    TypeOrmModule.forFeature([User, Campaign, Points, Key]),
  ],
  providers: [UserTableService, PointsTableService, CampaignTableService, KeyTableService],
  exports: [UserTableService, PointsTableService, CampaignTableService, KeyTableService],
})
export class DbModule {}
