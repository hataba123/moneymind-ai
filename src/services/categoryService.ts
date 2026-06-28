import { DEFAULT_CATEGORIES, PROTECTED_DEFAULT_CATEGORIES } from "@/lib/constants";
import { connectMongoDB } from "@/lib/mongodb";
import { CategoryModel, type CategoryDocument } from "@/models/Category";
import { getUserStore } from "@/services/demoStore";
import type { CategoryDto } from "@/types/finance";

function serializeCategory(category: CategoryDocument): CategoryDto {
  return {
    id: category._id.toString(),
    name: category.name,
    isDefault: category.isDefault,
  };
}

export async function ensureDefaultCategories(userId: string) {
  const db = await connectMongoDB();
  if (!db) {
    return getUserStore(userId).categories;
  }

  await Promise.all(
    DEFAULT_CATEGORIES.map((name) =>
      CategoryModel.updateOne(
        { userId, name },
        { $setOnInsert: { userId, name, isDefault: true } },
        { upsert: true },
      ),
    ),
  );

  const categories = await CategoryModel.find({ userId }).sort({ isDefault: -1, name: 1 });
  return categories.map(serializeCategory);
}

export async function listCategories(userId: string) {
  return ensureDefaultCategories(userId);
}

export async function addCategory(userId: string, name: string) {
  const db = await connectMongoDB();
  if (!db) {
    const userStore = getUserStore(userId);
    const existing = userStore.categories.find((category) => category.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      return existing;
    }
    const category = { id: crypto.randomUUID(), name, isDefault: false };
    userStore.categories.push(category);
    return category;
  }

  const category = await CategoryModel.findOneAndUpdate(
    { userId, name },
    { $setOnInsert: { userId, name, isDefault: false } },
    { upsert: true, new: true },
  );
  return serializeCategory(category);
}

export async function deleteCategory(userId: string, id: string) {
  const db = await connectMongoDB();
  if (!db) {
    const userStore = getUserStore(userId);
    const category = userStore.categories.find((item) => item.id === id);
    if (!category || category.isDefault || PROTECTED_DEFAULT_CATEGORIES.has(category.name)) {
      return false;
    }
    userStore.categories = userStore.categories.filter((item) => item.id !== id);
    return true;
  }

  const category = await CategoryModel.findOne({ _id: id, userId });
  if (!category || category.isDefault || PROTECTED_DEFAULT_CATEGORIES.has(category.name)) {
    return false;
  }

  await CategoryModel.deleteOne({ _id: id, userId });
  return true;
}
