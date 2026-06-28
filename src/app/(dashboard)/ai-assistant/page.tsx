import { AiAssistantClient } from "@/components/ai-assistant-client";
import { PageHeader } from "@/components/page-header";

export default function AiAssistantPage() {
  return (
    <>
      <PageHeader
        title="AI Assistant"
        description="Phân tích nhanh từ dữ liệu thu chi của bạn."
      />
      <AiAssistantClient />
    </>
  );
}
