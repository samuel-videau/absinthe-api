import { ApiPropertyOptional } from '@nestjs/swagger';
import { KEY_PERMISSION } from 'src/db/entities/key.entity';

export class UpdateKeyDto {
  @ApiPropertyOptional({ description: 'The new end date of the key', type: Date })
  endDate?: Date;

  @ApiPropertyOptional({ description: 'The new permission level of the key', enum: KEY_PERMISSION })
  permission?: KEY_PERMISSION;

  @ApiPropertyOptional({ description: 'The new campaign ID associated with the key' })
  campaignId?: number;
}
