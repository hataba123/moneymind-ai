import { PageHeader } from "@/components/page-header";
import { TransactionsClient } from "@/components/transactions-client";

export default function TransactionsPage() {
  return (
    <>
      <PageHeader
        title="Giao dịch"
        description="Thêm, sửa, xóa và lọc các khoản thu chi. Ghi chú có thể được AI gợi ý danh mục."
      />
      <TransactionsClient />
    </>
  );
}
