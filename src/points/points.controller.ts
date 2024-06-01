import { Controller, Post, Body, UseGuards, Req, Query, Get } from '@nestjs/common';
import { ApiKeyGuard } from 'src/key/key.guard';
import { ApiRequest } from 'src/interfaces/api-request.interface';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { CreatePointDto } from './dto/create-point.dto';
import { PointsService } from './points.service';
import { Points } from './entities/points.entity';
import { FindPointsDto } from './dto/find-points.dto';

@ApiTags('points')
@ApiBearerAuth()
@Controller('points')
@UseGuards(ApiKeyGuard)
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a point' })
  @ApiResponse({
    status: 201,
    description: 'The point has been successfully created.',
    type: Points,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createPointDto: CreatePointDto, @Req() request: ApiRequest): Promise<Points> {
    return this.pointsService.create(createPointDto, request.access);
  }

  @Get()
  @ApiOperation({ summary: 'Find all points' })
  @ApiResponse({ status: 200, description: 'Return all points.', type: [Points] })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  findAll(@Query() query: FindPointsDto, @Req() request: ApiRequest): Promise<Points[]> {
    return this.pointsService.findAll(query, request.access);
  }
}
