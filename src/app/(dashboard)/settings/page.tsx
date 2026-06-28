import { PageHeader } from "@/components/page-header";
import { SettingsClient } from "@/components/settings-client";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Cài đặt"
        description="Tài khoản và danh mục cá nhân."
      />
      <SettingsClient />
    </>
  );
}
