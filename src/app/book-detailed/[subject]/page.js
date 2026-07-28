"use client";

import { use } from "react";
import Link from "next/link";
import { useBookDetailed } from "../../BookDetailedContext";
const subjectIcons = {
  বাংলা: "📖",
  ইংরেজি: "🔤",
  গণিত: "🧮",
  বিজ্ঞান: "🔬",
};

const paperIcons = {
  first: "📘",
  second: "📗",
  general: "📚",
};

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
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-5">
          <Link
            href="/book-detailed"
            className="p-2 rounded-full hover:bg-[var(--color-app-primary-soft)]"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
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

          <h1 className="text-2xl font-bold">
            {subjectIcons[subject]} {subject}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjectData.papers.map((paper) => (
          <Link
            key={paper.id}
            href={`/book-detailed/${encodeURIComponent(subject)}/${paper.id}`}
            className="group rounded-3xl border border-[var(--color-app-border)]
  bg-[var(--color-app-surface)]
  p-5
  transition-all
  duration-300
  hover:-translate-y-1
  hover:shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">
                    {paperIcons[paper.id] || "📚"}
                  </span>

                  <h2 className="text-lg font-bold text-[var(--color-app-text)]">
                    {paper.title}
                  </h2>
                </div>

                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-[var(--color-app-primary-soft)] px-3 py-1">
                  <span>📚</span>

                  <span className="text-sm font-medium">
                    {paper.topics.length} টি টপিক
                  </span>
                </div>
              </div>

              <svg
                className="w-5 h-5 mt-2 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
