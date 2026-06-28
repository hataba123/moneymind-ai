import { connectMongoDB } from "@/lib/mongodb";
import { TransactionModel, type TransactionDocument } from "@/models/Transaction";
import { getUserStore } from "@/services/demoStore";
import type { TransactionDto } from "@/types/finance";
import type { z } from "zod";
import type { transactionFilterSchema, transactionSchema } from "@/validators/finance";

type TransactionInput = z.infer<typeof transactionSchema>;
type TransactionFilters = z.infer<typeof transactionFilterSchema>;

function serializeTransaction(transaction: TransactionDocument): TransactionDto {
  return {
    id: transaction._id.toString(),
    type: transaction.type,
    amount: transaction.amount,
    category: transaction.category,
    note: transaction.note,
    transactionDate: transaction.transactionDate.toISOString(),
    paymentMethod: transaction.paymentMethod,
    createdAt: transaction.createdAt.toISOString(),
    updatedAt: transaction.updatedAt.toISOString(),
  };
}

function filterInMemory(transactions: TransactionDto[], filters: TransactionFilters) {
  return transactions
    .filter((transaction) => !filters.type || transaction.type === filters.type)
    .filter((transaction) => !filters.category || transaction.category === filters.category)
    .filter((transaction) => !filters.search || transaction.note.toLowerCase().includes(filters.search.toLowerCase()))
    .filter((transaction) => !filters.startDate || new Date(transaction.transactionDate) >= filters.startDate)
    .filter((transaction) => !filters.endDate || new Date(transaction.transactionDate) <= filters.endDate)
    .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());
}

export async function listTransactions(userId: string, filters: TransactionFilters = {}) {
  const db = await connectMongoDB();
  if (!db) {
    return filterInMemory(getUserStore(userId).transactions, filters);
  }

  const query: Record<string, unknown> = { userId };
  if (filters.type) query.type = filters.type;
  if (filters.category) query.category = filters.category;
  if (filters.search) query.note = { $regex: filters.search, $options: "i" };
  if (filters.startDate || filters.endDate) {
    query.transactionDate = {
      ...(filters.startDate ? { $gte: filters.startDate } : {}),
      ...(filters.endDate ? { $lte: filters.endDate } : {}),
    };
  }

  const transactions = await TransactionModel.find(query).sort({ transactionDate: -1, createdAt: -1 }).limit(200);
  return transactions.map(serializeTransaction);
}

export async function createTransaction(userId: string, input: TransactionInput) {
  const db = await connectMongoDB();
  if (!db) {
    const item: TransactionDto = {
      id: crypto.randomUUID(),
      type: input.type,
      amount: input.amount,
      category: input.category,
      note: input.note,
      transactionDate: input.transactionDate.toISOString(),
      paymentMethod: input.paymentMethod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    getUserStore(userId).transactions.unshift(item);
    return item;
  }

  const created = await TransactionModel.create({ ...input, userId });
  return serializeTransaction(created);
}

export async function updateTransaction(userId: string, input: TransactionInput) {
  if (!input.id) {
    throw new Error("Missing transaction id");
  }

  const db = await connectMongoDB();
  if (!db) {
    const userStore = getUserStore(userId);
    const index = userStore.transactions.findIndex((transaction) => transaction.id === input.id);
    if (index === -1) {
      return null;
    }
    const updated: TransactionDto = {
      ...userStore.transactions[index],
      type: input.type,
      amount: input.amount,
      category: input.category,
      note: input.note,
      transactionDate: input.transactionDate.toISOString(),
      paymentMethod: input.paymentMethod,
      updatedAt: new Date().toISOString(),
    };
    userStore.transactions[index] = updated;
    return updated;
  }

  const updated = await TransactionModel.findOneAndUpdate(
    { _id: input.id, userId },
    { ...input, userId },
    { new: true },
  );

  return updated ? serializeTransaction(updated) : null;
}

export async function deleteTransaction(userId: string, id: string) {
  const db = await connectMongoDB();
  if (!db) {
    const userStore = getUserStore(userId);
    const before = userStore.transactions.length;
    userStore.transactions = userStore.transactions.filter((transaction) => transaction.id !== id);
    return userStore.transactions.length < before;
  }

  const result = await TransactionModel.deleteOne({ _id: id, userId });
  return result.deletedCount > 0;
}
