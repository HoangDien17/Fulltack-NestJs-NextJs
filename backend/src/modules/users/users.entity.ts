import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column({ default: 1 })
  is_active: number;

  @Column()
  register_token?: string;

  @Column()
  reset_password_at?: Date;

  @Column()
  reset_password_token?: string;

  @Column()
  attack_count?: number;

  @Column()
  lock_time?: Date;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
