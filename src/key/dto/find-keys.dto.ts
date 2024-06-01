import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindKeysDto {
  @ApiPropertyOptional({ description: 'The ID of the user to find keys for' })
  userId?: string;

  @ApiPropertyOptional({ description: 'The ID of the campaign to find keys for' })
  campaignId?: number;
}
