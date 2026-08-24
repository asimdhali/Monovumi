"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";

import { collection, onSnapshot } from "firebase/firestore";

import { db } from "./firebase";

import { subjects, books, competitions, questions, posts } from "./data";

/* =========================================================
   Categories
========================================================= */

const categories = [{ id: "post", label: "পোস্ট" }];

/* 
/* =========================================================
   Text normalization
========================================================= */

function normalizeText(value) {
  if (value === null || value === undefined) return "";

  return String(value).toLowerCase().replace(/\s+/g, " ").trim();
}

/* =========================================================
   Recursive object → searchable text
========================================================= */

function extractSearchText(value) {
  if (value === null || value === undefined) {
    return "";
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map(extractSearchText).join(" ");
  }

  if (typeof value === "object") {
    return Object.values(value).map(extractSearchText).join(" ");
  }

  return "";
}

/* =========================================================
   Create result helper
========================================================= */

function createResult({ id, type, icon, title, subtitle, href, content }) {
  return {
    id: String(id),
    type,
    icon,
    title: title || "কনটেন্ট",
    subtitle: subtitle || "",
    href: href || "/",
    searchText: normalizeText(
      `${title || ""} ${subtitle || ""} ${content || ""}`,
    ),
  };
}

/* =========================================================
   Static data → Search Index
========================================================= */

function buildStaticIndex() {
  const index = [];

  /* -------------------------------------------------------
     Books
  ------------------------------------------------------- */

  books.forEach((book) => {
    index.push(
      createResult({
        id: `book-${book.id}`,
        type: "book",
        icon: book.cover || "📚",
        title: book.title,
        subtitle: `বই · ${book.subject}`,
        href: `/books/${book.id}`,
        content: extractSearchText(book),
      }),
    );

    /* Chapters */

    (book.chapters || []).forEach((chapter) => {
      index.push(
        createResult({
          id: `chapter-${chapter.id}`,
          type: "book",
          icon: "📖",
          title: chapter.title,
          subtitle: `অধ্যায় · ${book.title}`,
          href: `/books/${book.id}`,
          content: extractSearchText(chapter),
        }),
      );

      /* Notes */

      (chapter.notes || []).forEach((note, noteIndex) => {
        index.push(
          createResult({
            id: `note-${chapter.id}-${noteIndex}`,
            type: "note",
            icon: "📝",
            title: chapter.title,
            subtitle: `নোট · ${book.subject}`,
            href: `/books/${book.id}`,
            content: note,
          }),
        );
      });

      /* QA */

      (chapter.qa || []).forEach((qa, qaIndex) => {
        index.push(
          createResult({
            id: `qa-${chapter.id}-${qaIndex}`,
            type: "qa",
            icon: "💬",
            title: qa.q,
            subtitle: `প্রশ্নোত্তর · ${book.subject}`,
            href: `/books/${book.id}`,
            content: extractSearchText(qa),
          }),
        );
      });

      /* MCQ */

      (chapter.mcqs || []).forEach((mcq, mcqIndex) => {
        index.push(
          createResult({
            id: `mcq-${chapter.id}-${mcqIndex}`,
            type: "qa",
            icon: "❓",
            title: mcq.q,
            subtitle: `MCQ · ${book.subject}`,
            href: `/books/${book.id}`,
            content: extractSearchText(mcq),
          }),
        );
      });
    });
  });

  /* -------------------------------------------------------
     Competitions
  ------------------------------------------------------- */

  competitions.forEach((competition) => {
    index.push(
      createResult({
        id: `competition-${competition.id}`,
        type: "competition",
        icon: competition.icon || "🏆",
        title: competition.title,
        subtitle: `প্রতিযোগিতা · ${competition.subject}`,
        href: `/competitions/${competition.id}`,
        content: extractSearchText(competition),
      }),
    );
  });

  /* -------------------------------------------------------
     Questions
  ------------------------------------------------------- */

  questions.forEach((question) => {
    index.push(
      createResult({
        id: `question-${question.id}`,
        type: "qa",
        icon: "💬",
        title: question.text,
        subtitle: `প্রশ্নোত্তর · ${question.subject}`,
        href: `/qa/${question.id}`,
        content: extractSearchText(question),
      }),
    );
  });

  /* -------------------------------------------------------
     Static Posts
  ------------------------------------------------------- */

  posts.forEach((post) => {
    index.push(
      createResult({
        id: `post-static-${post.id}`,
        type: "post",
        icon: "📝",
        title: post.type || "পোস্ট",
        subtitle: `${post.subject || ""} · ${post.name || ""}`,
        href: "/",
        content: extractSearchText(post),
      }),
    );
  });

  return index;
}

