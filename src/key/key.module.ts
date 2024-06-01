import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';

import { KeyService } from './key.service';
import { KeyController } from './key.controller';

@Module({
  imports: [DbModule],
  controllers: [KeyController],
  providers: [KeyService],
})
export class KeyModule {}
