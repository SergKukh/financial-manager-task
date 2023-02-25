import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { mockCategory } from '@common/mocks';

export class CreateCategoryDto {
  @ApiProperty({
    example: mockCategory.name,
    description: 'Category name',
  })
  @IsString()
  name: string;
}
