import { PageHeader } from "@/components/page-header";
import { SettingsClient } from "@/components/settings-client";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Cài đặt"
        description="Xem thông tin tài khoản, quản lý danh mục mặc định và danh mục tùy chỉnh."
      />
      <SettingsClient />
    </>
  );
}
