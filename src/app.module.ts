import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvModule } from './env/env.module';
import { DbModule } from './db/db.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [EnvModule, DbModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
