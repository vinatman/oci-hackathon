import type { ReactNode } from "react";

export function PageHeader({ title, eyebrow, children }: { title: string; eyebrow?: string; children?: ReactNode }) {
  return (
    <header className="mb-5 flex flex-col gap-3 sm:mb-6 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.12em] text-action">{eyebrow}</p> : null}
        <h1 className="mt-1 text-2xl font-semibold text-ink sm:text-3xl">{title}</h1>
      </div>
      {children ? <div className="flex flex-wrap items-center gap-2">{children}</div> : null}
    </header>
  );
}
