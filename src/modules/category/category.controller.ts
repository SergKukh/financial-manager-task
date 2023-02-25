import { Post, Body, Put, Param, Delete, Get, Query } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Category } from '@common/entities';
import { FindById } from '@common/types';
import { mockStatisticResponse } from '@common/mocks';
import { CategoryService } from './category.service';
import {
  CreateCategoryDto,
  GetCategoryByIdResponseDto,
  GetStatisticParamsDto,
  GetStatisticResponseDto,
  UpdateCategoryDto,
} from './dto';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Create category' })
  @Post('/')
  createCategory(@Body() body: CreateCategoryDto): Promise<void> {
    return this.categoryService.create(body);
  }

  @ApiOperation({ summary: 'Update category by id' })
  @Put('/:id')
  updateCategory(
    @Param() params: FindById,
    @Body() body: UpdateCategoryDto,
  ): Promise<void> {
    return this.categoryService.update(params.id, body);
  }

  @ApiOperation({ summary: 'Delete category by id' })
  @Delete('/:id')
  deleteCategory(@Param() params: FindById): Promise<void> {
    return this.categoryService.delete(params.id);
  }

  @ApiOperation({ summary: 'Get statistic by categories' })
  @ApiResponse({
    schema: {
      example: mockStatisticResponse,
    },
  })
  @Get('/statistic')
  getStatistic(
    @Query() params: GetStatisticParamsDto,
  ): Promise<GetStatisticResponseDto> {
    return this.categoryService.getStatistic(params);
  }

  @ApiOperation({ summary: 'Find category by id' })
  @ApiResponse({ type: GetCategoryByIdResponseDto })
  @Get('/:id')
  getCategoryById(@Param() params: FindById): Promise<Category> {
    return this.categoryService.findById(params.id);
  }

  @ApiOperation({ summary: 'Find all categories' })
  @ApiResponse({ type: [GetCategoryByIdResponseDto] })
  @Get('/')
  getAllCategories(): Promise<Category[]> {
    return this.categoryService.findAll();
  }
}
