import { randomUUID } from "crypto";
import { DEFAULT_CATEGORIES, getCurrentMonthKey } from "@/lib/constants";
import type { AiAdviceLogDto, BudgetDto, CategoryDto, TransactionDto } from "@/types/finance";

type UserStore = {
  categories: CategoryDto[];
  transactions: TransactionDto[];
  budgets: BudgetDto[];
  adviceLogs: AiAdviceLogDto[];
};

const globalStore = globalThis as typeof globalThis & {
  moneyMindDemoStore?: Map<string, UserStore>;
};

const store = globalStore.moneyMindDemoStore ?? new Map<string, UserStore>();
globalStore.moneyMindDemoStore = store;

function nowIso() {
  return new Date().toISOString();
}

export function getUserStore(userId: string) {
  const existing = store.get(userId);
  if (existing) {
    return existing;
  }

  const created: UserStore = {
    categories: DEFAULT_CATEGORIES.map((name) => ({
      id: randomUUID(),
      name,
      isDefault: true,
    })),
    transactions: [],
    budgets: [],
    adviceLogs: [],
  };

  store.set(userId, created);
  return created;
}

export function seedDemoStore(userId: string) {
  const userStore = getUserStore(userId);
  const month = getCurrentMonthKey();
  const [year, monthNumber] = month.split("-").map(Number);
  const samples: Array<Omit<TransactionDto, "id" | "createdAt" | "updatedAt">> = [
    { type: "income", amount: 18000000, category: "Thu nhập", note: "Lương tháng", transactionDate: new Date(year, monthNumber - 1, 1).toISOString(), paymentMethod: "bank" },
    { type: "expense", amount: 35000, category: "Ăn uống", note: "ăn sáng 35k", transactionDate: new Date(year, monthNumber - 1, 2).toISOString(), paymentMethod: "cash" },
    { type: "expense", amount: 70000, category: "Xăng xe / đi lại", note: "đổ xăng 70k", transactionDate: new Date(year, monthNumber - 1, 3).toISOString(), paymentMethod: "cash" },
    { type: "expense", amount: 120000, category: "Học hành", note: "mua sách 120k", transactionDate: new Date(year, monthNumber - 1, 4).toISOString(), paymentMethod: "bank" },
    { type: "expense", amount: 450000, category: "Mua sắm", note: "mua áo", transactionDate: new Date(year, monthNumber - 1, 5).toISOString(), paymentMethod: "momo" },
    { type: "expense", amount: 98000, category: "Ăn uống", note: "cơm tối", transactionDate: new Date(year, monthNumber - 1, 6).toISOString(), paymentMethod: "cash" },
    { type: "expense", amount: 260000, category: "Ngoài lề", note: "quà sinh nhật", transactionDate: new Date(year, monthNumber - 1, 7).toISOString(), paymentMethod: "bank" },
    { type: "expense", amount: 180000, category: "Giải trí", note: "xem phim", transactionDate: new Date(year, monthNumber - 1, 8).toISOString(), paymentMethod: "momo" },
    { type: "expense", amount: 55000, category: "Ăn uống", note: "trà sữa", transactionDate: new Date(year, monthNumber - 1, 9).toISOString(), paymentMethod: "momo" },
    { type: "expense", amount: 300000, category: "Hóa đơn", note: "internet", transactionDate: new Date(year, monthNumber - 1, 10).toISOString(), paymentMethod: "bank" },
    { type: "expense", amount: 150000, category: "Sức khỏe", note: "thuốc cảm", transactionDate: new Date(year, monthNumber - 1, 11).toISOString(), paymentMethod: "cash" },
    { type: "expense", amount: 65000, category: "Xăng xe / đi lại", note: "grab đi làm", transactionDate: new Date(year, monthNumber - 1, 12).toISOString(), paymentMethod: "momo" },
    { type: "expense", amount: 220000, category: "Gia đình", note: "đồ dùng nhà", transactionDate: new Date(year, monthNumber - 1, 13).toISOString(), paymentMethod: "bank" },
    { type: "expense", amount: 89000, category: "Ăn uống", note: "bún bò", transactionDate: new Date(year, monthNumber - 1, 14).toISOString(), paymentMethod: "cash" },
    { type: "expense", amount: 600000, category: "Tiết kiệm", note: "chuyển quỹ dự phòng", transactionDate: new Date(year, monthNumber - 1, 15).toISOString(), paymentMethod: "bank" },
    { type: "income", amount: 1500000, category: "Thu nhập", note: "freelance", transactionDate: new Date(year, monthNumber - 1, 16).toISOString(), paymentMethod: "bank" },
    { type: "expense", amount: 130000, category: "Học hành", note: "khóa học online", transactionDate: new Date(year, monthNumber - 1, 17).toISOString(), paymentMethod: "bank" },
    { type: "expense", amount: 240000, category: "Mua sắm", note: "shop giày", transactionDate: new Date(year, monthNumber - 1, 18).toISOString(), paymentMethod: "momo" },
    { type: "expense", amount: 76000, category: "Ăn uống", note: "phở sáng", transactionDate: new Date(year, monthNumber - 1, 19).toISOString(), paymentMethod: "cash" },
    { type: "expense", amount: 115000, category: "Ngoài lề", note: "cà phê gặp bạn", transactionDate: new Date(year, monthNumber - 1, 20).toISOString(), paymentMethod: "cash" },
  ];

  userStore.transactions = samples.map((item) => ({
    ...item,
    id: randomUUID(),
    createdAt: nowIso(),
    updatedAt: nowIso(),
  }));

  userStore.budgets = ["Ăn uống", "Xăng xe / đi lại", "Học hành", "Mua sắm", "Ngoài lề"].map((category, index) => ({
    id: randomUUID(),
    category,
    month,
    amount: [1200000, 600000, 800000, 1000000, 700000][index],
    spent: 0,
    percentUsed: 0,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  }));

  return userStore;
}
