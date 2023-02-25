import { UpdateBankDto } from './dto';

export class UpdateBankPayload extends UpdateBankDto {
  balance?: number;
}
