import { AiAssistantClient } from "@/components/ai-assistant-client";
import { PageHeader } from "@/components/page-header";

export default function AiAssistantPage() {
  return (
    <>
      <PageHeader
        title="AI Assistant"
        description="Hỏi trợ lý về thói quen chi tiêu, khoản vượt ngân sách và kế hoạch tiết kiệm tháng tới."
      />
      <AiAssistantClient />
    </>
  );
}
