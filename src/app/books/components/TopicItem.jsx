"use client";

import Link from "next/link";
import SortableTopic from "./SortableTopic";

export default function TopicItem({
  topic,
  index,
  q,
  canManage,
  subject,
  paperId,
  moveTopicUp,
  moveTopicDown,
  duplicateTopic,
  setEditingTopic,
  toBengaliNum,
  highlightMatch,
}) {
  return (
    <SortableTopic id={topic.id}>
      <li className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-colors bg-[var(--color-app-bg)] border border-[var(--color-app-border)] hover:border-[var(--color-app-primary)]">
        <span
          className="font-[family-name:var(--font-bengali-serif)] text-xs flex-shrink-0 w-6"
          style={{ color: "var(--color-app-accent)" }}
        >
          {toBengaliNum(index + 1)}
        </span>

        {/* শুধু Title-ই Link */}
        <Link
          href={`/books/${encodeURIComponent(subject)}/${paperId}/${topic.id}`}
          className="flex-1 min-w-0"
        >
          <span className="text-[13.5px] text-[var(--color-app-text)] hover:text-[var(--color-app-primary)] transition-colors">
            {highlightMatch(topic.title, q)}
          </span>
        </Link>

        {canManage && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => moveTopicUp(subject, paperId, topic.id)}
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[var(--color-app-primary-soft)]"
              title="উপরে নিন"
            >
              ⬆️
            </button>

            <button
              onClick={() => moveTopicDown(subject, paperId, topic.id)}
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[var(--color-app-primary-soft)]"
              title="নিচে নামান"
            >
              ⬇️
            </button>

            <button
              onClick={() => duplicateTopic(subject, paperId, topic.id)}
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[var(--color-app-primary-soft)]"
              title="কপি করুন"
            >
              📋
            </button>

            <button
              onClick={() => setEditingTopic(topic)}
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[var(--color-app-primary-soft)]"
              title="সম্পাদনা"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="var(--color-app-primary)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" />
                <path d="M17.5 3.5a2.12 2.12 0 013 3L11 16l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          </div>
        )}
      </li>
    </SortableTopic>
  );
}
