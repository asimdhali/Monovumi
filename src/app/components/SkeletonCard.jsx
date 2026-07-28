export default function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-4 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-[var(--color-app-border)]" />

        <div className="flex-1">
          <div className="h-4 w-40 rounded bg-[var(--color-app-border)] mb-2" />
          <div className="h-3 w-28 rounded bg-[var(--color-app-border)]" />
        </div>
      </div>

      <div className="h-3 w-48 rounded bg-[var(--color-app-border)] mb-4" />

      <div className="h-5 w-2/3 rounded bg-[var(--color-app-border)] mb-4" />

      <div className="space-y-2 mb-4">
        <div className="h-3 rounded bg-[var(--color-app-border)]" />
        <div className="h-3 rounded bg-[var(--color-app-border)]" />
        <div className="h-3 w-4/5 rounded bg-[var(--color-app-border)]" />
      </div>
    </div>
  );
}
