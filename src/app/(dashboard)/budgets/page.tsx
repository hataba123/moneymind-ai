import { BudgetsClient } from "@/components/budgets-client";
import { PageHeader } from "@/components/page-header";

export default function BudgetsPage() {
  return (
    <>
      <PageHeader
        title="Ngân sách"
        description="Theo dõi hạn mức theo danh mục."
      />
      <BudgetsClient />
    </>
  );
}
