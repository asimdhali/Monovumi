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

        <div className="rounded-3xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-6">
          <p className="text-lg font-bold">{subject} বিষয়</p>

          <p className="text-sm mt-2 text-[var(--color-app-muted)]">
            প্রথম ও দ্বিতীয় পত্রের সকল অধ্যায় এখানে সাজানো রয়েছে।
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 bg-[var(--color-app-primary-soft)]">
            📚 মোট{" "}
            {subjectData.papers.reduce((sum, p) => sum + p.topics.length, 0)} টি
            টপিক
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                <div className="text-4xl mb-3">
                  {paperIcons[paper.id] || "📚"}
                </div>

                <h2 className="text-lg font-bold">{paper.title}</h2>

                <div className="mt-3 inline-flex items-center rounded-full px-3 py-1 bg-[var(--color-app-primary-soft)] text-sm">
                  📖 {paper.topics.length} টি টপিক
                </div>

                {paper.topics.length > 0 && (
                  <div className="mt-4 space-y-1">
                    {paper.topics.slice(0, 3).map((topic) => (
                      <div
                        key={topic.id}
                        className="text-sm text-[var(--color-app-muted)]"
                      >
                        • {topic.title}
                      </div>
                    ))}
                  </div>
                )}
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

            <div className="mt-5 pt-4 border-t border-[var(--color-app-border)] font-semibold text-[var(--color-app-primary)]">
              প্রবেশ করুন →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
