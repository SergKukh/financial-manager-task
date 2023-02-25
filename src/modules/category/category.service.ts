import { Repository } from 'typeorm';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '@common/entities';
import { TransactionService } from '@/modules/transaction/transaction.service';
import {
  CreateCategoryDto,
  GetStatisticParamsDto,
  GetStatisticResponseDto,
  UpdateCategoryDto,
} from './dto';
import { ICategoryBalance } from './types';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private transactionService: TransactionService,
  ) {}

  async create(payload: CreateCategoryDto): Promise<void> {
    await this.categoryRepository
      .createQueryBuilder()
      .insert()
      .into(Category)
      .values([payload])
      .execute();
  }

  async update(id: string, payload: UpdateCategoryDto): Promise<void> {
    const result = await this.categoryRepository
      .createQueryBuilder()
      .update(Category)
      .set(payload)
      .where('id = :id', { id })
      .execute();

    if (!result.affected) {
      throw new BadRequestException('Wrong category id');
    }
  }

  async delete(id: string): Promise<void> {
    const transactions = await this.transactionService.countTransactions({
      category: id,
    });

    if (transactions) {
      throw new BadRequestException(`Can't delete category with transactions`);
    }

    const result = await this.categoryRepository
      .createQueryBuilder()
      .delete()
      .from(Category)
      .where('id = :id', { id })
      .execute();

    if (!result.affected) {
      throw new BadRequestException('Wrong category id');
    }
  }

  async findById(id: string): Promise<Category> {
    return await this.categoryRepository
      .createQueryBuilder('category')
      .where({ id })
      .getOne();
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository
      .createQueryBuilder('category')
      .orderBy('name', 'ASC')
      .getMany();
  }

  async getStatistic(
    params: GetStatisticParamsDto,
  ): Promise<GetStatisticResponseDto> {
    const query = this.categoryRepository
      .createQueryBuilder('category')
      .leftJoin('category.transactions', 'transaction')
      .groupBy('category.id')
      .select('category.name')
      .addSelect('SUM(transaction.amount)', 'balance')
      .orderBy('category.name', 'ASC');

    const { categoryIds, fromPeriod, toPeriod } = params;

    if (categoryIds) {
      query.andWhere('category.id IN (:...categoryIds)', { categoryIds });
    }

    if (fromPeriod) {
      query.andWhere('transaction.createdAt >= :fromPeriod', { fromPeriod });
    }

    if (toPeriod) {
      query.andWhere('transaction.createdAt <= :toPeriod', { toPeriod });
    }

    const data = await query.getRawMany<ICategoryBalance>();

    return data.reduce((obj, { category_name, balance }) => {
      obj[category_name] = balance;
      return obj;
    }, {});
  }
}
