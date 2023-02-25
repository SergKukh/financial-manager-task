import { Test, TestingModule } from '@nestjs/testing';
import { mockBank, mockCategory, mockTransaction } from '@common/mocks';
import { TransactionType } from '@common/types';
import { CreateTransactionDto } from './dto';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

describe('TransactionController', () => {
  let controller: TransactionController;

  const mockTransactionService = {
    create: jest
      .fn()
      .mockImplementation((body: CreateTransactionDto) => ({ ...body })),
    delete: jest.fn().mockImplementation((id: string) => ({ id })),
    findAll: jest.fn().mockImplementation(() => ({
      transactions: [mockTransaction],
      meta: {
        totalCount: 1,
      },
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [TransactionService],
    })
      .overrideProvider(TransactionService)
      .useValue(mockTransactionService)
      .compile();

    controller = module.get<TransactionController>(TransactionController);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Create transaction', () => {
    it('should call create method in Transaction service', async () => {
      const body: CreateTransactionDto = {
        bank: mockBank.id,
        type: TransactionType.CONSUMABLE,
        amount: 1000,
        categories: [mockCategory.id],
      };
      await controller.createTransaction(body);
      expect(mockTransactionService.create).toHaveBeenCalledWith(body);
    });
  });

  describe('Delete bank', () => {
    it('should call delete method in Transaction service', async () => {
      const id = mockBank.id;
      await controller.deleteTransaction({ id });
      expect(mockTransactionService.delete).toHaveBeenCalledWith(id);
    });
  });
});
