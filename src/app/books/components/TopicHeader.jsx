"use client";

import Link from "next/link";

export default function TopicHeader({ subject, paperId, topic }) {
  return (
    <>
      <Link
        href={`/books/${encodeURIComponent(subject)}/${paperId}`}
        className="inline-flex items-center gap-2 text-sm text-[var(--color-app-muted)] hover:text-[var(--color-app-primary)] transition mb-5"
      >
        ← পত্রে ফিরে যান
      </Link>

      <div className="mb-6">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-app-primary-soft)] text-[var(--color-app-primary)]">
          {topic.era}
        </span>

        {topic.chapter && (
          <span className="ml-2 text-sm text-[var(--color-app-muted)]">
            {topic.chapter}
          </span>
        )}
      </div>

      <h1 className="text-4xl font-bold leading-tight mb-4">{topic.title}</h1>

      <div className="flex items-center gap-3 mb-8">
        {topic.contributorAvatar && (
          <img
            src={topic.contributorAvatar}
            alt={topic.contributor}
            className="w-11 h-11 rounded-full object-cover"
          />
        )}

        <div>
          <div className="font-semibold">{topic.contributor || "মনোভূমি"}</div>

          <div className="text-sm text-[var(--color-app-muted)]">
            Contributor
          </div>
        </div>
      </div>
    </>
  );
}
