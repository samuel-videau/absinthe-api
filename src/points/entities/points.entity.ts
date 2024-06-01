import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';

import { Campaign } from '../../db/entities/campaign.entity';
import { Key } from '../../db/entities/key.entity';

@Entity({ name: 'points' })
export class Points {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'char', length: 42 })
  address: string;

  @Column()
  points: number;

  @Column()
  eventName: string;

  @Column({ type: 'varchar', nullable: true })
  metadata: string | null;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => Campaign, (campaign) => campaign.points)
  campaign: Campaign;

  @ManyToOne(() => Key, (key) => key.points)
  key: Key;
}
