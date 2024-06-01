import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { KEY_PERMISSION } from '../entities/key.entity';

export class CreateKeyDto {
  @ApiPropertyOptional({ description: 'The end date of the key', type: Date })
  endDate?: Date;

  @ApiProperty({ description: 'The permissions of the key' })
  permissions: KEY_PERMISSION[];

  @ApiProperty({ description: 'The ID of the user associated with the key' })
  userId: string;

  @ApiPropertyOptional({ description: 'The ID of the campaign associated with the key' })
  campaignId?: number;
}

export class CreateKeyResponseDto {
  @ApiProperty({ description: 'The api key' })
  apiKey: string;
}
