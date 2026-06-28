import { z } from "zod";

export const transactionSchema = z.object({
  id: z.string().optional(),
  type: z.enum(["income", "expense"]),
  amount: z.coerce.number().positive("Amount phải lớn hơn 0"),
  category: z.string().trim().min(1, "Category là bắt buộc"),
  note: z.string().trim().max(300).optional().default(""),
  transactionDate: z.coerce.date(),
  paymentMethod: z.enum(["cash", "bank", "momo", "other"]),
});

export const transactionFilterSchema = z.object({
  type: z.enum(["income", "expense"]).optional(),
  category: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  search: z.string().optional(),
});

export const budgetSchema = z.object({
  id: z.string().optional(),
  category: z.string().trim().min(1),
  month: z.string().regex(/^\d{4}-\d{2}$/),
  amount: z.coerce.number().positive(),
});

export const categorySchema = z.object({
  name: z.string().trim().min(2).max(60),
});

export const aiQuestionSchema = z.object({
  question: z.string().trim().min(3).max(500),
});
