import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { useDemoUser } from "../hooks/useDemoUser";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";

export function AppShell({ children }: { children: ReactNode }) {
  const { user, loading, error } = useDemoUser();

  if (loading) {
    return (
      <main className="min-h-screen bg-field p-6">
        <LoadingState />
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="min-h-screen bg-field p-6">
        <ErrorState message={error ?? "Your profile is unavailable."} />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-field lg:flex">
      <Sidebar />
      <main className="mx-auto w-full min-w-0 max-w-[1480px] flex-1 px-3 pb-28 pt-4 sm:px-5 lg:px-8 lg:py-8">
        {children}
      </main>
    </div>
  );
}
