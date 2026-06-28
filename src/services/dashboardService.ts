import { getCurrentMonthKey } from "@/lib/constants";
import { listTransactions } from "@/services/transactionService";
import type { DashboardSummary } from "@/types/finance";

export async function getDashboardSummary(userId: string): Promise<DashboardSummary> {
  const month = getCurrentMonthKey();
  const [year, monthNumber] = month.split("-").map(Number);
  const transactions = await listTransactions(userId);
  const thisMonth = transactions.filter((transaction) => {
    const date = new Date(transaction.transactionDate);
    return date.getFullYear() === year && date.getMonth() + 1 === monthNumber;
  });

  const incomeThisMonth = thisMonth
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const expenseThisMonth = thisMonth
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const balance = incomeThisMonth - expenseThisMonth;
  const savingRate = incomeThisMonth > 0 ? Math.round((balance / incomeThisMonth) * 100) : 0;

  const categoryTotals = new Map<string, number>();
  const dailyTotals = new Map<string, { date: string; income: number; expense: number }>();

  for (const transaction of thisMonth) {
    const dateKey = new Date(transaction.transactionDate).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
    const daily = dailyTotals.get(dateKey) ?? { date: dateKey, income: 0, expense: 0 };
    daily[transaction.type] += transaction.amount;
    dailyTotals.set(dateKey, daily);

    if (transaction.type === "expense") {
      categoryTotals.set(transaction.category, (categoryTotals.get(transaction.category) ?? 0) + transaction.amount);
    }
  }

  const categoryChart = Array.from(categoryTotals, ([category, amount]) => ({ category, amount })).sort(
    (a, b) => b.amount - a.amount,
  );

  return {
    incomeThisMonth,
    expenseThisMonth,
    balance,
    savingRate,
    topExpenseCategories: categoryChart.slice(0, 5),
    recentTransactions: transactions.slice(0, 8),
    categoryChart,
    dailyChart: Array.from(dailyTotals.values()),
  };
}
