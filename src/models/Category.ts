import mongoose, { Schema, model, models } from "mongoose";

export type CategoryDocument = {
  _id: mongoose.Types.ObjectId;
  userId: string;
  name: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const CategorySchema = new Schema<CategoryDocument>(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true },
);

CategorySchema.index({ userId: 1, name: 1 }, { unique: true });

export const CategoryModel = models.Category || model<CategoryDocument>("Category", CategorySchema);
