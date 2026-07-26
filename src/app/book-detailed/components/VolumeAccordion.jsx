"use client";

export default function VolumeAccordion({ children }) {
  return (
    <div
      className="rounded-2xl border mb-3 overflow-hidden
      bg-[var(--color-app-surface)]
      border-[var(--color-app-border)]"
    >
      {children}
    </div>
  );
}
