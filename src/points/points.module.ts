import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from 'src/db/entities/campaign.entity';
import { Key } from 'src/db/entities/key.entity';

import { PointsController } from './points.controller';
import { Points } from './entities/points.entity';
import { PointsService } from './points.service';

@Module({
  imports: [TypeOrmModule.forFeature([Points, Campaign, Key])],
  controllers: [PointsController],
  providers: [PointsService],
})
export class PointsModule {}
