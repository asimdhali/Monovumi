"use client";

import { useState } from "react";

export default function TopicPreviewModal({ topic, subject, onClose }) {
  const [liked, setLiked] = useState(false);
  const [likeCount] = useState(() => Math.floor(Math.random() * 25) + 4);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[95] px-4">
      <div className="bg-[var(--color-app-surface)] rounded-2xl w-full max-w-md sm:max-w-lg max-h-[90vh] sm:max-h-[80vh] overflow-y-auto p-4 sm:p-6 mx-2">
        <div className="flex items-start justify-between gap-3 mb-3">
          <span
            className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full"
            style={{
              background: "var(--color-app-accent-soft)",
              color: "var(--color-app-accent)",
            }}
          >
            {subject} · {topic.chapter || topic.era}
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[var(--color-app-primary-soft)] flex-shrink-0"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {topic.contributor && (
          <div className="flex items-center gap-2 mb-3">
            {topic.contributorAvatar && (
              <img
                src={topic.contributorAvatar}
                alt={topic.contributor}
                className="w-6 h-6 rounded-full object-cover"
                style={{ boxShadow: "0 0 0 1.5px var(--color-app-accent)" }}
              />
            )}
            <span className="text-xs font-semibold text-[var(--color-app-muted)]">
              👑 {topic.contributor}
            </span>
          </div>
        )}

        <h3 className="font-[family-name:var(--font-bengali-serif)] text-xl text-[var(--color-app-text)] mb-3">
          {topic.title}
        </h3>
        <p className="text-sm leading-[1.9] text-[var(--color-app-text)] whitespace-pre-wrap mb-5">
          {topic.content}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-[var(--color-app-border)]">
          <button
            onClick={() => setLiked(!liked)}
            className="flex items-center gap-1.5 text-sm font-medium"
            style={{ color: liked ? "#e0637a" : "var(--color-app-muted)" }}
          >
            <svg
              className="w-[17px] h-[17px]"
              fill={liked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {likeCount + (liked ? 1 : 0)}
          </button>
          <button
            onClick={() => alert("মন্তব্য সেকশন শীঘ্রই আসছে")}
            className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-app-muted)]"
          >
            <svg
              className="w-[17px] h-[17px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
            </svg>
            মন্তব্য
          </button>
          <button
            onClick={() => alert("শেয়ার শীঘ্রই আসছে")}
            className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-app-muted)]"
          >
            <svg
              className="w-[17px] h-[17px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
            </svg>
            শেয়ার
          </button>
        </div>
      </div>
    </div>
  );
}
