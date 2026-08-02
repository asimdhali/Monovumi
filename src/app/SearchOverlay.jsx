"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";

/* ---------------------------------------------------------
   ডেমো সার্চ ডেটা — বাস্তব অ্যাপে এটি Firestore কালেকশন
   (books, notes, qa, competitions, teachers) থেকে আসবে
--------------------------------------------------------- */
const searchIndex = [
  {
    id: "b1",
    type: "book",
    icon: "📚",
    title: "নবম-দশম শ্রেণির বিজ্ঞান",
    subtitle: "বই · পদার্থ, রসায়ন, জীববিজ্ঞান",
    href: "/books/b1",
  },
  {
    id: "b2",
    type: "book",
    icon: "📚",
    title: "সহজ বাংলা ব্যাকরণ",
    subtitle: "বই · বাংলা",
    href: "/books/b2",
  },
  {
    id: "n1",
    type: "note",
    icon: "📘",
    title: "আলো ও প্রতিফলন",
    subtitle: "নোট · বিজ্ঞান · রফিক স্যার",
    href: "/books/b1#note-1",
  },
  {
    id: "n2",
    type: "note",
    icon: "📘",
    title: "সালোকসংশ্লেষণ প্রক্রিয়া",
    subtitle: "নোট · জীববিজ্ঞান",
    href: "/books/b1#note-2",
  },
  {
    id: "n3",
    type: "note",
    icon: "📘",
    title: "ভগ্নাংশের যোগ-বিয়োগ",
    subtitle: "নোট · গণিত",
    href: "/books/b3#note-1",
  },
  {
    id: "q1",
    type: "qa",
    icon: "💬",
    title: "নিউটনের সূত্র বাস্তব জীবনে কীভাবে কাজ করে?",
    subtitle: "প্রশ্নোত্তর · বিজ্ঞান",
    href: "/qa/q1",
  },
  {
    id: "q2",
    type: "qa",
    icon: "💬",
    title: "সমাস কত প্রকার ও কী কী?",
    subtitle: "প্রশ্নোত্তর · বাংলা",
    href: "/qa/q2",
  },
  {
    id: "c1",
    type: "competition",
    icon: "🏆",
    title: "সাপ্তাহিক MCQ চ্যালেঞ্জ",
    subtitle: "প্রতিযোগিতা · সব বিষয়",
    href: "/competitions/c1",
  },
  {
    id: "c2",
    type: "competition",
    icon: "🏆",
    title: "বিজ্ঞান অলিম্পিয়াড প্রস্তুতি",
    subtitle: "প্রতিযোগিতা · বিজ্ঞান",
    href: "/competitions/c2",
  },
  {
    id: "t1",
    type: "teacher",
    icon: "🎓",
    title: "রফিক স্যার",
    subtitle: "যাচাইকৃত শিক্ষক · বিজ্ঞান বিভাগ",
    href: "/profile/t1",
  },
  {
    id: "t2",
    type: "teacher",
    icon: "🎓",
    title: "নাদিয়া আপা",
    subtitle: "যাচাইকৃত শিক্ষক · বাংলা বিভাগ",
    href: "/profile/t2",
  },
];

const categories = [
  { id: "all", label: "সব" },
  { id: "book", label: "বই" },
  { id: "note", label: "নোট" },
  { id: "qa", label: "প্রশ্নোত্তর" },
  { id: "competition", label: "প্রতিযোগিতা" },
  { id: "teacher", label: "শিক্ষক" },
];

const trendingTopics = [
  "সালোকসংশ্লেষণ",
  "ভগ্নাংশ",
  "নিউটনের সূত্র",
  "সমাস",
  "MCQ চ্যালেঞ্জ",
];

