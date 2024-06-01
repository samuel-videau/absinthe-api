import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KEY_PERMISSION, Key } from 'src/db/entities/key.entity';
import { Repository } from 'typeorm';
import { ApiRequest } from 'src/interfaces/api-request.interface';

import { compareApiKey } from './utils';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    @InjectRepository(Key)
    private keyRepository: Repository<Key>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: ApiRequest = context.switchToHttp().getRequest();
    const apiKeyHeader = request.headers['authorization'];

    if (!apiKeyHeader) {
      throw new UnauthorizedException('API key is missing');
    }

    const apiKey = apiKeyHeader.replace('Bearer ', '');
    const keyId = apiKey.split('.')[0];
    const keySecret = apiKey.split('.')[1];

    const keyRecord = await this.keyRepository.findOne({
      where: { id: keyId },
      relations: ['user', 'campaign'],
    });

    if (!keyRecord) {
      throw new UnauthorizedException('Invalid API key');
    }

    const isValid = await compareApiKey(keySecret, keyRecord.hashedKey);
    if (!isValid) {
      throw new UnauthorizedException('Invalid API key');
    }

    const hasPermission = this.checkPermissions(keyRecord, request);
    if (!hasPermission) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    request.access = {
      userId: keyRecord.user.id,
      keyId: keyRecord.id,
      campaignId: keyRecord.campaign?.id,
    };

    return true;
  }

  private checkPermissions(apiKeyRecord: Key, request: ApiRequest): boolean {
    if (apiKeyRecord.permissions.includes(KEY_PERMISSION.FULL)) return true;
    else if ((apiKeyRecord.permissions as string[]).includes(request.method)) return true;
    else return false;
  }
}
