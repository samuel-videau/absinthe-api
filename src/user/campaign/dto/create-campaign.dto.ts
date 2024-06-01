import { ApiProperty } from '@nestjs/swagger';

export class CreateCampaignDto {
  @ApiProperty({ description: 'The start date of the campaign' })
  startDate: Date;

  @ApiProperty({ description: 'The end date of the campaign', required: false })
  endDate?: Date;
}
