import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePointDto {
  @ApiProperty({ description: 'The ETH address of the points owner' })
  address: string;

  @ApiProperty({ description: 'The ID of the campaign' })
  campaignId: number;

  @ApiProperty({ description: 'The number of points' })
  points: number;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: string;
}
