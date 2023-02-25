import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from '@common/entities';
import { mockCategory, mockRepository } from '@common/mocks';
import { TransactionService } from '@/modules/transaction/transaction.service';
import { CategoryService } from './category.service';

describe('CategoryService', () => {
  let service: CategoryService;

  const mockTransactionService = {
    countTransactions: jest.fn().mockImplementation(() => 0),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockRepository,
        },
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Delete category', () => {
    it('should delete category', async () => {
      jest.spyOn(mockRepository.createQueryBuilder(), 'delete');
      jest.spyOn(mockRepository.createQueryBuilder(), 'from');
      jest.spyOn(mockRepository.createQueryBuilder(), 'where');
      jest
        .spyOn(mockRepository.createQueryBuilder(), 'execute')
        .mockImplementation(() => ({ affected: 1 }));

      const id = mockCategory.id;
      await service.delete(id);

      expect(mockRepository.createQueryBuilder().delete).toHaveBeenCalledTimes(
        1,
      );
      expect(mockRepository.createQueryBuilder().from).toHaveBeenCalledWith(
        Category,
      );
      expect(mockRepository.createQueryBuilder().where).toHaveBeenCalledWith(
        'id = :id',
        { id },
      );
      expect(mockRepository.createQueryBuilder().execute).toHaveBeenCalledTimes(
        1,
      );
    });
  });

  it('wrong category id: should throw bad request exception', async () => {
    jest
      .spyOn(mockRepository.createQueryBuilder(), 'execute')
      .mockImplementation(() => ({ affected: 0 }));

    const id = mockCategory.id;

    await expect(service.delete(id)).rejects.toEqual(
      new BadRequestException('Wrong bank id'),
    );
  });

  it('category has transactions: should throw bad request exception', async () => {
    jest
      .spyOn(mockRepository.createQueryBuilder(), 'execute')
      .mockImplementation(() => ({ affected: 1 }));

    jest
      .spyOn(mockTransactionService, 'countTransactions')
      .mockImplementation(() => 1);

    const id = mockCategory.id;

    await expect(service.delete(id)).rejects.toEqual(
      new BadRequestException(`Can't delete category with transactions`),
    );
  });
});
