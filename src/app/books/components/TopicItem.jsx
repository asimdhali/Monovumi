"use client";

import Link from "next/link";
import { useState } from "react";
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
  deleteTopic,
  setEditingTopic,
  toBengaliNum,
  highlightMatch,
}) {
  const [showMenu, setShowMenu] = useState(false);

  function handleDelete() {
    const ok = window.confirm(
      `"${topic.title}" টপিকটি মুছে ফেলতে চান?\n\nএই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।`,
    );

    if (!ok) return;

    deleteTopic(subject, paperId, topic.id);
    setShowMenu(false);
  }

  return (
    <SortableTopic id={`${topic.id}-${index}`}>
      <li className="flex items-center gap-2 rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-bg)] px-3 py-2">
        {/* Topic Number */}
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
          onClick={() => setShowMenu(false)}
        >
          <span className="text-[13.5px] text-[var(--color-app-text)] hover:text-[var(--color-app-primary)] transition-colors">
            {highlightMatch(topic.title, q)}
          </span>
        </Link>

        {/* Management Menu */}
        {canManage && (
          <div className="relative flex-shrink-0">
            {/* Three Dot Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowMenu((prev) => !prev);
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-app-muted)] hover:bg-[var(--color-app-primary-soft)] transition"
              title="বিষয় অপশন"
              aria-label="টপিক অপশন"
            >
              ⋮
            </button>

            {/* Action Buttons */}
            {showMenu && (
              <div
                className="absolute right-0 bottom-10 z-30 flex items-center gap-1 rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-1.5 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Move Up */}
                <button
                  type="button"
                  onClick={() => {
                    moveTopicUp(subject, paperId, topic.id);
                    setShowMenu(false);
                  }}
                  className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-[var(--color-app-primary-soft)]"
                  title="উপরে নিন"
                >
                  ⬆️
                </button>

                {/* Move Down */}
                <button
                  type="button"
                  onClick={() => {
                    moveTopicDown(subject, paperId, topic.id);
                    setShowMenu(false);
                  }}
                  className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-[var(--color-app-primary-soft)]"
                  title="নিচে নামান"
                >
                  ⬇️
                </button>

                {/* Duplicate */}
                <button
                  type="button"
                  onClick={() => {
                    duplicateTopic(subject, paperId, topic.id);
                    setShowMenu(false);
                  }}
                  className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-[var(--color-app-primary-soft)]"
                  title="কপি করুন"
                >
                  📋
                </button>

                {/* Edit */}
                <button
                  type="button"
                  onClick={() => {
                    setEditingTopic(topic);
                    setShowMenu(false);
                  }}
                  className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-[var(--color-app-primary-soft)]"
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

                {/* Delete */}
                <button
                  type="button"
                  onClick={handleDelete}
                  className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-red-500/10"
                  title="ডিলিট"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 6h18" />
                    <path d="M8 6V4h8v2" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v5" />
                    <path d="M14 11v5" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
      </li>
    </SortableTopic>
  );
}
