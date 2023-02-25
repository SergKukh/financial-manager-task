import { mockCategory } from '@/common/mocks';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({
    example: mockCategory.name,
    description: 'Category name',
  })
  @IsOptional()
  @IsString()
  name?: string;
}
