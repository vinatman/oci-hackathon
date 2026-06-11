export function PremiumBadge({ active }: { active: boolean }) {
  if (!active) {
    return null;
  }

  return (
    <span className="inline-flex items-center rounded bg-amberline/15 px-2.5 py-1 text-xs font-semibold text-amber-800">
      Premium active: ads hidden
    </span>
  );
}
