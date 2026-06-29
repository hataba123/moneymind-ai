import { DEFAULT_CATEGORIES } from "@/lib/constants";
import { createDeepSeekClient, DEEPSEEK_MODEL } from "@/lib/deepseek";

const rules: Array<{ category: string; keywords: string[] }> = [
  { category: "Ăn uống", keywords: ["ăn", "cơm", "bún", "phở", "trà sữa"] },
  { category: "Xăng xe / đi lại", keywords: ["xăng", "grab", "xe", "bus"] },
  { category: "Học hành", keywords: ["sách", "khóa học", "học phí"] },
  { category: "Mua sắm", keywords: ["áo", "quần", "giày", "shop"] },
];

export function suggestCategoryRuleBased(note: string) {
  const normalized = note.toLowerCase();
  const match = rules.find((rule) => rule.keywords.some((keyword) => normalized.includes(keyword)));
  return match?.category ?? "Ngoài lề";
}

export async function suggestCategory(note: string) {
  const deepseek = createDeepSeekClient();
  if (!deepseek) {
    return { category: suggestCategoryRuleBased(note), source: "rule-based" };
  }

  try {
    const result = await deepseek.chat.completions.create({
      model: DEEPSEEK_MODEL,
      messages: [
        {
          role: "system",
          content: `Chọn đúng một category trong danh sách sau: ${DEFAULT_CATEGORIES.join(", ")}. Chỉ trả về tên category.`,
        },
        { role: "user", content: note },
      ],
      temperature: 0,
    });
    const category = result.choices[0]?.message.content?.trim();
    return {
      category: category && DEFAULT_CATEGORIES.includes(category) ? category : suggestCategoryRuleBased(note),
      source: "deepseek",
    };
  } catch {
    return { category: suggestCategoryRuleBased(note), source: "rule-based" };
  }
}
