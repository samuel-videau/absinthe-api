import { ApiProperty } from '@nestjs/swagger';
import { KEY_PERMISSION } from 'src/db/entities/key.entity';

export class KeyResponseDto {
  @ApiProperty({ description: 'The ID of the key' })
  id: string;

  @ApiProperty({ description: 'The creation date of the key' })
  createdAt: Date;

  @ApiProperty({ description: 'The end date of the key', nullable: true })
  endDate: Date | null;

  @ApiProperty({ description: 'The permission level of the key', enum: KEY_PERMISSION })
  permissions: KEY_PERMISSION[];
}
