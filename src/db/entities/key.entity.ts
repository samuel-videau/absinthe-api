import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';

import { User } from './user.entity';
import { Campaign } from './campaign.entity';
import { Points } from './points.entity';

@Entity({ name: 'key' })
export class Key {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'char', length: 62 })
  hashedKey: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  endDate: Date | null;

  @Column({ type: 'int' })
  permission: KEY_PERMISSION;

  @ManyToOne(() => User, (user) => user.keys)
  user: User;

  @ManyToOne(() => Campaign, (campaign) => campaign.keys, { nullable: true })
  campaign: Campaign | null;

  @OneToMany(() => Points, (points) => points.key)
  points: Points[];
}

export enum KEY_PERMISSION {
  FULL = 0,
  CAMPAIGN = 1,
}
