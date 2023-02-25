import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Bank } from '@common/entities';
import { mockBank, mockRepository } from '@common/mocks';
import { TransactionService } from '@/modules/transaction/transaction.service';
import { BankService } from './bank.service';

describe('BankService', () => {
  let service: BankService;

  const mockTransactionService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BankService,
        {
          provide: getRepositoryToken(Bank),
          useValue: mockRepository,
        },
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
      ],
    }).compile();

    service = module.get<BankService>(BankService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create bank', () => {
    it('should create bank', async () => {
      jest.spyOn(mockRepository.createQueryBuilder(), 'insert');
      jest.spyOn(mockRepository.createQueryBuilder(), 'into');
      jest.spyOn(mockRepository.createQueryBuilder(), 'execute');
      jest.spyOn(mockRepository.createQueryBuilder(), 'values');

      const payload = { name: 'test' };
      await service.create(payload);

      expect(mockRepository.createQueryBuilder().insert).toHaveBeenCalledTimes(
        1,
      );
      expect(mockRepository.createQueryBuilder().into).toHaveBeenCalledWith(
        Bank,
      );
      expect(mockRepository.createQueryBuilder().values).toHaveBeenCalledWith([
        payload,
      ]);
      expect(mockRepository.createQueryBuilder().execute).toHaveBeenCalledTimes(
        1,
      );
    });
  });

  describe('Update bank', () => {
    it('should update bank', async () => {
      jest.spyOn(mockRepository.createQueryBuilder(), 'update');
      jest.spyOn(mockRepository.createQueryBuilder(), 'set');
      jest.spyOn(mockRepository.createQueryBuilder(), 'where');
      jest
        .spyOn(mockRepository.createQueryBuilder(), 'execute')
        .mockImplementation(() => ({ affected: 1 }));

      const id = mockBank.id;
      const payload = { name: 'test' };
      await service.update(id, payload);

      expect(mockRepository.createQueryBuilder().update).toHaveBeenCalledWith(
        Bank,
      );
      expect(mockRepository.createQueryBuilder().set).toHaveBeenCalledWith(
        payload,
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

  it('wrong bank id: should throw bad request exception', async () => {
    jest
      .spyOn(mockRepository.createQueryBuilder(), 'execute')
      .mockImplementation(() => ({ affected: 0 }));

    const id = mockBank.id;
    const payload = { name: 'test' };

    await expect(service.update(id, payload)).rejects.toEqual(
      new BadRequestException('Wrong bank id'),
    );
  });
});
