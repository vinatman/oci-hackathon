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
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
