import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PointsController } from './points.controller';
import { Points } from './entities/points.entity';
import { PointsService } from './points.service';
import { Campaign } from '../campaign/entities/campaign.entity';
import { Key } from '../key/entities/key.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Points, Campaign, Key])],
  controllers: [PointsController],
  providers: [PointsService],
})
export class PointsModule {}
