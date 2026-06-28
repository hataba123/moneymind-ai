export type TransactionType = "income" | "expense";
export type PaymentMethod = "cash" | "bank" | "momo" | "other";

export type CategoryDto = {
  id: string;
  name: string;
  isDefault: boolean;
};

export type TransactionDto = {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  note: string;
  transactionDate: string;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
};

export type BudgetDto = {
  id: string;
  category: string;
  month: string;
  amount: number;
  spent: number;
  percentUsed: number;
  createdAt: string;
  updatedAt: string;
};

export type DashboardSummary = {
  incomeThisMonth: number;
  expenseThisMonth: number;
  balance: number;
  savingRate: number;
  topExpenseCategories: Array<{ category: string; amount: number }>;
  recentTransactions: TransactionDto[];
  categoryChart: Array<{ category: string; amount: number }>;
  dailyChart: Array<{ date: string; income: number; expense: number }>;
};

export type AiAdviceLogDto = {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
};
