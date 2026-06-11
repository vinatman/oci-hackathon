export function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded border border-coral/30 bg-coral/10 p-4 text-sm text-ink">
      <strong className="font-semibold">Something needs attention.</strong>
      <p className="mt-1">{message}</p>
    </div>
  );
}
