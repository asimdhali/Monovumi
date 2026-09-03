"use client";

import { useMemo, useState } from "react";
import { X, ChevronRight } from "lucide-react";
import { useBookDetailed } from "../../BookDetailedContext";

export default function PostLocationModal({ onClose, onSelect }) {
  const { content, loading } = useBookDetailed();

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  // =========================================
  // SUBJECTS
  // =========================================
  const subjects = useMemo(() => {
    return Object.entries(content || {})
      .sort(([, a], [, b]) => {
        return (a?.order ?? 999) - (b?.order ?? 999);
      })
      .map(([name, data]) => ({
        name,
        ...data,
      }));
  }, [content]);

  // =========================================
  // CHAPTERS
  // এখান থেকেই আসল অধ্যায় নিতে হবে
  // paper.volumes থেকে
  // =========================================
  const chapters = useMemo(() => {
    if (!selectedSubject) return [];

    const papers = content?.[selectedSubject]?.papers || [];

    const chapterMap = new Map();

    papers.forEach((paper) => {
      const volumes = Array.isArray(paper.volumes) ? paper.volumes : [];

      volumes.forEach((volume) => {
        const chapterName = (volume.title || "").trim();

        if (!chapterName) return;

        const key = chapterName.toLowerCase();

        if (!chapterMap.has(key)) {
          chapterMap.set(key, {
            id: volume.id || `chapter-${key}`,
            title: chapterName,
            paperId: paper.id,
          });
        }
      });
    });

    return Array.from(chapterMap.values());
  }, [content, selectedSubject]);
  // =========================================
  // SELECT CHAPTER
  // =========================================
  function handleChapterSelect(chapter) {
    const location = {
      subject: selectedSubject,
      chapter: chapter.title,
      paperId: chapter.paperId,
    };

    onSelect?.(location);
    onClose();
  }

  // =========================================
  // BACK TO SUBJECT
  // =========================================
  function goBackToSubjects() {
    setSelectedSubject(null);
    setSelectedChapter(null);
  }

  // =========================================
  // BACK TO CHAPTER
  // =========================================
  function goBackToChapters() {
    setSelectedChapter(null);
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Modal */}
      <div
        className="
          relative
          w-full
          max-w-md
          max-h-[90vh]
          overflow-hidden
          rounded-2xl
          border
          border-[var(--color-app-border)]
          bg-[var(--color-app-surface)]
          shadow-2xl
        "
      >
        {/* =====================================
            HEADER
        ====================================== */}
        <div
          className="
            flex
            items-center
            justify-between
            px-4
            py-3.5
            border-b
            border-[var(--color-app-border)]
          "
        >
          <div>
            <h2
              className="
                text-[15px]
                font-bold
                text-[var(--color-app-text)]
              "
            >
              পোস্ট লোকেশন নির্বাচন করুন
            </h2>

            <p
              className="
                text-[11px]
                text-[var(--color-app-muted)]
                mt-0.5
              "
            >
              কোথায় পোস্টটি প্রকাশ করবেন?
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              w-8
              h-8
              rounded-full
              flex
              items-center
              justify-center
              text-[var(--color-app-muted)]
              hover:bg-[var(--color-app-primary-soft)]
              hover:text-[var(--color-app-text)]
              transition
            "
            aria-label="বন্ধ করুন"
          >
            <X className="w-[18px] h-[18px]" />
          </button>
        </div>

        {/* =====================================
            CONTENT
        ====================================== */}
        <div
          className="
            overflow-y-auto
            p-2
            max-h-[calc(90vh-72px)]
            overscroll-contain
          "
        >
          {/* ===================================
              LOADING
          =================================== */}
          {loading ? (
            <div className="py-10 text-center">
              <div
                className="
                  mx-auto
                  w-5
                  h-5
                  rounded-full
                  border-2
                  border-[var(--color-app-border)]
                  border-t-[var(--color-app-primary)]
                  animate-spin
                "
              />

              <p
                className="
                  mt-3
                  text-[11px]
                  text-[var(--color-app-muted)]
                "
              >
                বিষয়গুলো লোড হচ্ছে...
              </p>
            </div>
          ) : !selectedSubject ? (
            /* =================================
               STEP 1
               SUBJECT
            ================================= */
            <>
              <p
                className="
                  px-2
                  pb-2
                  text-[11px]
                  font-semibold
                  text-[var(--color-app-muted)]
                "
              >
                বিষয় নির্বাচন করুন
              </p>

              <div className="space-y-1">
                {subjects.map((subject) => (
                  <button
                    key={subject.name}
                    type="button"
                    onClick={() => {
                      setSelectedSubject(subject.name);
                      setSelectedChapter(null);
                    }}
                    className="
                      w-full
                      flex
                      items-center
                      justify-between
                      px-3
                      py-3
                      rounded-xl
                      text-left
                      text-[13.5px]
                      text-[var(--color-app-text)]
                      hover:bg-[var(--color-app-primary-soft)]
                      transition
                    "
                  >
                    <span>{subject.name}</span>

                    <ChevronRight
                      className="
                        w-4
                        h-4
                        text-[var(--color-app-muted)]
                      "
                    />
                  </button>
                ))}
              </div>
            </>
          ) : !selectedChapter ? (
            /* =================================
               STEP 2
               CHAPTER
            ================================= */
            <>
              {/* Breadcrumb */}
              <div
                className="
                  flex
                  items-center
                  gap-1
                  px-2
                  pb-3
                  text-[11px]
                "
              >
                <button
                  type="button"
                  onClick={goBackToSubjects}
                  className="text-[var(--color-app-primary)]"
                >
                  বিষয়
                </button>

                <ChevronRight
                  className="
                    w-3
                    h-3
                    text-[var(--color-app-muted)]
                  "
                />

                <span
                  className="
                    text-[var(--color-app-text)]
                  "
                >
                  {selectedSubject}
                </span>
              </div>

              <p
                className="
                  px-2
                  pb-2
                  text-[11px]
                  font-semibold
                  text-[var(--color-app-muted)]
                "
              >
                অধ্যায় নির্বাচন করুন
              </p>

              {chapters.length === 0 ? (
                <div className="px-3 py-8 text-center">
                  <p
                    className="
                      text-[13px]
                      text-[var(--color-app-muted)]
                    "
                  >
                    এই বিষয়ে এখনো কোনো অধ্যায় নেই।
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {chapters.map((chapter) => (
                    <button
                      key={`${chapter.paperId}-${chapter.id}`}
                      type="button"
                      onClick={() => handleChapterSelect(chapter)}
                      className="
                        w-full
                        flex
                        items-center
                        justify-between
                        px-3
                        py-3
                        rounded-xl
                        text-left
                        text-[13.5px]
                        text-[var(--color-app-text)]
                        hover:bg-[var(--color-app-primary-soft)]
                        transition
                      "
                    >
                      <span>{chapter.title}</span>

                      <ChevronRight
                        className="
                          w-4
                          h-4
                          text-[var(--color-app-muted)]
                        "
                      />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
