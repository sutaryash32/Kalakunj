import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('inquiries')
export class Inquiry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'json' })
  items: Record<string, any>[];

  @Column({ nullable: true })
  contactName: string;

  @Column({ nullable: true })
  contactPhone: string;

  @CreateDateColumn()
  createdAt: Date;
}
