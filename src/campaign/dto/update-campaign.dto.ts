import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CAMPAIGN_STATUS } from 'src/db/entities/campaign.entity';

import { CreateCampaignDto } from './create-campaign.dto';

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
