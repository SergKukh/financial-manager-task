export class CountTransactionsPayload {
  bank?: string;
  category?: string;
}

export class TransactionWebhookPayload {
  id: string;
  bank: string;
  type: string;
  amount: number;
  categories: string[];
}
