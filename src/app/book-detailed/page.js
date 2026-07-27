"use client";

import Link from "next/link";
import { bookDetailedSubjects } from "../data";
import { useBookDetailed } from "../BookDetailedContext";
import { buildHomeFeed } from "../services/homeFeedHelper";

const subjectIcons = {
  বাংলা: "📖",
  ইংরেজি: "🔤",
  গণিত: "🧮",
  বিজ্ঞান: "🔬",
};

export default function BookDetailedPage() {
  const { content } = useBookDetailed();

  const feed = buildHomeFeed(content);
  console.log("CONTENT =", content);
  console.log("FEED =", feed);
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
      {/* সর্বশেষ আপডেট */}

      <div className="mt-10">
        <h2 className="text-lg font-bold mb-4">📢 সর্বশেষ আপডেট</h2>

        {feed.length === 0 ? (
          <div className="text-sm text-[var(--color-app-muted)]">
            এখনো কোনো পোস্ট নেই।
          </div>
        ) : (
          <div className="space-y-4">
            {feed.map((post) => (
              <div
                key={post.id}
                className="rounded-2xl border bg-[var(--color-app-surface)] border-[var(--color-app-border)] p-4"
              >
                <div className="text-xs text-[var(--color-app-muted)] mb-2">
                  📖 {post.subject} &gt; {post.paperTitle} &gt; {post.era}
                </div>

                <h3 className="font-bold text-lg">{post.title}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
