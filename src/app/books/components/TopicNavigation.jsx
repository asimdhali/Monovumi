"use client";

import Link from "next/link";

export default function TopicNavigation({
  subject,
  paperId,
  previousTopic,
  nextTopic,
}) {
  return (
    <div className="mt-12 pt-6 border-t border-[var(--color-app-border)]">
      <div className="flex justify-between gap-4">
        <div className="flex-1">
          {previousTopic && (
            <Link
              href={`/books/${encodeURIComponent(subject)}/${paperId}/${previousTopic.id}`}
              className="block rounded-xl border border-[var(--color-app-border)] p-4 hover:border-[var(--color-app-primary)] transition"
            >
              <div className="text-xs text-[var(--color-app-muted)] mb-1">
                ← পূর্ববর্তী
              </div>

              <div className="font-semibold">{previousTopic.title}</div>
            </Link>
          )}
        </div>

        <div className="flex-1 text-right">
          {nextTopic && (
            <Link
              href={`/books/${encodeURIComponent(subject)}/${paperId}/${nextTopic.id}`}
              className="block rounded-xl border border-[var(--color-app-border)] p-4 hover:border-[var(--color-app-primary)] transition"
            >
              <div className="text-xs text-[var(--color-app-muted)] mb-1">
                পরবর্তী →
              </div>

              <div className="font-semibold">{nextTopic.title}</div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
