import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { Campaign } from 'src/db/entities/campaign.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@ApiTags('campaign')
@Controller('user/:userId/campaign')
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
  async create(
    @Body() createCampaignDto: CreateCampaignDto,
    @Param('userId') userId: string,
  ): Promise<Campaign> {
    return this.campaignService.create(userId, createCampaignDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all campaigns for a user' })
  @ApiResponse({ status: 200, description: 'Return all campaigns for the user.', type: [Campaign] })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  async findAll(@Param('userId') userId: string): Promise<Campaign[]> {
    return this.campaignService.findAll(userId);
  }

  @Put()
  @ApiOperation({ summary: 'Update a campaign' })
  @ApiResponse({
    status: 200,
    description: 'The campaign has been successfully updated.',
    type: Campaign,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @ApiBody({ type: UpdateCampaignDto })
  async update(@Body() updateCampaignDto: UpdateCampaignDto): Promise<Campaign> {
    return this.campaignService.update(updateCampaignDto);
  }
}
