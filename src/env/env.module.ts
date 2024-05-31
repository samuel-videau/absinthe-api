import { Module } from '@nestjs/common';

import { EnvService } from './env.service';

@Module({})
export class EnvModule {
  providers: [EnvService];
  exports: [EnvService];
}
