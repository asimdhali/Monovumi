"use client";

import { use } from "react";
import Link from "next/link";
import { useBookDetailed } from "../../BookDetailedContext";

export default function SubjectPage({ params }) {
  const { subject: rawSubject } = use(params);
  const subject = decodeURIComponent(rawSubject);
  const { content } = useBookDetailed();

  const subjectData = content[subject];

  if (!subjectData) {
    return (
      <div className="max-w-3xl mx-auto px-4 lg:px-6 pt-6">
        <p className="text-[var(--color-app-muted)]">
          বিষয়টি খুঁজে পাওয়া যায়নি।
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 pt-6 pb-10">
      <div className="flex items-center gap-2 mb-5">
        <Link
          href="/book-detailed"
          className="p-1.5 -ml-1.5 rounded-full hover:bg-[var(--color-app-primary-soft)] transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="var(--color-app-text)"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        <h1 className="font-[family-name:var(--font-bengali-serif)] text-xl text-[var(--color-app-text)]">
          {subject}
        </h1>
      </div>

      <div className="space-y-2">
        {subjectData.papers.map((paper) => (
          <Link
            key={paper.id}
            href={`/book-detailed/${encodeURIComponent(subject)}/${paper.id}`}
            className="flex items-center justify-between rounded-xl border p-4 bg-[var(--color-app-surface)] border-[var(--color-app-border)] hover:shadow-md transition-shadow"
          >
            <div>
              <p className="text-sm font-medium text-[var(--color-app-text)]">
                {paper.title}
              </p>
              <p className="text-xs mt-0.5 text-[var(--color-app-muted)]">
                {paper.topics.length}টি টপিক
              </p>
            </div>
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="var(--color-app-muted)"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
