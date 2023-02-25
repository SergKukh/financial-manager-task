import * as request from 'supertest';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mockCategory, mockStatisticResponse } from '@common/mocks';
import { CategoryService } from '@/modules/category/category.service';
import { CategoryController } from '@/modules/category/category.controller';
import { CreateCategoryDto, UpdateCategoryDto } from '@/modules/category/dto';

describe('CategoryController (e2e)', () => {
  let app: INestApplication;

  const mockCategoryService = {
    create: jest
      .fn()
      .mockImplementation((body: CreateCategoryDto) => ({ ...body })),
    update: jest
      .fn()
      .mockImplementation((id: string, body: UpdateCategoryDto) => ({
        ...body,
        id,
      })),
    delete: jest.fn().mockImplementation((id: string) => ({ id })),
    findById: jest
      .fn()
      .mockImplementation((id: string) => ({ ...mockCategory, id })),
    findAll: jest.fn().mockImplementation(() => [mockCategory]),
    getStatistic: jest.fn().mockImplementation(() => mockStatisticResponse),
  };

  const dto = { name: 'test' };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: mockCategoryService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  describe('/category (POST) create category', () => {
    it('should create category', () => {
      return request(app.getHttpServer())
        .post('/category')
        .send(dto)
        .expect(HttpStatus.CREATED)
        .expect(mockCategoryService.create(dto));
    });

    it('wrong name type: should return status code 400', () => {
      return request(app.getHttpServer())
        .post('/category')
        .send({ name: 1 })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/category/:id (PUT) update category', () => {
    it('should update category', () => {
      return request(app.getHttpServer())
        .put(`/category/${mockCategory.id}`)
        .send(dto)
        .expect(HttpStatus.OK)
        .expect({ ...dto, id: mockCategory.id });
    });

    it('wrong name type: should return status code 400', () => {
      return request(app.getHttpServer())
        .put(`/category/${mockCategory.id}`)
        .send({ name: 1 })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/category/:id (DELETE) category category', () => {
    it('should delete category', () => {
      return request(app.getHttpServer())
        .delete(`/category/${mockCategory.id}`)
        .expect(HttpStatus.OK);
    });
  });

  describe('/category/:id (GET) get category by id', () => {
    it('should return category by id', () => {
      return request(app.getHttpServer())
        .get(`/category/${mockCategory.id}`)
        .expect(HttpStatus.OK)
        .expect(mockCategoryService.findById(mockCategory.id));
    });
  });

  describe('/category (GET) get all categories', () => {
    it('should return all categories', () => {
      return request(app.getHttpServer())
        .get(`/category`)
        .expect(HttpStatus.OK)
        .expect(mockCategoryService.findAll());
    });
  });

  describe('/category/statistic (GET) get statistic by categories', () => {
    it('should return statistic by categories', () => {
      return request(app.getHttpServer())
        .get(`/category/statistic`)
        .expect(HttpStatus.OK)
        .expect(mockCategoryService.getStatistic());
    });

    it('wrong categories: should return status code 400', () => {
      return request(app.getHttpServer())
        .get(`/category/statistic`)
        .query({ categoryIds: [1] })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('wrong date type: should return status code 400', () => {
      return request(app.getHttpServer())
        .get(`/category/statistic`)
        .query({ fromPeriod: '2409402' })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
