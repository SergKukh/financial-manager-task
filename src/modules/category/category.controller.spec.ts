import { Test, TestingModule } from '@nestjs/testing';
import { mockCategory, mockStatisticResponse } from '@common/mocks';
import { CategoryController } from './category.controller';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { CategoryService } from './category.service';

describe('CategoryController', () => {
  let controller: CategoryController;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [CategoryService],
    })
      .overrideProvider(CategoryService)
      .useValue(mockCategoryService)
      .compile();

    controller = module.get<CategoryController>(CategoryController);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Create category', () => {
    it('should call create method in Category service', async () => {
      const body = { name: 'test' };
      await controller.createCategory(body);
      expect(mockCategoryService.create).toHaveBeenCalledWith(body);
    });
  });

  describe('Update category', () => {
    it('should call update method in Category service', async () => {
      const id = mockCategory.id;
      const body = { name: 'test' };
      await controller.updateCategory({ id }, body);
      expect(mockCategoryService.update).toHaveBeenCalledWith(id, body);
    });
  });

  describe('Delete category', () => {
    it('should call delete method in Category service', async () => {
      const id = mockCategory.id;
      await controller.deleteCategory({ id });
      expect(mockCategoryService.delete).toHaveBeenCalledWith(id);
    });
  });

  describe('Find category by id', () => {
    it('should call findById method in Category service', async () => {
      const id = mockCategory.id;
      await controller.getCategoryById({ id });
      expect(mockCategoryService.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('Find all categories', () => {
    it('should call findAll method in Category service', async () => {
      await controller.getAllCategories();
      expect(mockCategoryService.findAll).toHaveBeenCalledWith();
    });
  });

  describe('Get categories statistic', () => {
    it('should call getStatistic method in Category service', async () => {
      const params = { fromPeriod: '2023-02-23T20:26:48.202Z' };
      await controller.getStatistic(params);
      expect(mockCategoryService.getStatistic).toHaveBeenCalledWith(params);
    });
  });
});
