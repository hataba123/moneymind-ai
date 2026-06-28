import OpenAI from "openai";
import { connectMongoDB } from "@/lib/mongodb";
import { AiAdviceLogModel, type AiAdviceLogDocument } from "@/models/AiAdviceLog";
import { listBudgets } from "@/services/budgetService";
import { getDashboardSummary } from "@/services/dashboardService";
import { getUserStore } from "@/services/demoStore";
import type { AiAdviceLogDto } from "@/types/finance";

function serializeLog(log: AiAdviceLogDocument): AiAdviceLogDto {
  return {
    id: log._id.toString(),
    question: log.question,
    answer: log.answer,
    createdAt: log.createdAt.toISOString(),
  };
}

function buildRuleBasedAnswer(question: string, summary: Awaited<ReturnType<typeof getDashboardSummary>>, budgets: Awaited<ReturnType<typeof listBudgets>>) {
  const top = summary.topExpenseCategories[0];
  const overBudget = budgets.filter((budget) => budget.percentUsed >= 100);
  const warningBudget = budgets.filter((budget) => budget.percentUsed >= 80 && budget.percentUsed < 100);
  const savingSuggestion = Math.max(0, Math.round(summary.expenseThisMonth * 0.1));

  return [
    `Bạn hỏi: "${question}".`,
    top ? `Tháng này bạn chi nhiều nhất vào ${top.category} với ${top.amount.toLocaleString("vi-VN")}đ.` : "Tháng này chưa có đủ dữ liệu chi tiêu.",
    `Tổng thu là ${summary.incomeThisMonth.toLocaleString("vi-VN")}đ, tổng chi là ${summary.expenseThisMonth.toLocaleString("vi-VN")}đ, tỷ lệ tiết kiệm khoảng ${summary.savingRate}%.`,
    savingSuggestion > 0 ? `Gợi ý nhanh: thử giảm 10% các khoản chi linh hoạt để tiết kiệm thêm khoảng ${savingSuggestion.toLocaleString("vi-VN")}đ.` : "Khi có thêm giao dịch, MoneyMind AI sẽ gợi ý mức tiết kiệm cụ thể hơn.",
    overBudget.length ? `Đã vượt ngân sách: ${overBudget.map((item) => item.category).join(", ")}.` : "Chưa có ngân sách nào vượt 100%.",
    warningBudget.length ? `Cần chú ý các danh mục trên 80%: ${warningBudget.map((item) => item.category).join(", ")}.` : "Chưa có danh mục nào chạm ngưỡng cảnh báo 80%.",
  ].join("\n");
}

export async function createAiAdvice(userId: string, question: string) {
  const summary = await getDashboardSummary(userId);
  const budgets = await listBudgets(userId);
  let answer = buildRuleBasedAnswer(question, summary, budgets);

  if (process.env.OPENAI_API_KEY) {
    try {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Bạn là trợ lý tài chính cá nhân tiếng Việt. Phân tích ngắn gọn, thực tế, không đưa lời khuyên đầu tư rủi ro. Dựa trên dữ liệu JSON được cung cấp.",
          },
          {
            role: "user",
            content: JSON.stringify({ question, summary, budgets }),
          },
        ],
        temperature: 0.3,
      });
      answer = completion.choices[0]?.message.content?.trim() || answer;
    } catch {
      answer += "\n\nOpenAI tạm thời không khả dụng, câu trả lời trên dùng logic fallback.";
    }
  }

  const db = await connectMongoDB();
  if (!db) {
    const log: AiAdviceLogDto = {
      id: crypto.randomUUID(),
      question,
      answer,
      createdAt: new Date().toISOString(),
    };
    getUserStore(userId).adviceLogs.unshift(log);
    return log;
  }

  const log = await AiAdviceLogModel.create({ userId, question, answer });
  return serializeLog(log);
}

export async function listAiAdviceLogs(userId: string) {
  const db = await connectMongoDB();
  if (!db) {
    return getUserStore(userId).adviceLogs.slice(0, 20);
  }

  const logs = await AiAdviceLogModel.find({ userId }).sort({ createdAt: -1 }).limit(20);
  return logs.map(serializeLog);
}
