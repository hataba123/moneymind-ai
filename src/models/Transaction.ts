import mongoose, { Schema, model, models } from "mongoose";
import type { PaymentMethod, TransactionType } from "@/types/finance";

export type TransactionDocument = {
  _id: mongoose.Types.ObjectId;
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  note: string;
  transactionDate: Date;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  updatedAt: Date;
};

const TransactionSchema = new Schema<TransactionDocument>(
  {
    userId: { type: String, required: true, index: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    amount: { type: Number, required: true, min: 1 },
    category: { type: String, required: true },
    note: { type: String, default: "" },
    transactionDate: { type: Date, required: true },
    paymentMethod: { type: String, enum: ["cash", "bank", "momo", "other"], default: "cash" },
  },
  { timestamps: true },
);

TransactionSchema.index({ userId: 1, transactionDate: -1 });

export const TransactionModel =
  models.Transaction || model<TransactionDocument>("Transaction", TransactionSchema);
