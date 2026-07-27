"use client";

import Link from "next/link";
import { bookDetailedSubjects } from "../data";

const subjectIcons = {
  বাংলা: "📖",
  ইংরেজি: "🔤",
  গণিত: "🧮",
  বিজ্ঞান: "🔬",
};

export default function BookDetailedPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-6 pt-6 pb-10">
      <div className="mb-6">
        <h1 className="font-[family-name:var(--font-bengali-serif)] text-2xl text-[var(--color-app-text)]">
          বই বিস্তারিত
        </h1>

        <p className="text-sm mt-1 text-[var(--color-app-muted)]">
          প্রাচীনকাল থেকে আধুনিক কাল — যুগ অনুযায়ী সাজানো নোট ও পাঠ্যবিষয়
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {bookDetailedSubjects.map((subject) => (
          <Link
            key={subject}
            href={`/book-detailed/${encodeURIComponent(subject)}`}
            className="text-center rounded-2xl border p-6 bg-[var(--color-app-surface)] border-[var(--color-app-border)] hover:shadow-md transition-shadow"
          >
            <div className="text-4xl mb-2">{subjectIcons[subject]}</div>

            <p className="font-semibold text-sm text-[var(--color-app-text)]">
              {subject}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
