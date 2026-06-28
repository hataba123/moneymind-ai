import { BudgetsClient } from "@/components/budgets-client";
import { PageHeader } from "@/components/page-header";

export default function BudgetsPage() {
  return (
    <>
      <PageHeader
        title="Ngân sách"
        description="Thiết lập hạn mức theo danh mục và tháng, theo dõi mức sử dụng và cảnh báo vượt ngưỡng."
      />
      <BudgetsClient />
    </>
  );
}
