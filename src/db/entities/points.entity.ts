import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';

import { Campaign } from './campaign.entity';
import { Key } from './key.entity';

@Entity({ name: 'points' })
export class Points {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'char', length: 42 })
  address: string;

  @Column()
  points: number;

  @Column()
  metadata: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => Campaign, (campaign) => campaign.points)
  campaign: Campaign;

  @ManyToOne(() => Key, (key) => key.points)
  key: Key;
}
