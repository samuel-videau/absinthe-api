import { Request } from 'express';

export interface ApiRequest extends Request {
  access: ResourceAccess;
}

export interface ResourceAccess {
  userId: string;
  keyId: string;
  campaignId?: number;
}
