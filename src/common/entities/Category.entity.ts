import { Entity, Column, ManyToMany } from 'typeorm';
import { Transaction } from '@common/entities';
import { BaseEntity } from './Base.entity';

@Entity({ name: 'category' })
export class Category extends BaseEntity {
  @Column({ nullable: true, default: null })
  name: string;

  @ManyToMany(() => Transaction, (transaction) => transaction.categories)
  transactions: Transaction;
}
