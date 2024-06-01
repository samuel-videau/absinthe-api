import { Controller, Get, Post, Body, Patch, Query, ForbiddenException } from '@nestjs/common';
import { Campaign } from 'src/db/entities/campaign.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';

import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@ApiTags('campaigns')
@Controller('campaigns')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  @ApiOperation({ summary: 'Create a campaign for a user' })
  @ApiResponse({
    status: 201,
    description: 'The campaign has been successfully created.',
    type: Campaign,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @ApiBody({ type: CreateCampaignDto })
  async create(@Body() createCampaignDto: CreateCampaignDto): Promise<Campaign> {
    return this.campaignService.create(createCampaignDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all campaigns for a user' })
  @ApiResponse({ status: 200, description: 'Return all campaigns for the user.', type: [Campaign] })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiQuery({ name: 'userId', description: 'ID of the user' })
  async findAll(@Query('userId') userId: string): Promise<Campaign[]> {
    if (!userId) throw new ForbiddenException('You do not have access to this resource.');
    return this.campaignService.findAll(userId);
  }

  @Patch(':campaignId')
  @ApiOperation({ summary: 'Update a campaign' })
  @ApiResponse({
    status: 200,
    description: 'The campaign has been successfully updated.',
    type: Campaign,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({ name: 'campaignId', description: 'ID of the campaign' })
  @ApiBody({ type: UpdateCampaignDto })
  async update(@Body() updateCampaignDto: UpdateCampaignDto): Promise<Campaign> {
    return this.campaignService.update(updateCampaignDto);
  }
}
