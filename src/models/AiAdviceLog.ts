import mongoose, { Schema, model, models } from "mongoose";

export type AiAdviceLogDocument = {
  _id: mongoose.Types.ObjectId;
  userId: string;
  question: string;
  answer: string;
  createdAt: Date;
  updatedAt: Date;
};

const AiAdviceLogSchema = new Schema<AiAdviceLogDocument>(
  {
    userId: { type: String, required: true, index: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { timestamps: true },
);

export const AiAdviceLogModel =
  models.AiAdviceLog || model<AiAdviceLogDocument>("AiAdviceLog", AiAdviceLogSchema);
