import { Repository } from 'typeorm';
import {
  Inject,
  Injectable,
  BadRequestException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bank } from '@common/entities';
import { TransactionService } from '@/modules/transaction/transaction.service';
import { CreateBankDto } from './dto';
import { UpdateBankPayload } from './types';

@Injectable()
export class BankService {
  constructor(
    @InjectRepository(Bank)
    private bankRepository: Repository<Bank>,
    @Inject(forwardRef(() => TransactionService))
    private transactionService: TransactionService,
  ) {}

  async create(payload: CreateBankDto): Promise<void> {
    await this.bankRepository
      .createQueryBuilder()
      .insert()
      .into(Bank)
      .values([payload])
      .execute();
  }

  async update(id: string, payload: UpdateBankPayload): Promise<void> {
    const result = await this.bankRepository
      .createQueryBuilder()
      .update(Bank)
      .set(payload)
      .where('id = :id', { id })
      .execute();

    if (!result.affected) {
      throw new BadRequestException('Wrong bank id');
    }
  }

  async delete(id: string): Promise<void> {
    const transactions = await this.transactionService.countTransactions({
      bank: id,
    });

    if (transactions) {
      throw new BadRequestException(`Can't delete bank with transactions`);
    }

    const result = await this.bankRepository
      .createQueryBuilder()
      .delete()
      .from(Bank)
      .where('id = :id', { id })
      .execute();

    if (!result.affected) {
      throw new BadRequestException('Wrong bank id');
    }
  }

  async findById(id: string): Promise<Bank> {
    return await this.bankRepository
      .createQueryBuilder('bank')
      .where({ id })
      .getOne();
  }

  async findAll(): Promise<Bank[]> {
    return await this.bankRepository
      .createQueryBuilder('bank')
      .orderBy('name', 'ASC')
      .getMany();
  }
}
