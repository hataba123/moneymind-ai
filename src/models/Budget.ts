import mongoose, { Schema, model, models } from "mongoose";

export type BudgetDocument = {
  _id: mongoose.Types.ObjectId;
  userId: string;
  category: string;
  month: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
};

const BudgetSchema = new Schema<BudgetDocument>(
  {
    userId: { type: String, required: true, index: true },
    category: { type: String, required: true },
    month: { type: String, required: true },
    amount: { type: Number, required: true, min: 1 },
  },
  { timestamps: true },
);

BudgetSchema.index({ userId: 1, category: 1, month: 1 }, { unique: true });

export const BudgetModel = models.Budget || model<BudgetDocument>("Budget", BudgetSchema);
