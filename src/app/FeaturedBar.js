"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useBookDetailed } from "./BookDetailedContext";
import { useAuth } from "./AuthContext";

const subjectIcons = {
  বাংলা:
    "M12 6.25C10.5 5 8.5 4.5 6 4.5c-1 0-2 .1-3 .4v13.5c1-.3 2-.4 3-.4 2.5 0 4.5.5 6 1.75m0-13.5c1.5-1.25 3.5-1.75 6-1.75 1 0 2 .1 3 .4v13.5c-1-.3-2-.4-3-.4-2.5 0-4.5.5-6 1.75m0-13.5v13.5",
  ইংরেজি:
    "M4 19.5A2.5 2.5 0 016.5 17H20M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z",
  গণিত: "M9 7h6m-6 4h6m-6 4h3M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z",
  বিজ্ঞান: "M9 3v7.5L4 20a1 1 0 001 1h14a1 1 0 001-1l-5-9.5V3M9 3h6",
};

function ThreeDotMenu({ topic, canManage }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const menuRef = useRef(null);
  const { editTopic, toggleFeatured } = useBookDetailed();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function copyLink() {
    const url = `${window.location.origin}/book-detailed/${encodeURIComponent(topic.subject)}/${topic.paperId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    setOpen(false);
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="p-1 rounded-full hover:bg-[var(--color-app-primary-soft)]"
        aria-label="আরও অপশন"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="var(--color-app-muted)"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6h.01M12 12h.01M12 18h.01"
          />
        </svg>
      </button>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 mt-1 w-40 bg-[var(--color-app-surface)] rounded-lg shadow-lg border border-[var(--color-app-border)] py-1 z-20"
        >
          <button
            onClick={copyLink}
            className="w-full text-left px-3 py-2 text-xs text-[var(--color-app-text)] hover:bg-[var(--color-app-primary-soft)]"
          >
            {copied ? "✓ কপি হয়েছে" : "🔗 কপি লিংক"}
          </button>
          {canManage && (
            <>
              <button
                onClick={() => {
                  setEditing(true);
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-[var(--color-app-text)] hover:bg-[var(--color-app-primary-soft)]"
              >
                ✏️ আপডেট করুন
              </button>
              <button
                onClick={() => {
                  toggleFeatured(topic.subject, topic.paperId, topic.id);
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-[var(--color-app-primary-soft)]"
              >
                ✕ ফিচার্ড থেকে বাদ দিন
              </button>
            </>
          )}
        </div>
      )}

      {editing && (
        <EditFeaturedModal
          topic={topic}
          onClose={() => setEditing(false)}
          onSave={(fields) => {
            editTopic(topic.subject, topic.paperId, topic.id, fields);
            setEditing(false);
          }}
        />
      )}
    </div>
  );
}

function EditFeaturedModal({ topic, onClose, onSave }) {
  const [form, setForm] = useState({
    era: topic.era,
    title: topic.title,
    content: topic.content,
  });

  function handleSubmit() {
    if (!form.title.trim() || !form.content.trim()) return;
    onSave(form);
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[95] px-4"
    >
      <div className="bg-[var(--color-app-surface)] rounded-2xl w-full max-w-lg p-6">
        <h3 className="font-[family-name:var(--font-bengali-serif)] text-lg text-[var(--color-app-text)] mb-4">
          টপিক আপডেট করুন
        </h3>
        <div className="space-y-3">
          <input
            value={form.era}
            onChange={(e) => setForm({ ...form, era: e.target.value })}
            placeholder="যুগ"
            className="w-full p-2.5 rounded-lg border text-sm bg-[var(--color-app-bg)] border-[var(--color-app-border)] text-[var(--color-app-text)]"
          />
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="শিরোনাম"
            className="w-full p-2.5 rounded-lg border text-sm bg-[var(--color-app-bg)] border-[var(--color-app-border)] text-[var(--color-app-text)]"
          />
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={6}
            className="w-full p-2.5 rounded-lg border text-sm resize-none bg-[var(--color-app-bg)] border-[var(--color-app-border)] text-[var(--color-app-text)]"
          />
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSubmit}
              className="flex-1 py-2.5 rounded-full text-sm font-semibold text-white"
              style={{ background: "var(--color-app-primary)" }}
            >
              সংরক্ষণ করুন
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-full text-sm font-medium border border-[var(--color-app-border)] text-[var(--color-app-muted)]"
            >
              বাতিল
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturedManageModal({ onClose }) {
  const { content, toggleFeatured } = useBookDetailed();
  const subjects = Object.keys(content);
  const [selectedSubject, setSelectedSubject] = useState(subjects[0] || "");
  const [selectedPaperId, setSelectedPaperId] = useState("");

  const subjectData = content[selectedSubject];
  const papers = subjectData?.papers || [];
  const paper = papers.find((p) => p.id === selectedPaperId) || papers[0];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[90] px-4">
      <div className="bg-[var(--color-app-surface)] rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-[family-name:var(--font-bengali-serif)] text-lg text-[var(--color-app-text)]">
            ফিচার্ড টপিক নির্বাচন করুন
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[var(--color-app-primary-soft)]"
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

        <div className="grid grid-cols-2 gap-2 mb-4">
          <select
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              setSelectedPaperId("");
            }}
            className="p-2 rounded-lg border text-sm bg-[var(--color-app-bg)] border-[var(--color-app-border)] text-[var(--color-app-text)]"
          >
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={paper?.id || ""}
            onChange={(e) => setSelectedPaperId(e.target.value)}
            className="p-2 rounded-lg border text-sm bg-[var(--color-app-bg)] border-[var(--color-app-border)] text-[var(--color-app-text)]"
          >
            {papers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          {(!paper || paper.topics.length === 0) && (
            <p className="text-sm text-center text-[var(--color-app-muted)] py-6">
              এই পত্রে কোনো টপিক নেই।
            </p>
          )}
          {paper?.topics.map((topic) => (
            <div
              key={topic.id}
              className="flex items-center justify-between rounded-xl border p-3 border-[var(--color-app-border)]"
            >
              <div>
                <p className="text-sm font-medium text-[var(--color-app-text)]">
                  {topic.title}
                </p>
                <p className="text-[11px] text-[var(--color-app-muted)]">
                  {topic.era}
                </p>
              </div>
              <button
                onClick={() =>
                  toggleFeatured(selectedSubject, paper.id, topic.id)
                }
                className="px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0"
                style={{
                  background: topic.featured
                    ? "var(--color-app-primary)"
                    : "var(--color-app-bg)",
                  color: topic.featured ? "white" : "var(--color-app-muted)",
                  border: topic.featured
                    ? "none"
                    : "1px solid var(--color-app-border)",
                }}
              >
                {topic.featured ? "⭐ ফিচার্ড" : "ফিচার্ড করুন"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeaturedPreviewModal({ topic, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[90] px-4">
      <div className="bg-[var(--color-app-surface)] rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span
              className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2"
              style={{
                background: "var(--color-app-primary-soft)",
                color: "var(--color-app-primary)",
              }}
            >
              📄 {topic.subject} · {topic.era}
            </span>
            <h3 className="font-[family-name:var(--font-bengali-serif)] text-lg text-[var(--color-app-text)]">
              {topic.title}
            </h3>
          </div>
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

        <p className="text-sm leading-relaxed text-[var(--color-app-muted)] whitespace-pre-wrap mb-5">
          {topic.content}
        </p>

        <Link
          href={`/book-detailed/${encodeURIComponent(topic.subject)}/${topic.paperId}`}
          className="block text-center py-2.5 rounded-full text-sm font-semibold text-white"
          style={{ background: "var(--color-app-primary)" }}
        >
          সম্পূর্ণ পত্রে দেখুন →
        </Link>
      </div>
    </div>
  );
}

function FeaturedCard({ topic, onOpen, canManage }) {
  const iconPath = subjectIcons[topic.subject] || subjectIcons["বাংলা"];

  return (
    <div className="flex-shrink-0 w-56 rounded-xl p-3 bg-[var(--color-app-surface)] border border-[var(--color-app-border)] hover:border-[var(--color-app-primary)] transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <svg
            className="w-3.5 h-3.5 flex-shrink-0"
            fill="none"
            stroke="var(--color-app-primary)"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={iconPath}
            />
          </svg>
          <span className="text-[10px] font-semibold text-[var(--color-app-primary)] truncate">
            {topic.subject}
          </span>
        </div>
        <ThreeDotMenu topic={topic} canManage={canManage} />
      </div>

      <button onClick={onOpen} className="text-left w-full">
        <p className="text-xs font-semibold text-[var(--color-app-text)] line-clamp-1 mb-1">
          {topic.title}
        </p>
        <p className="text-[11px] leading-snug text-[var(--color-app-muted)] line-clamp-2 mb-1.5">
          {topic.content}
        </p>
        <span
          className="text-[10px] font-bold underline underline-offset-2"
          style={{ color: "var(--color-app-accent)" }}
        >
          ...আরও দেখুন
        </span>
      </button>
    </div>
  );
}

export default function FeaturedBar() {
  const pathname = usePathname();
  const { content, loading } = useBookDetailed();
  const { role, teacherVerified } = useAuth();
  const canManage = role === "teacher" && teacherVerified;
  const [showModal, setShowModal] = useState(false);
  const [previewTopic, setPreviewTopic] = useState(null);
  const scrollRef = useRef(null);

  if (loading) return null;
  if (pathname.startsWith("/book-detailed")) return null;

  const featuredTopics = [];
  Object.entries(content).forEach(([subject, subjectData]) => {
    subjectData.papers?.forEach((paper) => {
      paper.topics.forEach((topic) => {
        if (topic.featured) {
          featuredTopics.push({ ...topic, subject, paperId: paper.id });
        }
      });
    });
  });

  if (featuredTopics.length === 0 && !canManage) return null;

  function scroll(direction) {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;

    if (direction === "left") {
      if (el.scrollLeft <= 5) {
        el.scrollTo({ left: maxScroll, behavior: "auto" });
      } else {
        el.scrollBy({ left: -240, behavior: "smooth" });
      }
    } else {
      if (el.scrollLeft >= maxScroll - 5) {
        el.scrollTo({ left: 0, behavior: "auto" });
      } else {
        el.scrollBy({ left: 240, behavior: "smooth" });
      }
    }
  }

  return (
    <div className="bg-[var(--color-app-accent-soft)] border-b border-[var(--color-app-border)]">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-2.5">
        <div className="grid grid-cols-3 items-center mb-2">
          <div />
          <span className="text-center text-xs font-bold text-[var(--color-app-text)]">
            📌 চাকরির এডভান্স বই
          </span>
          <div className="flex justify-end items-center gap-2">
            <Link
              href="/book-detailed"
              className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border border-[var(--color-app-primary)] text-[var(--color-app-primary)] hover:bg-[var(--color-app-primary-soft)] transition-colors"
            >
              See All
            </Link>
            {canManage && (
              <button
                onClick={() => setShowModal(true)}
                className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full text-white"
                style={{ background: "var(--color-app-primary)" }}
              >
                + ফিচার্ড যোগ করুন
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-[var(--color-app-surface)] border border-[var(--color-app-border)] hover:border-[var(--color-app-primary)] transition-colors"
            aria-label="বামে স্ক্রল করুন"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="var(--color-app-text)"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div
            ref={scrollRef}
            className="flex-1 overflow-x-auto flex gap-2 scroll-smooth no-scrollbar"
          >
            {featuredTopics.length === 0 ? (
              <span className="text-xs text-[var(--color-app-muted)] py-1">
                এখনো কোনো ফিচার্ড টপিক নেই
              </span>
            ) : (
              featuredTopics.map((topic) => (
                <FeaturedCard
                  key={topic.id}
                  topic={topic}
                  canManage={canManage}
                  onOpen={() => setPreviewTopic(topic)}
                />
              ))
            )}
          </div>

          <button
            onClick={() => scroll("right")}
            className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-[var(--color-app-surface)] border border-[var(--color-app-border)] hover:border-[var(--color-app-primary)] transition-colors"
            aria-label="ডানে স্ক্রল করুন"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="var(--color-app-text)"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {showModal && <FeaturedManageModal onClose={() => setShowModal(false)} />}
      {previewTopic && (
        <FeaturedPreviewModal
          topic={previewTopic}
          onClose={() => setPreviewTopic(null)}
        />
      )}
    </div>
  );
}
