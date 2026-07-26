"use client";

import { use } from "react";
import { useBookDetailed } from "../../../../BookDetailedContext";
import Link from "next/link";

export default function TopicPage({ params }) {
  const { subject: rawSubject, paperId, topicId } = use(params);

  const subject = decodeURIComponent(rawSubject);

  const { content } = useBookDetailed();

  const subjectData = content?.[subject];

  const paper = subjectData?.papers?.find((paper) => paper.id === paperId);

  const topic = paper?.topics?.find((topic) => String(topic.id) === topicId);

  if (!topic) {
    return <div className="max-w-3xl mx-auto p-6">Topic পাওয়া যায়নি।</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5">
      <Link
        href={`/book-detailed/${encodeURIComponent(subject)}/${paperId}`}
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

      <article
        className="leading-9 text-[18px]"
        dangerouslySetInnerHTML={{
          __html: topic.content || "",
        }}
      />
    </div>
  );
}
