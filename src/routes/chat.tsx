import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { SendHorizontal } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Disclaimer, Markdown } from "@/components/ToolWorkspace";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { chatWithAssistant } from "@/lib/assistant.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Assistant Chat — Workplace AI" },
      {
        name: "description",
        content: "Chat with a workplace AI assistant for writing, planning and problem-solving.",
      },
      { property: "og:title", content: "Assistant Chat — Workplace AI" },
      {
        property: "og:description",
        content: "Open-ended AI help across your daily work tasks.",
      },
    ],
  }),
  component: ChatPage,
});

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Rewrite this update so it sounds more confident",
  "How should I structure a project kickoff agenda?",
  "Turn these notes into a status update for my manager",
];

function ChatPage() {
  const send = useServerFn(chatWithAssistant);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const result = await send({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: result.text }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The assistant is unavailable right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell title="Assistant Chat" breadcrumb="Tools">
      <div className="mx-auto flex h-[calc(100vh-3.5rem)] max-w-3xl flex-col px-4 sm:px-8">
        <div className="flex-1 space-y-6 overflow-y-auto py-8">
          {messages.length === 0 && (
            <div className="pt-10">
              <h1 className="text-2xl font-semibold tracking-tight">How can I help with work today?</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Ask anything, or start from one of these.
              </p>
              <div className="mt-6 space-y-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => submit(s)}
                    className="block w-full rounded-lg border border-border bg-surface px-4 py-3 text-left text-sm transition-colors hover:border-brand/40"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, i) =>
            message.role === "user" ? (
              <div key={i} className="flex justify-end">
                <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                  {message.content}
                </p>
              </div>
            ) : (
              <div key={i} className="rounded-2xl rounded-bl-sm border border-border bg-surface px-5 py-4">
                <Markdown text={message.content} />
              </div>
            ),
          )}

          {loading && (
            <div className="space-y-3 rounded-2xl rounded-bl-sm border border-border bg-surface px-5 py-4">
              <Skeleton className="h-3 w-3/5" />
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-3 w-2/5" />
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="space-y-2 border-t border-border bg-background py-4">
          <div className="flex items-end gap-2">
            <Textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit(input);
                }
              }}
              placeholder="Ask the assistant…"
              className="max-h-40 min-h-11 resize-none"
            />
            <Button
              size="icon"
              className="size-11 shrink-0"
              disabled={loading || !input.trim()}
              onClick={() => submit(input)}
              aria-label="Send message"
            >
              <SendHorizontal className="size-4" />
            </Button>
          </div>
          <Disclaimer />
        </div>
      </div>
    </AppShell>
  );
}
