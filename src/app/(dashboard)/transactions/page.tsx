import { PageHeader } from "@/components/page-header";
import { TransactionsClient } from "@/components/transactions-client";

export default function TransactionsPage() {
  return (
    <>
      <PageHeader
        title="Giao dịch"
        description="Quản lý thu chi và lọc nhanh khi cần đối soát."
      />
      <TransactionsClient />
    </>
  );
}
