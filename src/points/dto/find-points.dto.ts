import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FindPointsDto {
  @ApiProperty({ description: 'The ID of the campaign to find points for' })
  campaignId: number;

  @ApiPropertyOptional({ description: 'The ETH address of the points owner' })
  address?: string;

  @ApiPropertyOptional({ description: 'The event name associated with the points distribution' })
  eventName?: string;
}
