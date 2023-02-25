import { ApiProperty } from '@nestjs/swagger';
import { Transaction } from '@common/entities';
import { mockTransaction } from '@common/mocks';

export class FindAllResponse {
  @ApiProperty({
    example: mockTransaction,
  })
  transactions: Transaction[];

  @ApiProperty({
    example: { totalCount: 1 },
  })
  meta: {
    totalCount: number;
  };
}
