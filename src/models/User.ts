import mongoose, { Schema, model, models } from "mongoose";

export type UserDocument = {
  _id: mongoose.Types.ObjectId;
  email: string;
  name?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
};

const UserSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String },
    image: { type: String },
  },
  { timestamps: true },
);

export const UserModel = models.User || model<UserDocument>("User", UserSchema);
