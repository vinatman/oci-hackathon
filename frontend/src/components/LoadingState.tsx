export function LoadingState({ label = "Loading Sports Connect" }: { label?: string }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center rounded border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-soft">
      <div className="h-3 w-3 animate-pulse rounded-full bg-action" aria-hidden />
      <span className="ml-3">{label}</span>
    </div>
  );
}
