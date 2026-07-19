"use client";

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
          href={`/book-detailed/${encodeURIComponent(topic.subject)}/${topic.paperId}`}
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

function ComposerTrigger({ onOpen, canPost }) {
  if (!canPost) {
    return (
      <div className="flex items-center gap-2.5 rounded-full px-3.5 py-3 mt-0 bg-[var(--color-app-surface)] border border-[var(--color-app-border)] opacity-70">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "var(--color-app-border)" }}
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
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <span className="flex-1 text-[13px] text-[var(--color-app-muted)]">
          পোস্ট করতে "শিক্ষক মোড"-এ যান
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={onOpen}
      className="w-full flex items-center gap-2.5 rounded-full px-3.5 py-3 mt-1 bg-[var(--color-app-surface)] border border-[var(--color-app-border)] text-left"
    >
      <div
        className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden"
        style={{ background: "var(--color-app-border)" }}
      >
        <img
          src="https://i.pravatar.cc/150?img=13"
          alt="আপনি"
          className="w-full h-full object-cover"
        />
      </div>
      <span className="flex-1 text-[13px] text-[var(--color-app-muted)]">
        শিক্ষক হিসেবে আপনার জ্ঞান শেয়ার করুন...
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

function ComposerModal({ onClose }) {
  const { addPost } = usePosts();
  const [content, setContent] = useState("");
  const [subject, setSubject] = useState(subjects[0]);
  const [type, setType] = useState(Object.keys(postTypes)[0]);
  const [image, setImage] = useState("");

  function handlePost() {
    if (!content.trim()) return;
    addPost({
      id: Date.now(),
      name: "আপনি",
      date: "আজ",
      avatar: "https://i.pravatar.cc/150?img=13",
      type,
      subject,
      verified: true,
      content: content.trim(),
      image: image.trim() || null,
      likes: 0,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[95] px-4">
      <div className="bg-[var(--color-app-surface)] rounded-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-[family-name:var(--font-bengali-serif)] text-lg text-[var(--color-app-text)]">
            পোস্ট লিখুন
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

        <div className="flex items-center gap-2.5 mb-3">
          <img
            src="https://i.pravatar.cc/150?img=13"
            alt="আপনি"
            className="w-9 h-9 rounded-full object-cover"
            style={{ boxShadow: "0 0 0 1.5px var(--color-app-accent)" }}
          />
          <span className="text-sm font-semibold text-[var(--color-app-text)]">
            আপনি
          </span>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          autoFocus
          placeholder="আপনার মনে কী চলছে..."
          className="w-full p-3 rounded-xl border text-sm resize-none bg-[var(--color-app-bg)] border-[var(--color-app-border)] text-[var(--color-app-text)] mb-3"
        />

        <div className="grid grid-cols-2 gap-2 mb-3">
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="p-2 rounded-lg border text-xs bg-[var(--color-app-bg)] border-[var(--color-app-border)] text-[var(--color-app-text)]"
          >
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="p-2 rounded-lg border text-xs bg-[var(--color-app-bg)] border-[var(--color-app-border)] text-[var(--color-app-text)]"
          >
            {Object.keys(postTypes).map((t) => (
              <option key={t} value={t}>
                {postTypes[t]} {t}
              </option>
            ))}
          </select>
        </div>

        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="🖼️ ছবির লিংক (ঐচ্ছিক)"
          className="w-full p-2.5 rounded-lg border text-xs bg-[var(--color-app-bg)] border-[var(--color-app-border)] text-[var(--color-app-text)] mb-4"
        />

        <button
          onClick={handlePost}
          disabled={!content.trim()}
          className="w-full py-2.5 rounded-full text-sm font-semibold text-white disabled:opacity-40"
          style={{ background: "var(--color-app-primary)" }}
        >
          পোস্ট করুন
        </button>
      </div>
    </div>
  );
}

export default function FeaturedBar() {
  const pathname = usePathname();
  const { content, loading } = useBookDetailed();
  const { role, teacherVerified } = useAuth();
  const canManage = role === "teacher" && teacherVerified;
  const canPost = canManage;
  const [previewTopic, setPreviewTopic] = useState(null);
  const [showComposer, setShowComposer] = useState(false);

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
          canPost={canPost}
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
        {showComposer && (
          <ComposerModal onClose={() => setShowComposer(false)} />
        )}
      </div>
    </div>
  );
}
