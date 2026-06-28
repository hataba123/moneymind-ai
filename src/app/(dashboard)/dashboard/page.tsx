import { DashboardClient } from "@/components/dashboard-client";
import { PageHeader } from "@/components/page-header";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Tổng quan thu chi tháng này, danh mục chi nhiều nhất và các giao dịch gần đây."
      />
      <DashboardClient />
    </>
  );
}
