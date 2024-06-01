import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

import { CreateCampaignDto } from './create-campaign.dto';
import { CAMPAIGN_STATUS } from '../entities/campaign.entity';

export class UpdateCampaignDto extends PartialType(CreateCampaignDto) {
  @ApiProperty({ description: 'The user ID of the campaign owner' })
  userId: string;

  @ApiProperty({
    enum: CAMPAIGN_STATUS,
    description: 'The status of the campaign',
    required: false,
  })
  status?: CAMPAIGN_STATUS;
}
