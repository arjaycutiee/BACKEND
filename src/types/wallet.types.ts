export interface TransactionInput {
  title: string;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  type: "income" | "expense";
}

export interface WalletSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}
