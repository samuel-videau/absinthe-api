import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';

import { User } from './user.entity';
import { Campaign } from './campaign.entity';
import { Points } from '../../points/entities/points.entity';

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

  @Column({ type: 'simple-array' })
  permissions: KEY_PERMISSION[];

  @ManyToOne(() => User, (user) => user.keys, { nullable: false })
  user: User;

  @ManyToOne(() => Campaign, (campaign) => campaign.keys, { nullable: true })
  campaign: Campaign | null;

  @OneToMany(() => Points, (points) => points.key)
  points: Points[];
}

export enum KEY_PERMISSION {
  FULL = 'FULL',
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
  PUT = 'PUT',
  PATCH = 'PATCH',
}
