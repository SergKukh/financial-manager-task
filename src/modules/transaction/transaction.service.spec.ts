import { Test, TestingModule } from '@nestjs/testing';
import { Transaction } from '@common/entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import {
  mockBank,
  mockCategory,
  mockRepository,
  mockTransaction,
} from '@common/mocks';
import { TransactionType } from '@common/types';
import { BankService } from '@/modules/bank/bank.service';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto';
import { UpdateBankDto } from '../bank/dto';

describe('TransactionService', () => {
  let service: TransactionService;

  const mockBankService = {
    update: jest.fn().mockImplementation((id: string, body: UpdateBankDto) => ({
      ...body,
      id,
    })),
  };
  const mockHttpService = {
    post: jest.fn(() => of({})),
  };
  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string) => key),
  };

  const payload: CreateTransactionDto = {
    bank: mockBank.id,
    type: TransactionType.PROFITABLE,
    amount: 1000,
    categories: [mockCategory.id],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockRepository,
        },
        {
          provide: BankService,
          useValue: mockBankService,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);

    jest
      .spyOn(mockRepository.createQueryBuilder(), 'execute')
      .mockImplementation(() => ({
        identifiers: [{ id: mockTransaction.id }],
      }));
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create transaction', () => {
    it('should create transaction', async () => {
      jest.spyOn(mockRepository.createQueryBuilder(), 'insert');
      jest.spyOn(mockRepository.createQueryBuilder(), 'into');
      jest.spyOn(mockRepository.createQueryBuilder(), 'values');

      await service.create(payload);

      expect(mockRepository.createQueryBuilder().insert).toHaveBeenCalledTimes(
        1,
      );
      expect(mockRepository.createQueryBuilder().into).toHaveBeenCalledWith(
        Transaction,
      );
      expect(mockRepository.createQueryBuilder().values).toHaveBeenCalledWith([
        {
          bank: { id: payload.bank },
          type: payload.type,
          amount: payload.amount,
        },
      ]);
      expect(mockRepository.createQueryBuilder().execute).toHaveBeenCalledTimes(
        1,
      );
    });

    it('if transaction consumable should set negative amount', async () => {
      jest.spyOn(mockRepository.createQueryBuilder(), 'values');

      const body: CreateTransactionDto = {
        ...payload,
        type: TransactionType.CONSUMABLE,
      };

      await service.create(body);

      expect(mockRepository.createQueryBuilder().values).toHaveBeenCalledWith([
        {
          bank: { id: body.bank },
          type: body.type,
          amount: -body.amount,
        },
      ]);
    });

    it('should create relation with categories', async () => {
      jest.spyOn(mockRepository.createQueryBuilder(), 'relation');
      jest.spyOn(mockRepository.createQueryBuilder(), 'of');
      jest.spyOn(mockRepository.createQueryBuilder(), 'add');

      await service.create(payload);

      expect(mockRepository.createQueryBuilder().relation).toHaveBeenCalledWith(
        Transaction,
        'categories',
      );
      expect(mockRepository.createQueryBuilder().of).toHaveBeenCalledWith(
        mockTransaction.id,
      );
      expect(mockRepository.createQueryBuilder().add).toHaveBeenCalledWith(
        payload.categories,
      );
    });

    it('should call calculate bank balance', async () => {
      jest.spyOn(service, 'calculateBankBalance');
      await service.create(payload);

      expect(service.calculateBankBalance).toBeCalled();
    });

    it('should call webhook create', async () => {
      jest.spyOn(service, 'createWebhook');
      await service.create(payload);

      expect(service.createWebhook).toBeCalled();
    });
  });
});
