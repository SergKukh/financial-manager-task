import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { TransactionType } from '@common/types';
import { Bank, Category } from '@common/entities';
import { BaseEntity } from './Base.entity';

@Entity({ name: 'transaction' })
export class Transaction extends BaseEntity {
  @Column({
    type: 'decimal',
    scale: 2,
    default: 0,
    nullable: false,
  })
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
    nullable: true,
    default: null,
  })
  type: TransactionType;

  @ManyToOne(() => Bank, (bank) => bank.transactions)
  bank: Bank;

  @ManyToMany(() => Category, (category) => category.transactions)
  @JoinTable()
  categories: Category;
}
