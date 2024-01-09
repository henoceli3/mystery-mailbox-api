import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'messages' })
export class MessagesEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true, nullable: false })
  uuid?: string;

  @Column({ nullable: false })
  is_active?: boolean;

  @Column({ nullable: false })
  userName: string;

  @Column({ nullable: false })
  read: boolean;

  @Column({ nullable: false })
  message: string;

  @Column({ nullable: true })
  created_at?: Date;

  @Column({ nullable: true })
  updated_at?: Date;

  @Column({ nullable: true })
  deleted_at?: Date;
}
