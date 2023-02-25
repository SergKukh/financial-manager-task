import { mockBank } from '@/common/mocks';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateBankDto {
  @ApiProperty({
    example: mockBank.name,
    description: 'Bank name',
  })
  @IsOptional()
  @IsString()
  name?: string;
}