/* =========================================================
   Firestore bookDetailedContent → Search Index
========================================================= */

function buildDetailedBookIndex(data) {
  const index = [];

  Object.entries(data || {}).forEach(([subject, subjectData]) => {
    const papers = subjectData?.papers || [];

    papers.forEach((paper) => {
      /* ---------------------------------------------------
         Paper
      --------------------------------------------------- */

      index.push(
        createResult({
          id: `paper-${subject}-${paper.id}`,
          type: "book",
          icon: "📚",
          title: paper.title,
          subtitle: `বই · ${subject}`,
          href: `/book-detailed/${encodeURIComponent(subject)}/${paper.id}`,
          content: extractSearchText(paper),
        }),
      );

      /* ---------------------------------------------------
         Topics
      --------------------------------------------------- */

      (paper.topics || []).forEach((topic) => {
        index.push(
          createResult({
            id: `topic-${subject}-${paper.id}-${topic.id}`,
            type: "note",
            icon: "📘",
            title: topic.title,
            subtitle: `${topic.era || ""} · ${subject}`,
            href: `/book-detailed/${encodeURIComponent(
              subject,
            )}/${paper.id}#topic-${topic.id}`,
            content: extractSearchText(topic),
          }),
        );
      });

      /* ---------------------------------------------------
         Volumes
      --------------------------------------------------- */

      (paper.volumes || []).forEach((volume) => {
        index.push(
          createResult({
            id: `volume-${subject}-${paper.id}-${volume.id}`,
            type: "book",
            icon: "📖",
            title: volume.title || "ভলিউম",
            subtitle: `বই · ${subject}`,
            href: `/book-detailed/${encodeURIComponent(subject)}/${paper.id}`,
            content: extractSearchText(volume),
          }),
        );
      });
    });
  });

  return index;
}

/* =========================================================
   Firestore homeFeed → Search Index

   এখানে আমরা schema নির্ভর না হয়ে পুরো document recursive
   ভাবে searchable করছি।
========================================================= */

function buildHomeFeedIndex(data) {
  const index = [];

  Object.entries(data || {}).forEach(([docId, item]) => {
    if (!item || typeof item !== "object") return;

    const title =
      item.title || item.topicTitle || item.heading || item.type || "পোস্ট";

    const author =
      item.authorName || item.contributor || item.author || item.name || "";

    const subject = item.subject || "";

    const paperId = item.paperId || "";

    const topicId = item.topicId || item.id || "";

    const href =
      item.href ||
      item.url ||
      item.path ||
      (subject && paperId && topicId
        ? `/books/${encodeURIComponent(subject)}/${paperId}/${topicId}`
        : "/");

    index.push(
      createResult({
        id: `homefeed-${docId}`,
        type: "post",
        icon: "📝",
        title,
        subtitle: `${subject ? `${subject} · ` : ""}${author}`,
        href,
        content: extractSearchText(item),
      }),
    );
  });

  return index;
}

/* =========================================================
   Search Overlay
========================================================= */

