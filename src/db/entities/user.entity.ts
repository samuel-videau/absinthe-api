import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Campaign } from './campaign.entity';
import { Key } from './key.entity';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'varchar' })
  role: 'admin' | 'user';

  @Column({ type: 'int' })
  tier: SUBSCRIPTION_TIER;

  @OneToMany(() => Campaign, (campaign) => campaign.user)
  campaigns: Campaign[];

  @OneToMany(() => Key, (key) => key.user)
  keys: Key[];
}

export enum SUBSCRIPTION_TIER {
  FREE = 0,
  BASIC = 1,
  PREMIUM = 2,
}
