"use client";

import ComposerModal from "./books/components/ComposerModal";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useBookDetailed } from "./BookDetailedContext";
import { useAuth } from "./AuthContext";
import { usePosts } from "./PostsContext";
import { subjects, postTypes } from "./data";

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
    const url = `${window.location.origin}/books/${encodeURIComponent(topic.subject)}/${topic.paperId}`;
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
        className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-[var(--color-app-primary-soft)]"
        aria-label="আরও অপশন"
      >
        <svg
          className="w-3.5 h-3.5"
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
                className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-[var(--color-app-primary-soft)]"
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
    era: topic.era || "",
    chapter: topic.chapter || "",
    title: topic.title || "",
    content: topic.content || "",
    editType: "major",
  });

  function handleSubmit() {
    if (!form.title.trim() || !form.content.trim()) return;
    onSave(form);
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[95] px-4"
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
          <input
            value={form.chapter}
            onChange={(e) =>
              setForm({
                ...form,
                chapter: e.target.value,
              })
            }
            placeholder="অধ্যায়"
            className="w-full p-2.5 rounded-lg border text-sm bg-[var(--color-app-bg)] border-[var(--color-app-border)] text-[var(--color-app-text)]"
          />
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={6}
            className="w-full p-2.5 rounded-lg border text-sm resize-none bg-[var(--color-app-bg)] border-[var(--color-app-border)] text-[var(--color-app-text)]"
          />
          <div className="flex gap-6 pt-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={form.editType === "major"}
                onChange={() =>
                  setForm({
                    ...form,
                    editType: "major",
                  })
                }
              />
              Major Update
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={form.editType === "minor"}
                onChange={() =>
                  setForm({
                    ...form,
                    editType: "minor",
                  })
                }
              />
              Minor Edit
            </label>
          </div>
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
  const subjectKeys = Object.keys(content);
  const [selectedSubject, setSelectedSubject] = useState(subjectKeys[0] || "");
  const [selectedPaperId, setSelectedPaperId] = useState("");

  const subjectData = content[selectedSubject];
  const papers = subjectData?.papers || [];
  const paper = papers.find((p) => p.id === selectedPaperId) || papers[0];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[90] px-4">
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
            {subjectKeys.map((s) => (
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[90] px-4">
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

        <div
          className="prose-content text-sm leading-[1.9] text-[var(--color-app-text)] mb-5"
          dangerouslySetInnerHTML={{
            __html: topic.content,
          }}
        />

        <Link
          href={`/books/${encodeURIComponent(topic.subject)}/${topic.paperId}`}
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
  return (
    <div
      className="relative flex-shrink-0 rounded-2xl p-3.5 bg-[var(--color-app-surface)] border border-[var(--color-app-border)]"
      style={{ width: 250, scrollSnapAlign: "start" }}
    >
      <div className="absolute top-2 right-2">
        <ThreeDotMenu topic={topic} canManage={canManage} />
      </div>

      <div className="flex items-center gap-1.5 mb-2 pr-5">
        <span className="text-[14.5px] font-bold text-[var(--color-app-text)] truncate min-w-0">
          {topic.title}
        </span>
        <span
          className="text-[11.5px] font-bold flex-shrink-0"
          style={{ color: "var(--color-app-primary)" }}
        >
          {topic.subject}
        </span>
        <Link
          href={`/books/${encodeURIComponent(topic.subject)}/${topic.paperId}`}
          className="ml-auto flex-shrink-0 flex items-center gap-0.5 text-xs font-bold"
          style={{ color: "var(--color-app-accent)" }}
        >
          সব
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>

      <button onClick={onOpen} className="text-left w-full">
        <p className="text-[12.5px] leading-relaxed text-[var(--color-app-muted)] line-clamp-2">
          {topic.content}{" "}
          <span
            className="font-bold"
            style={{ color: "var(--color-app-accent)" }}
          >
            ...আরও
          </span>
        </p>
      </button>
    </div>
  );
}

function FeaturedCarousel({ featuredTopics, canManage, onOpenPreview }) {
  const trackRef = useRef(null);
  const [activeDot, setActiveDot] = useState(0);

  function handleScroll() {
    const el = trackRef.current;
    if (!el || !el.children.length) return;
    const cardWidth = el.children[0].offsetWidth + 12;
    const idx = Math.round(el.scrollLeft / cardWidth);
    setActiveDot(idx);
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex gap-3 overflow-x-auto no-scrollbar pb-1 min-w-0"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {featuredTopics.map((topic) => (
          <FeaturedCard
            key={topic.id}
            topic={topic}
            canManage={canManage}
            onOpen={() => onOpenPreview(topic)}
          />
        ))}
      </div>
      {featuredTopics.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-1">
          {featuredTopics.map((_, i) => (
            <span
              key={i}
              className="rounded-full transition-all duration-200"
              style={{
                width: i === activeDot ? 16 : 5,
                height: 5,
                background:
                  i === activeDot
                    ? "var(--color-app-primary)"
                    : "var(--color-app-border)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ComposerTrigger({
  onOpen,
  canPost,
  profile,
  authLoading,
  onLoginRequired,
}) {
  return (
    <button
      onClick={canPost ? onOpen : onLoginRequired}
      className="w-full flex items-center gap-2.5 rounded-full px-3.5 py-3 mt-1 bg-[var(--color-app-surface)] border border-[var(--color-app-border)] text-left"
    >
      <div
        className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden"
        style={{ background: "var(--color-app-border)" }}
      >
        {authLoading ? (
          <div className="w-full h-full animate-pulse bg-[var(--color-app-border)]" />
        ) : profile?.photoURL ? (
          <img
            src={profile.photoURL}
            alt={profile.name || "প্রোফাইল"}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full bg-[var(--color-app-border)]" />
        )}
      </div>

      <span className="flex-1 text-[13px] text-[var(--color-app-muted)]">
        শিক্ষা বিপ্লবে অংশ নিন- পোস্ট করুন...
      </span>

      <div
        className="w-7 h-7 flex-shrink-0 flex items-center justify-center"
        style={{ color: "var(--color-app-primary)" }}
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
            d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
          />
        </svg>
      </div>
    </button>
  );
}

function LoginRequiredModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl bg-[var(--color-app-surface)] border border-[var(--color-app-border)] p-6 shadow-2xl"
      >
        <div className="text-center">
          <div
            className="mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: "var(--color-app-primary-soft)",
              color: "var(--color-app-primary)",
            }}
          >
            🔐
          </div>

          <h3 className="text-lg font-bold text-[var(--color-app-text)] mb-2">
            পোস্ট করতে লগইন করুন
          </h3>

          <p className="text-sm leading-relaxed text-[var(--color-app-muted)] mb-5">
            মনোভূমিতে পোস্ট, মন্তব্য ও অন্যান্য ফিচার ব্যবহার করতে আপনার
            অ্যাকাউন্টে লগইন করুন।
          </p>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-full text-sm font-medium border border-[var(--color-app-border)] text-[var(--color-app-muted)]"
            >
              পরে করব
            </button>

            <Link
              href="/login"
              className="flex-1 py-2.5 rounded-full text-sm font-semibold text-white text-center"
              style={{
                background: "var(--color-app-primary)",
              }}
            >
              লগইন করুন
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedBar() {
  const pathname = usePathname();
  const { content, loading, addTopic } = useBookDetailed();

  const { user, profile, canManage, canPost, loading: authLoading } = useAuth();

  const [previewTopic, setPreviewTopic] = useState(null);
  const [showComposer, setShowComposer] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  if (loading) return null;
  if (pathname !== "/") return null;

  const featuredTopics = [];
  Object.entries(content).forEach(([subject, subjectData]) => {
    subjectData.papers?.forEach((paper) => {
      paper.topics.forEach((topic) => {
        if (topic.featured)
          featuredTopics.push({ ...topic, subject, paperId: paper.id });
      });
    });
  });

  return (
    <div className="px-4 pt-0 pb-1 overflow-x-hidden">
      <div className="max-w-xl mx-auto">
        <ComposerTrigger
          onOpen={() => setShowComposer(true)}
          onLoginRequired={() => setShowLoginModal(true)}
          canPost={canPost}
          profile={profile}
          authLoading={authLoading}
        />

        {featuredTopics.length > 0 && (
          <div className="mt-1">
            <FeaturedCarousel
              featuredTopics={featuredTopics}
              canManage={canManage}
              onOpenPreview={setPreviewTopic}
            />
          </div>
        )}

        {previewTopic && (
          <FeaturedPreviewModal
            topic={previewTopic}
            onClose={() => setPreviewTopic(null)}
          />
        )}
        {showLoginModal && (
          <LoginRequiredModal onClose={() => setShowLoginModal(false)} />
        )}
        {showComposer && (
          <ComposerModal
            onClose={() => setShowComposer(false)}
            initialTopic={null}
            prefillEra=""
            prefillChapter=""
            onSubmit={async (topic) => {
              await addTopic(topic.subject, topic.paperId, topic);

              setShowComposer(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
