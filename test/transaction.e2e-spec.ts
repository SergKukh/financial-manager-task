import * as request from 'supertest';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mockBank, mockCategory, mockTransaction } from '@common/mocks';
import { TransactionController } from '@/modules/transaction/transaction.controller';
import { TransactionService } from '@/modules/transaction/transaction.service';
import { CreateTransactionDto } from '@/modules/transaction/dto';
import { TransactionType } from '@/common/types';

describe('TransactionController (e2e)', () => {
  let app: INestApplication;

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

  const dto: CreateTransactionDto = {
    bank: mockBank.id,
    type: TransactionType.CONSUMABLE,
    amount: 1000,
    categories: [mockCategory.id],
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  describe('/transaction (POST) create transaction', () => {
    it('should create transaction', () => {
      return request(app.getHttpServer())
        .post('/transaction')
        .send(dto)
        .expect(HttpStatus.CREATED)
        .expect(mockTransactionService.create(dto));
    });

    it('wrong bank id: should return status code 400', () => {
      return request(app.getHttpServer())
        .post('/transaction')
        .send({ ...dto, bank: 1 })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('wrong transaction type: should return status code 400', () => {
      return request(app.getHttpServer())
        .post('/transaction')
        .send({ ...dto, type: 'test' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('wrong amount: should return status code 400', () => {
      return request(app.getHttpServer())
        .post('/transaction')
        .send({ ...dto, amount: 'test' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('categories are not array: should return status code 400', () => {
      return request(app.getHttpServer())
        .post('/transaction')
        .send({ ...dto, categories: mockCategory.id })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('category is not string: should return status code 400', () => {
      return request(app.getHttpServer())
        .post('/transaction')
        .send({ ...dto, categories: [1] })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/transaction/:id (DELETE) delete transaction', () => {
    it('should delete transaction', () => {
      return request(app.getHttpServer())
        .delete(`/transaction/${mockTransaction.id}`)
        .expect(HttpStatus.OK);
    });
  });

  describe('/transaction (GET) get all transactions', () => {
    it('should return all transactions', () => {
      return request(app.getHttpServer())
        .get(`/transaction`)
        .expect(HttpStatus.OK)
        .expect(mockTransactionService.findAll());
    });
  });
});
