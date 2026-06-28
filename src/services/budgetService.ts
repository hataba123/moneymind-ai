import { getCurrentMonthKey } from "@/lib/constants";
import { connectMongoDB } from "@/lib/mongodb";
import { BudgetModel, type BudgetDocument } from "@/models/Budget";
import { getUserStore } from "@/services/demoStore";
import { listTransactions } from "@/services/transactionService";
import type { BudgetDto } from "@/types/finance";
import type { z } from "zod";
import type { budgetSchema } from "@/validators/finance";

type BudgetInput = z.infer<typeof budgetSchema>;

function baseSerializeBudget(budget: BudgetDocument): Omit<BudgetDto, "spent" | "percentUsed"> {
  return {
    id: budget._id.toString(),
    category: budget.category,
    month: budget.month,
    amount: budget.amount,
    createdAt: budget.createdAt.toISOString(),
    updatedAt: budget.updatedAt.toISOString(),
  };
}

async function withSpent(userId: string, budgets: Array<Omit<BudgetDto, "spent" | "percentUsed">>) {
  const transactions = await listTransactions(userId);
  return budgets.map((budget) => {
    const [year, month] = budget.month.split("-").map(Number);
    const spent = transactions
      .filter((transaction) => transaction.type === "expense")
      .filter((transaction) => transaction.category === budget.category)
      .filter((transaction) => {
        const date = new Date(transaction.transactionDate);
        return date.getFullYear() === year && date.getMonth() + 1 === month;
      })
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    return {
      ...budget,
      spent,
      percentUsed: budget.amount > 0 ? Math.round((spent / budget.amount) * 100) : 0,
    };
  });
}

export async function listBudgets(userId: string, month = getCurrentMonthKey()) {
  const db = await connectMongoDB();
  if (!db) {
    const budgets = getUserStore(userId).budgets
      .filter((budget) => budget.month === month)
      .map((budget) => ({
        id: budget.id,
        category: budget.category,
        month: budget.month,
        amount: budget.amount,
        createdAt: budget.createdAt,
        updatedAt: budget.updatedAt,
      }));
    return withSpent(userId, budgets);
  }

  const budgets = await BudgetModel.find({ userId, month }).sort({ category: 1 });
  return withSpent(userId, budgets.map(baseSerializeBudget));
}

export async function upsertBudget(userId: string, input: BudgetInput) {
  const db = await connectMongoDB();
  if (!db) {
    const userStore = getUserStore(userId);
    const existingIndex = userStore.budgets.findIndex(
      (budget) => budget.id === input.id || (budget.category === input.category && budget.month === input.month),
    );
    const budget: BudgetDto = {
      id: input.id || userStore.budgets[existingIndex]?.id || crypto.randomUUID(),
      category: input.category,
      month: input.month,
      amount: input.amount,
      spent: 0,
      percentUsed: 0,
      createdAt: userStore.budgets[existingIndex]?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (existingIndex >= 0) {
      userStore.budgets[existingIndex] = budget;
    } else {
      userStore.budgets.push(budget);
    }
    return (await withSpent(userId, [budget]))[0];
  }

  const budget = await BudgetModel.findOneAndUpdate(
    { userId, category: input.category, month: input.month },
    { userId, category: input.category, month: input.month, amount: input.amount },
    { upsert: true, new: true },
  );
  return (await withSpent(userId, [baseSerializeBudget(budget)]))[0];
}
