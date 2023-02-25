import { mockCategory } from '@/common/mocks';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

export class GetStatisticParamsDto {
  @ApiPropertyOptional({ example: [mockCategory.id] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[];

  @ApiPropertyOptional({ example: '2023-02-23T10:28:24.038Z' })
  @IsOptional()
  @IsDateString()
  fromPeriod?: string;

  @ApiPropertyOptional({ example: '2023-02-24T20:28:24.038Z' })
  @IsOptional()
  @IsDateString()
  toPeriod?: string;
}
