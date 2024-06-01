import { ApiProperty } from '@nestjs/swagger';

export class CreateCampaignDto {
  @ApiProperty({ description: 'The name of the campaign' })
  name: string;

  @ApiProperty({ description: 'The user ID of the campaign owner' })
  userId: string;

  @ApiProperty({ description: 'The start date of the campaign' })
  startDate: Date;

  @ApiProperty({ description: 'The end date of the campaign', required: false })
  endDate?: Date;
}
