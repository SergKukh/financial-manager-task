import { ApiProperty } from '@nestjs/swagger';
import { mockCategory } from '@common/mocks';

export class GetCategoryByIdResponseDto {
  @ApiProperty({
    example: mockCategory.id,
  })
  id: string;

  @ApiProperty({
    example: mockCategory.name,
  })
  name: string;

  @ApiProperty({
    example: mockCategory.createdAt,
  })
  createdAt: string;
}
