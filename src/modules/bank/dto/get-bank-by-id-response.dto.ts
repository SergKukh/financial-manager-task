import { mockBank } from '@/common/mocks';
import { ApiProperty } from '@nestjs/swagger';

export class GetBankByIdResponseDto {
  @ApiProperty({
    example: mockBank.id,
  })
  id: string;

  @ApiProperty({
    example: mockBank.name,
  })
  name: string;

  @ApiProperty({
    example: mockBank.balance,
  })
  balance: number;

  @ApiProperty({
    example: mockBank.createdAt,
  })
  createdAt: string;
}
