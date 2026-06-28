"use client";

import { useCallback, useEffect, useState } from "react";
import { Send } from "lucide-react";
import type { AiAdviceLogDto } from "@/types/finance";

const prompts = [
  "Tháng này tôi chi nhiều nhất vào đâu?",
  "Tôi có thể tiết kiệm bao nhiêu?",
  "Khoản nào đang vượt ngân sách?",
];

export function AiAssistantClient() {
  const [logs, setLogs] = useState<AiAdviceLogDto[]>([]);
  const [question, setQuestion] = useState(prompts[0]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const loadLogs = useCallback(async () => {
    setLoading(true);
    const response = await fetch("/api/ai");
    const data = (await response.json()) as { logs?: AiAdviceLogDto[]; error?: string };
    if (!response.ok) {
      setError(data.error ?? "Không thể tải lịch sử");
    } else {
      setLogs(data.logs ?? []);
    }
    setLoading(false);
  }, []);

  async function ask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setError("");
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const data = (await response.json()) as { log?: AiAdviceLogDto; error?: string };
    if (!response.ok || !data.log) {
      setError(data.error ?? "Không thể hỏi AI");
    } else {
      setLogs((current) => [data.log as AiAdviceLogDto, ...current]);
      setQuestion("");
    }
    setSending(false);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadLogs();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadLogs]);

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
      <section className="money-card rounded-lg p-5">
        <h2 className="font-semibold text-slate-950">Hỏi MoneyMind AI</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {prompts.map((prompt) => (
            <button key={prompt} type="button" onClick={() => setQuestion(prompt)} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-teal-300">
              {prompt}
            </button>
          ))}
        </div>
        <form onSubmit={ask} className="mt-5 space-y-3">
          <textarea
            className="focus-ring min-h-36 w-full rounded-md border border-slate-200 p-3"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Nhập câu hỏi về tài chính tháng này..."
            required
          />
          {error && <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
          <button disabled={sending} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-slate-950 font-semibold text-white hover:bg-slate-800 disabled:opacity-60">
            <Send size={17} /> {sending ? "Đang phân tích..." : "Gửi câu hỏi"}
          </button>
        </form>
      </section>
      <section className="money-card rounded-lg p-5">
        <h2 className="font-semibold text-slate-950">Lịch sử tư vấn</h2>
        <div className="mt-4 space-y-4">
          {loading ? <p className="text-sm text-slate-500">Đang tải...</p> : logs.length ? logs.map((log) => (
            <article key={log.id} className="rounded-md border border-slate-100 bg-white p-4">
              <p className="font-semibold text-slate-950">{log.question}</p>
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">{log.answer}</p>
              <p className="mt-3 text-xs text-slate-400">{new Date(log.createdAt).toLocaleString("vi-VN")}</p>
            </article>
          )) : (
            <div className="rounded-md bg-slate-50 p-8 text-center text-sm text-slate-500">Chưa có lịch sử tư vấn.</div>
          )}
        </div>
      </section>
    </div>
  );
}
