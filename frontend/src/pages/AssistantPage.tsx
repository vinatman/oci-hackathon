import { AssistantChatPanel } from "../components/AssistantChatPanel";
import { PageHeader } from "../components/PageHeader";
import { useDemoUser } from "../hooks/useDemoUser";

export function AssistantPage() {
  const { userId } = useDemoUser();

  if (!userId) {
    return null;
  }

  return (
    <>
      <PageHeader title="Assistant Panel" eyebrow="Rule-based helper" />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <AssistantChatPanel userId={userId} />
        <aside className="rounded border border-slate-200 bg-white p-4 shadow-soft">
          <h2 className="text-base font-semibold text-ink">Example queries</h2>
          <ul className="mt-3 grid gap-2 text-sm text-slate-600">
            <li>Find me a bar near me showing the Lakers game.</li>
            <li>Show restaurants instead of bars.</li>
            <li>What soccer games are coming up?</li>
            <li>Where can I watch the Cowboys this weekend?</li>
            <li>Save the top venue.</li>
            <li>Show ticket options.</li>
          </ul>
        </aside>
      </div>
    </>
  );
}
