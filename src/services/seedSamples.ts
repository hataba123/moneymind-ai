import { getCurrentMonthKey } from "@/lib/constants";
import type { z } from "zod";
import type { budgetSchema, transactionSchema } from "@/validators/finance";

type TransactionInput = z.infer<typeof transactionSchema>;
type BudgetInput = z.infer<typeof budgetSchema>;

const month = getCurrentMonthKey();
const [year, monthNumber] = month.split("-").map(Number);

function date(day: number) {
  return new Date(year, monthNumber - 1, day);
}

export const seedSamples: { transactions: TransactionInput[]; budgets: BudgetInput[] } = {
  transactions: [
    { type: "income", amount: 18000000, category: "Thu nhập", note: "Lương tháng", transactionDate: date(1), paymentMethod: "bank" },
    { type: "expense", amount: 35000, category: "Ăn uống", note: "ăn sáng 35k", transactionDate: date(2), paymentMethod: "cash" },
    { type: "expense", amount: 70000, category: "Xăng xe / đi lại", note: "đổ xăng 70k", transactionDate: date(3), paymentMethod: "cash" },
    { type: "expense", amount: 120000, category: "Học hành", note: "mua sách 120k", transactionDate: date(4), paymentMethod: "bank" },
    { type: "expense", amount: 450000, category: "Mua sắm", note: "mua áo", transactionDate: date(5), paymentMethod: "momo" },
    { type: "expense", amount: 98000, category: "Ăn uống", note: "cơm tối", transactionDate: date(6), paymentMethod: "cash" },
    { type: "expense", amount: 260000, category: "Ngoài lề", note: "quà sinh nhật", transactionDate: date(7), paymentMethod: "bank" },
    { type: "expense", amount: 180000, category: "Giải trí", note: "xem phim", transactionDate: date(8), paymentMethod: "momo" },
    { type: "expense", amount: 55000, category: "Ăn uống", note: "trà sữa", transactionDate: date(9), paymentMethod: "momo" },
    { type: "expense", amount: 300000, category: "Hóa đơn", note: "internet", transactionDate: date(10), paymentMethod: "bank" },
    { type: "expense", amount: 150000, category: "Sức khỏe", note: "thuốc cảm", transactionDate: date(11), paymentMethod: "cash" },
    { type: "expense", amount: 65000, category: "Xăng xe / đi lại", note: "grab đi làm", transactionDate: date(12), paymentMethod: "momo" },
    { type: "expense", amount: 220000, category: "Gia đình", note: "đồ dùng nhà", transactionDate: date(13), paymentMethod: "bank" },
    { type: "expense", amount: 89000, category: "Ăn uống", note: "bún bò", transactionDate: date(14), paymentMethod: "cash" },
    { type: "expense", amount: 600000, category: "Tiết kiệm", note: "chuyển quỹ dự phòng", transactionDate: date(15), paymentMethod: "bank" },
    { type: "income", amount: 1500000, category: "Thu nhập", note: "freelance", transactionDate: date(16), paymentMethod: "bank" },
    { type: "expense", amount: 130000, category: "Học hành", note: "khóa học online", transactionDate: date(17), paymentMethod: "bank" },
    { type: "expense", amount: 240000, category: "Mua sắm", note: "shop giày", transactionDate: date(18), paymentMethod: "momo" },
    { type: "expense", amount: 76000, category: "Ăn uống", note: "phở sáng", transactionDate: date(19), paymentMethod: "cash" },
    { type: "expense", amount: 115000, category: "Ngoài lề", note: "cà phê gặp bạn", transactionDate: date(20), paymentMethod: "cash" },
  ],
  budgets: [
    { category: "Ăn uống", month, amount: 1200000 },
    { category: "Xăng xe / đi lại", month, amount: 600000 },
    { category: "Học hành", month, amount: 800000 },
    { category: "Mua sắm", month, amount: 1000000 },
    { category: "Ngoài lề", month, amount: 700000 },
  ],
};