export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [recent, setRecent] = useState(["সালোকসংশ্লেষণ", "রফিক স্যার"]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setCategory("all");
    }
  }, [open]);

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return searchIndex.filter((item) => {
      const matchesQuery =
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q);
      const matchesCategory = category === "all" || item.type === category;
      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  const grouped = useMemo(() => {
    return results.reduce((acc, item) => {
      (acc[item.type] ||= []).push(item);
      return acc;
    }, {});
  }, [results]);

  function commitSearch(term) {
    if (!term.trim()) return;
    setRecent((prev) => [term, ...prev.filter((t) => t !== term)].slice(0, 6));
    setQuery(term);
  }

  function removeRecent(term) {
    setRecent((prev) => prev.filter((t) => t !== term));
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex flex-col"
      style={{ background: "var(--color-app-bg)" }}
    >
      {/* ---------- সার্চ বার ---------- */}
      <div className="border-b border-[var(--color-app-border)]">
        <div className="max-w-2xl mx-auto px-4 lg:px-6 h-14 flex items-center gap-2">
          <div
            className="flex-1 flex items-center gap-2 h-10 rounded-full px-3.5"
            style={{
              background: "var(--color-app-surface)",
              border: "1px solid var(--color-app-border)",
            }}
          >
            <svg
              className="w-[17px] h-[17px] shrink-0"
              fill="none"
              stroke="var(--color-app-muted)"
              viewBox="0 0 24 24"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M21 21l-4.35-4.35"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && commitSearch(query)}
              placeholder="বই, নোট, প্রশ্ন বা শিক্ষক খুঁজুন..."
              className="flex-1 bg-transparent outline-none text-sm text-[var(--color-app-text)] placeholder:text-[var(--color-app-muted)]"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="মুছুন"
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "var(--color-app-border)" }}
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="var(--color-app-muted)"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-sm font-medium shrink-0 px-1 text-[var(--color-app-primary)]"
          >
            বাতিল
          </button>
        </div>

        {/* ---------- ক্যাটাগরি ফিল্টার ---------- */}
        <div className="max-w-2xl mx-auto px-4 lg:px-6 pb-3 flex gap-2 overflow-x-auto">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors"
              style={{
                background:
                  category === c.id
                    ? "var(--color-app-primary)"
                    : "var(--color-app-surface)",
                color: category === c.id ? "#fff" : "var(--color-app-muted)",
                border: `1px solid ${
                  category === c.id
                    ? "var(--color-app-primary)"
                    : "var(--color-app-border)"
                }`,
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* ---------- কনটেন্ট ---------- */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 lg:px-6 py-4">
          {!query.trim() ? (
            <>
              {recent.length > 0 && (
                <div className="mb-6">
                  <p className="text-[11px] font-semibold uppercase tracking-wide mb-2 text-[var(--color-app-muted)]">
                    সাম্প্রতিক অনুসন্ধান
                  </p>
                  <div className="space-y-1">
                    {recent.map((term) => (
                      <div
                        key={term}
                        className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-[var(--color-app-surface)] transition-colors"
                      >
                        <button
                          onClick={() => commitSearch(term)}
                          className="flex items-center gap-2.5 text-sm text-[var(--color-app-text)]"
                        >
                          <span className="text-[var(--color-app-muted)]">
                            🕒
                          </span>
                          {term}
                        </button>
                        <button
                          onClick={() => removeRecent(term)}
                          aria-label="মুছে ফেলুন"
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="var(--color-app-muted)"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeWidth="2.5"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide mb-2 text-[var(--color-app-muted)]">
                  জনপ্রিয় বিষয়
                </p>
                <div className="flex flex-wrap gap-2">
                  {trendingTopics.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => commitSearch(topic)}
                      className="px-3.5 py-1.5 rounded-full text-xs font-medium"
                      style={{
                        background: "var(--color-app-accent-soft)",
                        color: "var(--color-app-accent)",
                      }}
                    >
                      🔥 {topic}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : results.length === 0 ? (
            <div className="text-center py-14">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-sm font-medium text-[var(--color-app-text)]">
                “{query}” এর জন্য কিছু পাওয়া যায়নি
              </p>
              <p className="text-xs mt-1 text-[var(--color-app-muted)]">
                বানান পরীক্ষা করুন অথবা অন্য শব্দ দিয়ে খুঁজুন
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {Object.entries(grouped).map(([type, items]) => (
                <div key={type}>
                  <p className="text-[11px] font-semibold uppercase tracking-wide mb-2 text-[var(--color-app-muted)]">
                    {categories.find((c) => c.id === type)?.label}
                  </p>
                  <div className="rounded-2xl border overflow-hidden bg-[var(--color-app-surface)] border-[var(--color-app-border)]">
                    {items.map((item, i) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={onClose}
                        className="flex items-center gap-3 p-3.5"
                        style={{
                          borderTop:
                            i === 0
                              ? "none"
                              : "1px solid var(--color-app-border)",
                        }}
                      >
                        <span
                          className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-lg"
                          style={{
                            background: "var(--color-app-primary-soft)",
                          }}
                        >
                          {item.icon}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate text-[var(--color-app-text)]">
                            {item.title}
                          </p>
                          <p className="text-xs mt-0.5 truncate text-[var(--color-app-muted)]">
                            {item.subtitle}
                          </p>
                        </div>
                        <svg
                          className="w-4 h-4 shrink-0"
                          fill="none"
                          stroke="var(--color-app-muted)"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 18l6-6-6-6"
                          />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
