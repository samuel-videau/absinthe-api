import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';

import { User } from './user.entity';
import { Key } from './key.entity';
import { Points } from './points.entity';

@Entity({ name: 'campaign' })
export class Campaign {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  startDate: Date;

  @Column({ type: 'timestamptz', nullable: true })
  endDate: Date | null;

  @Column({ type: 'int' })
  status: CAMPAIGN_STATUS;

  @ManyToOne(() => User, (user) => user.campaigns)
  user: User;

  @OneToMany(() => Key, (key) => key.campaign)
  keys: Key[];

  @OneToMany(() => Points, (points) => points.campaign)
  points: Points[];
}

export enum CAMPAIGN_STATUS {
  OFF = 0,
  ON = 1,
  COMPLETED = 2,
}
