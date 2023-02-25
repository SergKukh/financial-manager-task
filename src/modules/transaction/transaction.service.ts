import {
  Inject,
  Injectable,
  forwardRef,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Transaction } from '@common/entities';
import { TransactionType } from '@common/types';
import {
  findTransactionsDefaultLimit,
  findTransactionsDefaultOffset,
} from '@common/constants';
import { BankService } from '@/modules/bank/bank.service';
import { CreateTransactionDto, FindAllResponse, GetAllParamsDto } from './dto';
import { CountTransactionsPayload, TransactionWebhookPayload } from './types';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @Inject(forwardRef(() => BankService))
    private bankService: BankService,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async create(body: CreateTransactionDto): Promise<void> {
    const amount =
      Math.abs(body.amount) *
      (body.type === TransactionType.CONSUMABLE ? -1 : 1);

    const insertResult = await this.transactionRepository
      .createQueryBuilder()
      .insert()
      .into(Transaction)
      .values([
        {
          bank: { id: body.bank },
          type: body.type,
          amount,
        },
      ])
      .execute();

    const { id } = insertResult.identifiers.shift();
    if (id && body.categories.length) {
      await this.transactionRepository
        .createQueryBuilder()
        .relation(Transaction, 'categories')
        .of(id)
        .add(body.categories);
    }

    this.createWebhook({ ...body, id });
    this.calculateBankBalance(body.bank);
  }

  async delete(id: string): Promise<void> {
    const transaction = await this.findById(id);

    if (!transaction) {
      throw new BadRequestException('Wrong transaction id');
    }

    await this.transactionRepository
      .createQueryBuilder()
      .delete()
      .from(Transaction)
      .where('id = :id', { id })
      .execute();

    this.calculateBankBalance(transaction.bank.id);
  }

  async findById(id: string): Promise<Transaction> {
    return await this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.bank', 'bank')
      .where({ id })
      .getOne();
  }

  async findAll(params: GetAllParamsDto): Promise<FindAllResponse> {
    const { limit, offset } = params;
    const [transactions, totalCount] = await this.transactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.categories', 'category')
      .orderBy('transaction.createdAt', 'DESC')
      .take(limit || findTransactionsDefaultLimit)
      .skip(offset || findTransactionsDefaultOffset)
      .getManyAndCount();

    return {
      transactions,
      meta: {
        totalCount,
      },
    };
  }

  async calculateBankBalance(bankId: string): Promise<void> {
    const { sum } = await this.transactionRepository
      .createQueryBuilder('transaction')
      .where({ bank: { id: bankId } })
      .select('SUM(transaction.amount)', 'sum')
      .getRawOne();

    await this.bankService.update(bankId, { balance: +sum });
  }

  async countTransactions(payload: CountTransactionsPayload): Promise<number> {
    const query = this.transactionRepository.createQueryBuilder('transaction');

    if (payload.bank) {
      query.andWhere('transaction.bankId = :bankId', { bankId: payload.bank });
    }

    if (payload.category) {
      query.innerJoin(
        'transaction.categories',
        'category',
        'category.id = :category',
        {
          category: payload.category,
        },
      );
    }

    return await query.getCount();
  }

  createWebhook(payload: TransactionWebhookPayload): void {
    this.httpService
      .post(this.configService.get('WEBHOOK_URL'), payload)
      .subscribe();
  }
}