export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("post");

  const [recent, setRecent] = useState([]);

  const [homeFeed, setHomeFeed] = useState({});

  const inputRef = useRef(null);

  /* =======================================================
     Load recent searches
  ======================================================= */

  useEffect(() => {
    try {
      const saved = localStorage.getItem("monovumi-recent-searches");

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setRecent(parsed);
        }
      }
    } catch (error) {
      console.error("Recent search load error:", error);
    }
  }, []);

  /* =======================================================
     Subscribe to homeFeed
  ======================================================= */

  useEffect(() => {
    if (!open) return;

    const unsubscribe = onSnapshot(
      collection(db, "homeFeed"),
      (snapshot) => {
        const data = {};

        snapshot.docs.forEach((docSnap) => {
          data[docSnap.id] = docSnap.data();
        });

        setHomeFeed(data);
      },
      (error) => {
        console.error("homeFeed search listener error:", error);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [open]);

  /* =======================================================
     Focus search box
  ======================================================= */

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);

      return () => clearTimeout(timer);
    }

    setQuery("");
    setCategory("post");
  }, [open]);

  /* =======================================================
     ESC
  ======================================================= */

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  /* =======================================================
     Build global search index
  ======================================================= */

  const searchIndex = useMemo(() => {
    const homeFeedIndex = buildHomeFeedIndex(homeFeed);

    return homeFeedIndex;
  }, [homeFeed]);

  /* =======================================================
     Search
  ======================================================= */

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const q = normalizeText(query);

    return searchIndex
      .filter((item) => {
        const matchesQuery = item.searchText.includes(q);

        const matchesCategory = category === "all" || item.type === category;

        return matchesQuery && matchesCategory;
      })
      .slice(0, 100);
  }, [query, category, searchIndex]);

  /* =======================================================
     Group results
  ======================================================= */

  const grouped = useMemo(() => {
    return results.reduce((acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }

      acc[item.type].push(item);

      return acc;
    }, {});
  }, [results]);

  /* =======================================================
     Save search
  ======================================================= */

  function commitSearch(term) {
    const value = term.trim();

    if (!value) return;

    setRecent((prev) => {
      const next = [value, ...prev.filter((item) => item !== value)].slice(
        0,
        6,
      );

      try {
        localStorage.setItem("monovumi-recent-searches", JSON.stringify(next));
      } catch (error) {
        console.error("Recent search save error:", error);
      }

      return next;
    });

    setQuery(value);
  }

  /* =======================================================
     Remove recent
  ======================================================= */

  function removeRecent(term) {
    setRecent((prev) => {
      const next = prev.filter((item) => item !== term);

      try {
        localStorage.setItem("monovumi-recent-searches", JSON.stringify(next));
      } catch (error) {
        console.error("Recent search remove error:", error);
      }

      return next;
    });
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex flex-col"
      style={{
        background: "var(--color-app-bg)",
      }}
    >
      {/* =================================================
          Search Header
      ================================================= */}

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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  commitSearch(query);
                }
              }}
              placeholder="ওয়েবসাইটের যেকোনো কিছু খুঁজুন..."
              className="flex-1 bg-transparent outline-none text-sm text-[var(--color-app-text)] placeholder:text-[var(--color-app-muted)]"
            />

            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="মুছুন"
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: "var(--color-app-border)",
                }}
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

        {/* =================================================
            Categories
        ================================================= */}

        <div className="max-w-2xl mx-auto px-4 lg:px-6 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
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

      {/* =================================================
          Content
      ================================================= */}

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 lg:px-6 py-4">
          {/* =================================================
              Empty Search
          ================================================= */}

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
            </>
          ) : results.length === 0 ? (
            /* =================================================
               No Results
            ================================================= */

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
            /* =================================================
               Results
            ================================================= */

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
                        className="flex items-center gap-3 p-3.5 hover:bg-[var(--color-app-primary-soft)] transition-colors"
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
                          <p className="text-sm font-medium text-[var(--color-app-text)] line-clamp-2">
                            {item.title}
                          </p>

                          <p className="text-xs mt-0.5 text-[var(--color-app-muted)] line-clamp-2">
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
