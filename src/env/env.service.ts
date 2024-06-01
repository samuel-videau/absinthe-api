import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';

import { ENV_KEY } from './env-keys';

config();

@Injectable()
export class EnvService {
  get(key: ENV_KEY): string {
    const value = process.env[key];
    if (value === undefined) throw new Error(`Environment variable ${key} is not set`);
    else return value;
  }
}
