"use client";

import { useAuth } from "../../AuthContext";
import { use, useState } from "react";
import Link from "next/link";
import { useBookDetailed } from "../../BookDetailedContext";
import HomeFeedSkeleton from "@/app/components/HomeFeedSkeleton";

const subjectIcons = {
  "বাংলা সাহিত্য": "📖",
  "বাংলা ভাষা": "🔤",
  "ইংরেজি সাহিত্য": "📚",
  "ইংরেজি ভাষা": "🔤",
  গণিত: "🧮",
  "বাংলাদেশ বিষয়াবলি": "🏛️",
  "আন্তর্জাতিক বিষয়াবলি": "🌍",
  ভূগোল: "🌎",
  "সাধারণ বিজ্ঞান": "🔬",
  "কম্পিউটার শিক্ষা": "💻",
  "মানসিক দক্ষতা": "🧠",
  "নৈতিকতা ও সুশাসন": "⚖️",
};

export default function SubjectPage({ params }) {
  const { subject: rawSubject } = use(params);

  const subject = decodeURIComponent(rawSubject);

  const { content, loading, addVolume } = useBookDetailed();
  const { user } = useAuth();

  const canManage = !!user;

  if (loading) {
    return <HomeFeedSkeleton />;
  }

  const subjectData = content[subject];

  if (!subjectData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-5xl mb-4">📚</div>

          <h1 className="text-xl font-bold text-[var(--color-app-text)]">
            বিষয়টি খুঁজে পাওয়া যায়নি
          </h1>

          <Link
            href="/books"
            className="inline-block mt-5 px-5 py-2.5 rounded-xl bg-[var(--color-app-accent)] text-white"
          >
            বইতে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  /*
   * সব paper-এর topic একসাথে নেওয়া হচ্ছে।
   *
   * এখন থেকে UI-তে:
   * প্রথম পত্র / দ্বিতীয় পত্র / সাধারণ
   * আলাদা করে দেখানো হবে না।
   */
  const topics = (subjectData.papers || []).flatMap((paper) =>
    (paper.topics || []).map((topic, index) => ({
      ...topic,

      // পুরোনো topic-এর id না থাকলে temporary unique id
      id:
        topic.id !== undefined && topic.id !== null
          ? topic.id
          : `legacy-${paper.id}-${index}`,

      paperId: paper.id,
      paperTitle: paper.title,
    })),
  );

  /*
   * নতুন পোস্ট করার জন্য প্রথম paper ব্যবহার করা হবে।
   *
   * নতুন Subject তৈরি হলে বর্তমানে "general" paper তৈরি হয়।
   */
  const defaultPaper =
    subjectData.papers?.find((paper) => paper.id === "general") ||
    subjectData.papers?.[0];

  return (
    <div className="min-h-screen pb-24 px-3 py-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/books"
            className="w-10 h-10 rounded-full border border-[var(--color-app-border)] flex items-center justify-center text-xl hover:bg-[var(--color-app-primary-soft)] transition"
            aria-label="ফিরে যান"
          >
            ←
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">
                {subjectIcons[subject] || subjectData.icon || "📚"}
              </span>

              <h1 className="text-xl font-bold text-[var(--color-app-text)]">
                {subject}
              </h1>
            </div>

            <p className="text-xs mt-1 text-[var(--color-app-muted)]">
              {topics.length} টি টপিক
            </p>
          </div>
        </div>

        {/* Three Dot */}
        <div className="relative">
          {canManage && (
            <>
              <button
                onClick={() => setShowOptions((prev) => !prev)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-2xl text-[var(--color-app-muted)] hover:bg-[var(--color-app-primary-soft)] transition"
                aria-label="বিষয় অপশন"
              >
                ⋮
              </button>
            </>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="mb-5">
        <div className="flex items-center gap-3 rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] px-4 py-3">
          <span className="text-[var(--color-app-muted)]">🔍</span>

          <input
            type="text"
            placeholder="টপিক, অধ্যায় বা শব্দের নাম দিয়ে খুঁজুন..."
            className="w-full bg-transparent outline-none text-sm text-[var(--color-app-text)] placeholder:text-[var(--color-app-muted)]"
          />
        </div>
      </div>

      {/* Topics */}
      {topics.length === 0 ? (
        <div className="min-h-[45vh] flex flex-col items-center justify-center text-center">
          <div className="text-5xl mb-4">📝</div>

          <h2 className="text-lg font-semibold text-[var(--color-app-text)]">
            এই বিষয়ে এখনো কোনো টপিক নেই
          </h2>

          <p className="text-sm mt-2 text-[var(--color-app-muted)]">
            উপরের ⋮ বাটনে ক্লিক করে নতুন অধ্যায় যোগ করুন।
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {topics.map((topic) => (
            <Link
              key={`${topic.paperId}-${String(topic.id)}`}
              href={`/books/${encodeURIComponent(subject)}/${topic.paperId}/${topic.id}`}
              className="block rounded-2xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-4 hover:bg-[var(--color-app-primary-soft)] transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-[var(--color-app-text)]">
                    {topic.title}
                  </h2>

                  {topic.content && (
                    <div
                      className="text-sm mt-1 text-[var(--color-app-muted)] line-clamp-2 prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: topic.content }}
                    />
                  )}
                </div>

                <span className="text-lg text-[var(--color-app-muted)]">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}
      {showVolumeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50"
          onClick={() => setShowVolumeModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-[var(--color-app-text)]">
              নতুন অধ্যায়
            </h2>

            <p className="text-xs mt-1 mb-4 text-[var(--color-app-muted)]">
              যেমন: প্রাচীনকাল, মধ্যযুগ, আধুনিক যুগ
            </p>

            <input
              autoFocus
              value={volumeTitle}
              onChange={(e) => {
                setVolumeTitle(e.target.value);
                setVolumeError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddVolume();
                }
              }}
              placeholder="অধ্যায়ের নাম লিখুন"
              className="w-full rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-bg)] px-4 py-3 text-sm outline-none text-[var(--color-app-text)] placeholder:text-[var(--color-app-muted)] focus:border-[var(--color-app-primary)]"
            />

            {volumeError && (
              <p className="text-xs text-red-400 mt-2">{volumeError}</p>
            )}

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => {
                  setShowVolumeModal(false);
                  setVolumeTitle("");
                  setVolumeError("");
                }}
                className="px-4 py-2 rounded-xl text-sm text-[var(--color-app-muted)] hover:bg-[var(--color-app-primary-soft)]"
              >
                বাতিল
              </button>

              <button
                onClick={handleAddVolume}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-[var(--color-app-accent)] text-white"
              >
                যোগ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
