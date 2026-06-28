import { DashboardClient } from "@/components/dashboard-client";
import { PageHeader } from "@/components/page-header";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Số liệu chính trong tháng hiện tại."
      />
      <DashboardClient />
    </>
  );
}
