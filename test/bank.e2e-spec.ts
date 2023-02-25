import * as request from 'supertest';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mockBank } from '@common/mocks';
import { BankController } from '@/modules/bank/bank.controller';
import { BankService } from '@/modules/bank/bank.service';
import { CreateBankDto, UpdateBankDto } from '@/modules/bank/dto';

describe('BankController (e2e)', () => {
  let app: INestApplication;

  const mockBankService = {
    create: jest
      .fn()
      .mockImplementation((body: CreateBankDto) => ({ ...body })),
    update: jest.fn().mockImplementation((id: string, body: UpdateBankDto) => ({
      ...body,
      id,
    })),
    delete: jest.fn().mockImplementation((id: string) => ({ id })),
    findById: jest
      .fn()
      .mockImplementation((id: string) => ({ ...mockBank, id })),
    findAll: jest.fn().mockImplementation(() => [mockBank]),
  };

  const dto = { name: 'test' };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [BankController],
      providers: [
        {
          provide: BankService,
          useValue: mockBankService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  describe('/bank (POST) create bank', () => {
    it('should create bank', () => {
      return request(app.getHttpServer())
        .post('/bank')
        .send(dto)
        .expect(HttpStatus.CREATED)
        .expect(mockBankService.create(dto));
    });

    it('wrong name type: should return status code 400', () => {
      return request(app.getHttpServer())
        .post('/bank')
        .send({ name: 1 })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/bank/:id (PUT) update bank', () => {
    it('should update bank', () => {
      return request(app.getHttpServer())
        .put(`/bank/${mockBank.id}`)
        .send(dto)
        .expect(HttpStatus.OK)
        .expect({ ...dto, id: mockBank.id });
    });

    it('wrong name type: should return status code 400', () => {
      return request(app.getHttpServer())
        .put(`/bank/${mockBank.id}`)
        .send({ name: 1 })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/bank/:id (DELETE) delete bank', () => {
    it('should delete bank', () => {
      return request(app.getHttpServer())
        .delete(`/bank/${mockBank.id}`)
        .expect(HttpStatus.OK);
    });
  });

  describe('/bank/:id (GET) get bank by id', () => {
    it('should return bank by id', () => {
      return request(app.getHttpServer())
        .get(`/bank/${mockBank.id}`)
        .expect(HttpStatus.OK)
        .expect(mockBankService.findById(mockBank.id));
    });
  });

  describe('/bank (GET) get all bank', () => {
    it('should return all bank', () => {
      return request(app.getHttpServer())
        .get(`/bank`)
        .expect(HttpStatus.OK)
        .expect(mockBankService.findAll());
    });
  });
});
