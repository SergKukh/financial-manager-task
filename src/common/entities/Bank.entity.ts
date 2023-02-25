import { Entity, Column, OneToMany } from 'typeorm';
import { Transaction } from '@common/entities';
import { BaseEntity } from './Base.entity';

@Entity({ name: 'bank' })
export class Bank extends BaseEntity {
  @Column({ nullable: true, default: null })
  name: string;

  @Column({
    type: 'decimal',
    scale: 2,
    default: 0,
    nullable: false,
  })
  balance: number;

  @OneToMany(() => Transaction, (transaction) => transaction.bank)
  transactions: Transaction[];
}
