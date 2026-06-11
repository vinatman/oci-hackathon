import { Bot, SendHorizontal } from "lucide-react";
import { useState } from "react";
import { api } from "../api/client";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

export function AssistantChatPanel({
  userId,
  context,
  onSuggestedFilters
}: {
  userId: string;
  context?: Record<string, unknown>;
  onSuggestedFilters?: (filters: Record<string, unknown>) => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Try: Find me a bar near me showing the Lakers game."
    }
  ]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  const send = async () => {
    const text = draft.trim();
    if (!text) {
      return;
    }
    setDraft("");
    setMessages((current) => [...current, { role: "user", text }]);
    setSending(true);
    try {
      const response = await api.sendAssistantMessage(userId, { message: text, context });
      if (response.suggestedFilters && typeof response.suggestedFilters === "object") {
        onSuggestedFilters?.(response.suggestedFilters as Record<string, unknown>);
      }
      setMessages((current) => [
        ...current,
        { role: "assistant", text: typeof response.reply === "string" ? response.reply : "Done." }
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        { role: "assistant", text: error instanceof Error ? error.message : "Assistant request failed." }
      ]);
    } finally {
      setSending(false);
    }
  };

  if (import.meta.env.VITE_ENABLE_ASSISTANT === "false") {
    return null;
  }

  return (
    <section className="rounded border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex items-center gap-2">
        <Bot className="h-5 w-5 text-action" aria-hidden />
        <h2 className="text-base font-semibold text-ink">Assistant</h2>
      </div>
      <div className="mt-4 grid max-h-72 gap-3 overflow-y-auto pr-1">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={[
              "rounded px-3 py-2 text-sm",
              message.role === "user" ? "ml-8 bg-action text-white" : "mr-8 bg-field text-slate-700"
            ].join(" ")}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              void send();
            }
          }}
          placeholder="Ask about venues, games, tickets"
          className="focus-ring min-w-0 flex-1 rounded border border-slate-300 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() => void send()}
          disabled={sending}
          className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded bg-ink text-white disabled:opacity-60"
          aria-label="Send assistant message"
        >
          <SendHorizontal className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </section>
  );
}
