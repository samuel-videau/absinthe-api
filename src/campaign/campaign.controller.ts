import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Query,
  ForbiddenException,
  Logger,
  InternalServerErrorException,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';

import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { Campaign } from './entities/campaign.entity';

@ApiTags('campaigns')
@Controller('campaigns')
export class CampaignController {
  private readonly logger = new Logger('HTTP');

  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  @ApiOperation({ summary: 'Create a campaign for a user' })
  @ApiResponse({
    status: 201,
    description: 'The campaign has been successfully created.',
    type: Campaign,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({ type: CreateCampaignDto })
  async create(@Body() createCampaignDto: CreateCampaignDto): Promise<Campaign> {
    try {
      return this.campaignService.create(createCampaignDto);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException();
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all campaigns for a user' })
  @ApiResponse({ status: 200, description: 'Return all campaigns for the user.', type: [Campaign] })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiQuery({ name: 'userId', description: 'ID of the user' })
  async findAll(@Query('userId') userId: string): Promise<Campaign[]> {
    if (!userId) throw new ForbiddenException('You do not have access to this resource.');

    try {
      return this.campaignService.findAll(userId);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException();
    }
  }

  @Get(':campaignId')
  @ApiOperation({ summary: 'Get a campaign by ID' })
  @ApiResponse({ status: 200, description: 'Return the campaign.', type: Campaign })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({ name: 'campaignId', description: 'ID of the campaign' })
  async findOne(@Param('campaignId') campaignId: number): Promise<Campaign> {
    try {
      return this.campaignService.findOne(campaignId);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException();
    }
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
  async update(
    @Body() updateCampaignDto: UpdateCampaignDto,
    @Param('campaignId') campaignId: number,
  ): Promise<Campaign> {
    try {
      return this.campaignService.update(campaignId, updateCampaignDto);
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException();
    }
  }
}
