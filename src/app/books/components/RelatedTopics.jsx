"use client";

import Link from "next/link";

export default function RelatedTopics({
  subject,
  paperId,
  currentTopicId,
  topics,
}) {
  const relatedTopics = topics
    .filter((topic) => String(topic.id) !== String(currentTopicId))
    .slice(0, 5);

  if (relatedTopics.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold mb-4">আরও পড়ুন</h2>

      <div className="space-y-3">
        {relatedTopics.map((topic) => (
          <Link
            key={topic.id}
            href={`/books/${encodeURIComponent(subject)}/${paperId}/${topic.id}`}
            className="block rounded-xl border border-[var(--color-app-border)] p-4 hover:border-[var(--color-app-primary)] transition"
          >
            <div className="font-semibold">{topic.title}</div>

            {topic.chapter && (
              <div className="text-sm text-[var(--color-app-muted)] mt-1">
                {topic.chapter}
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
