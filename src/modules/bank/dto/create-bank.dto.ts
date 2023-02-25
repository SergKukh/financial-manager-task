import { mockBank } from '@/common/mocks';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateBankDto {
  @ApiProperty({
    example: mockBank.name,
    description: 'Bank name',
  })
  @IsString()
  name: string;
}
