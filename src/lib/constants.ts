export const DEFAULT_CATEGORIES = [
  "Ăn uống",
  "Xăng xe / đi lại",
  "Mua sắm",
  "Học hành",
  "Giải trí",
  "Sức khỏe",
  "Hóa đơn",
  "Gia đình",
  "Ngoài lề",
  "Thu nhập",
  "Tiết kiệm",
];

export const PROTECTED_DEFAULT_CATEGORIES = new Set(["Thu nhập", "Tiết kiệm", "Ăn uống"]);

export const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

export function getCurrentMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}
