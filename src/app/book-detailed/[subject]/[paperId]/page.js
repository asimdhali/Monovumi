"use client";

import { use, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useBookDetailed } from "../../../BookDetailedContext";
import { useAuth } from "../../../AuthContext";

function toBengaliNum(n) {
  const digits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(n)
    .split("")
    .map((d) => digits[parseInt(d, 10)])
    .join("")
    .padStart(2, "০");
}

function highlightMatch(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark
        style={{
          background: "var(--color-app-accent)",
          color: "#1a1a12",
          padding: "0 2px",
          borderRadius: "2px",
        }}
      >
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function TopicPreviewModal({ topic, subject, onClose }) {
  const [liked, setLiked] = useState(false);
  const [likeCount] = useState(() => Math.floor(Math.random() * 25) + 4);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[95] px-4">
      <div className="bg-[var(--color-app-surface)] rounded-2xl w-full max-w-md sm:max-w-lg max-h-[90vh] sm:max-h-[80vh] overflow-y-auto p-4 sm:p-6 mx-2">
        <div className="flex items-start justify-between gap-3 mb-3">
          <span
            className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full"
            style={{
              background: "var(--color-app-accent-soft)",
              color: "var(--color-app-accent)",
            }}
          >
            {subject} · {topic.chapter || topic.era}
          </span>
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

        {topic.contributor && (
          <div className="flex items-center gap-2 mb-3">
            {topic.contributorAvatar && (
              <img
                src={topic.contributorAvatar}
                alt={topic.contributor}
                className="w-6 h-6 rounded-full object-cover"
                style={{ boxShadow: "0 0 0 1.5px var(--color-app-accent)" }}
              />
            )}
            <span className="text-xs font-semibold text-[var(--color-app-muted)]">
              👑 {topic.contributor}
            </span>
          </div>
        )}

        <h3 className="font-[family-name:var(--font-bengali-serif)] text-xl text-[var(--color-app-text)] mb-3">
          {topic.title}
        </h3>
        <p className="text-sm leading-[1.9] text-[var(--color-app-text)] whitespace-pre-wrap mb-5">
          {topic.content}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-[var(--color-app-border)]">
          <button
            onClick={() => setLiked(!liked)}
            className="flex items-center gap-1.5 text-sm font-medium"
            style={{ color: liked ? "#e0637a" : "var(--color-app-muted)" }}
          >
            <svg
              className="w-[17px] h-[17px]"
              fill={liked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {likeCount + (liked ? 1 : 0)}
          </button>
          <button
            onClick={() => alert("মন্তব্য সেকশন শীঘ্রই আসছে")}
            className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-app-muted)]"
          >
            <svg
              className="w-[17px] h-[17px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
            </svg>
            মন্তব্য
          </button>
          <button
            onClick={() => alert("শেয়ার শীঘ্রই আসছে")}
            className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-app-muted)]"
          >
            <svg
              className="w-[17px] h-[17px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
            </svg>
            শেয়ার
          </button>
        </div>
      </div>
    </div>
  );
}

function TopicFormModal({ initial, onClose, onSubmit, onDelete }) {
  const [form, setForm] = useState(
    initial || { era: "", chapter: "", title: "", content: "" },
  );

  function handleSubmit() {
    if (!form.era.trim() || !form.title.trim() || !form.content.trim()) return;
    onSubmit(form);
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[95] px-4">
      <div className="bg-[var(--color-app-surface)] rounded-2xl w-full max-w-md sm:max-w-lg p-4 sm:p-6 max-h-[90vh] sm:max-h-[85vh] overflow-y-auto mx-2">
        <h3 className="font-[family-name:var(--font-bengali-serif)] text-lg text-[var(--color-app-text)] mb-4">
          {initial ? "টপিক আপডেট করুন" : "নতুন টপিক যোগ করুন"}
        </h3>
        <div className="space-y-3">
          <input
            value={form.era}
            onChange={(e) => setForm({ ...form, era: e.target.value })}
            placeholder="খণ্ড / যুগ (যেমন: প্রথম খণ্ড: প্রাচীন যুগ)"
            className="w-full p-2.5 rounded-lg border text-sm bg-[var(--color-app-bg)] border-[var(--color-app-border)] text-[var(--color-app-text)]"
          />
          <input
            value={form.chapter || ""}
            onChange={(e) => setForm({ ...form, chapter: e.target.value })}
            placeholder="অধ্যায় (ঐচ্ছিক, যেমন: অধ্যায় ১.১ · চর্যাপদ)"
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
            placeholder="বিস্তারিত লেখা"
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
          {onDelete && (
            <button
              onClick={() => {
                if (confirm("এই টপিকটি স্থায়ীভাবে মুছে যাবে, নিশ্চিত?"))
                  onDelete();
              }}
              className="w-full text-center py-2 text-xs font-semibold text-red-400"
            >
              🗑️ টপিক ডিলিট করুন
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ComposerModal({
  onClose,
  onSubmit,
  prefillEra = "",
  prefillChapter = "",
}) {
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [era, setEra] = useState(prefillEra);
  const [chapter, setChapter] = useState(prefillChapter);
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const canPublish =
    content.trim().length >= 10 &&
    title.trim().length > 0 &&
    era.trim().length > 0;

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target.result);
    reader.readAsDataURL(file);
  }

  function handlePublish() {
    if (!canPublish) return;
    onSubmit({
      title: title.trim(),
      content: content.trim(),
      era: era.trim(),
      chapter: chapter.trim() || "",
      contributor: authorName.trim() || "আপনি",
      contributorAvatar: "https://i.pravatar.cc/150?img=13",
      image: image || null,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[95] flex flex-col bg-[var(--color-app-bg)]">
      {/* হেডার */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-[var(--color-app-border)] flex-shrink-0">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[var(--color-app-primary-soft)]"
          aria-label="বন্ধ করুন"
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
        <span className="text-[15px] font-bold text-[var(--color-app-text)]">
          নতুন পোস্ট
        </span>
        <button
          onClick={handlePublish}
          disabled={!canPublish}
          className="rounded-full px-4 py-2 text-[13.5px] font-bold text-white"
          style={{
            background: canPublish
              ? "var(--color-app-primary)"
              : "var(--color-app-border)",
            cursor: canPublish ? "pointer" : "not-allowed",
          }}
        >
          প্রকাশ করুন
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* প্রোফাইল */}
        <div className="flex items-center gap-2.5 mb-3.5">
          <img
            src="https://i.pravatar.cc/150?img=13"
            alt="আপনি"
            className="w-11 h-11 rounded-full object-cover"
            style={{ boxShadow: "0 0 0 2px var(--color-app-accent-soft)" }}
          />
          <div className="flex-1">
            <input
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="আপনার নাম লিখুন"
              className="w-full bg-transparent text-[15px] font-semibold text-[var(--color-app-text)] outline-none"
            />
            <div
              className="text-[11px] font-semibold flex items-center gap-1 mt-0.5"
              style={{ color: "var(--color-app-accent)" }}
            >
              👑 যাচাইকৃত শিক্ষক হিসেবে পোস্ট হবে
            </div>
          </div>
        </div>

        {/* শিরোনাম */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="শিরোনাম লিখুন..."
          className="w-full bg-transparent text-[17px] font-bold text-[var(--color-app-text)] outline-none mb-3 placeholder:text-[var(--color-app-muted)]"
        />

        {/* কন্টেন্ট */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          autoFocus
          placeholder="আপনার মনের কথা, জ্ঞান বা অভিজ্ঞতা লিখুন..."
          className="w-full bg-transparent resize-none outline-none text-[16px] leading-relaxed text-[var(--color-app-text)] placeholder:text-[var(--color-app-muted)] min-h-[140px]"
        />

        {/* ছবি */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        {image ? (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 w-full rounded-2xl overflow-hidden border border-[var(--color-app-border)]"
          >
            <img
              src={image}
              alt="সংযুক্ত ছবি"
              className="w-full max-h-[220px] object-cover"
            />
          </button>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 w-full rounded-2xl border-[1.5px] border-dashed border-[var(--color-app-border)] py-4 text-[13px] text-[var(--color-app-muted)]"
          >
            📷 ছবি যোগ করুন (ঐচ্ছিক)
          </button>
        )}

        {/* খণ্ড / যুগ */}
        <div className="text-[12px] font-bold text-[var(--color-app-muted)] mt-5 mb-2 tracking-wide">
          খণ্ড / যুগ
        </div>
        <input
          value={era}
          onChange={(e) => setEra(e.target.value)}
          placeholder="যেমন: প্রাচীনকাল, মধ্যযুগ..."
          className="w-full p-3 rounded-xl border text-sm bg-[var(--color-app-surface)] border-[var(--color-app-border)] text-[var(--color-app-text)] outline-none"
        />

        {/* অধ্যায় */}
        <div className="text-[12px] font-bold text-[var(--color-app-muted)] mt-4 mb-2 tracking-wide">
          অধ্যায় (ঐচ্ছিক)
        </div>
        <input
          value={chapter}
          onChange={(e) => setChapter(e.target.value)}
          placeholder="যেমন: অধ্যায় ১.১ · চর্যাপদ"
          className="w-full p-3 rounded-xl border text-sm bg-[var(--color-app-surface)] border-[var(--color-app-border)] text-[var(--color-app-text)] outline-none"
        />
      </div>

      {/* ফুটার */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-[var(--color-app-border)] flex-shrink-0">
        <span className="text-[11.5px] text-[var(--color-app-muted)]">
          {content.length} অক্ষর
        </span>
        <span className="text-[11.5px] text-[var(--color-app-muted)]">
          সর্বনিম্ন ১০ অক্ষর প্রয়োজন
        </span>
      </div>
    </div>
  );
}

export default function PaperPage({ params }) {
  const { subject: rawSubject, paperId } = use(params);
  const subject = decodeURIComponent(rawSubject);
  const {
    content,
    addTopic,
    editTopic,
    deleteTopic,
    moveTopicUp,
    moveTopicDown,
  } = useBookDetailed();
  const { role, teacherVerified } = useAuth();
  const canManage = role === "teacher" && teacherVerified;

  const [query, setQuery] = useState("");
  const [openEras, setOpenEras] = useState({});
  const [previewTopic, setPreviewTopic] = useState(null);
  const [editingTopic, setEditingTopic] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formEra, setFormEra] = useState("");
  const [showComposer, setShowComposer] = useState(false);
  const [hoveredEra, setHoveredEra] = useState(null);
  const [composerEra, setComposerEra] = useState("");
  const [composerChapter, setComposerChapter] = useState("");

  const subjectData = content?.[subject];
  const paper = subjectData?.papers?.find((p) => p.id === paperId);

  if (!subjectData || !paper) {
    return (
      <div className="max-w-2xl mx-auto px-4 lg:px-6 pt-6">
        <p className="text-[var(--color-app-muted)]">
          পত্রটি খুঁজে পাওয়া যায়নি।
        </p>
      </div>
    );
  }

  const q = query.trim().toLowerCase();

  // sortOrder অনুযায়ী আগে সাজানো
  const sortedTopics = [...paper.topics].sort(
    (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0),
  );

  // খণ্ড/যুগ অনুযায়ী গ্রুপ, তারপর প্রতিটার ভেতরে অধ্যায় অনুযায়ী সাব-গ্রুপ
  const volumeGroups = [];

  sortedTopics.forEach((topic) => {
    let vol = volumeGroups.find((v) => v.era === topic.era);

    if (!vol) {
      vol = {
        era: topic.era,
        chapters: [],
      };
      volumeGroups.push(vol);
    }

    const chapterKey = topic.chapter || "__none__";

    let ch = vol.chapters.find((c) => c.key === chapterKey);

    if (!ch) {
      ch = {
        key: chapterKey,
        title: topic.chapter || null,
        topics: [],
      };
      vol.chapters.push(ch);
    }

    ch.topics.push(topic);
  });

  // সার্চ ফিল্টার (খণ্ড, অধ্যায়, শিরোনাম — যেকোনোটাই মিললে)
  const filteredVolumes = volumeGroups
    .map((vol) => {
      if (!q) return vol;
      const volMatches = vol.era.toLowerCase().includes(q);
      const chapters = vol.chapters
        .map((ch) => {
          const chMatches = ch.title && ch.title.toLowerCase().includes(q);
          const topics =
            volMatches || chMatches
              ? ch.topics
              : ch.topics.filter((t) => t.title.toLowerCase().includes(q));
          return { ...ch, topics };
        })
        .filter((ch) => ch.topics.length > 0);
      return { ...vol, chapters };
    })
    .filter((vol) => vol.chapters.length > 0);

  const totalMatches = filteredVolumes.reduce(
    (sum, v) => sum + v.chapters.reduce((s, c) => s + c.topics.length, 0),
    0,
  );
  const noResults = q && filteredVolumes.length === 0;

  function isVolOpen(era) {
    if (q) return true;
    return !!openEras[era];
  }

  function toggleVol(era) {
    setOpenEras((prev) => ({ ...prev, [era]: !prev[era] }));
  }

  return (
    <div className="w-full min-h-screen bg-[var(--color-app-bg)]">
      {/* মূল কন্টেন্ট — মোবাইলে ফুল-উইডথ, বড় স্ক্রিনে সেন্টার্ড */}
      <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 lg:px-6 pt-4 pb-20 sm:pb-16">
        {/* হেডার — ছবির মতো */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <Link
              href={`/book-detailed/${encodeURIComponent(subject)}`}
              className="w-9 h-9 rounded-full bg-[var(--color-app-surface)] border border-[var(--color-app-border)] flex items-center justify-center hover:bg-[var(--color-app-primary-soft)] transition-colors flex-shrink-0"
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
            </Link>
            <div>
              <h1 className="font-[family-name:var(--font-bengali-serif)] text-[17px] font-bold text-[var(--color-app-text)] leading-tight">
                {paper.title}
              </h1>
              <p className="text-[11px] text-[var(--color-app-muted)] mt-0.5">
                {subject} · {paper.topics.length}টি খণ্ড
              </p>
            </div>
          </div>
          {canManage && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1.5 rounded-full text-[var(--color-app-text)] text-xs font-semibold px-4 py-2 border border-[var(--color-app-border)] bg-[var(--color-app-surface)] hover:bg-[var(--color-app-primary-soft)] transition-colors"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                viewBox="0 0 24 24"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              নতুন
            </button>
          )}
        </div>
        {/* সার্চ */}
        <div className="relative mb-2">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-app-muted)]">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="টপিক, অধ্যায় বা খণ্ডের নাম লিখে খুঁজুন..."
            className="w-full pl-10 pr-9 py-2.5 sm:py-3 rounded-xl border text-sm outline-none bg-[var(--color-app-surface)] border-[var(--color-app-border)] text-[var(--color-app-text)]"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center bg-[var(--color-app-border)] text-[var(--color-app-muted)]"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                viewBox="0 0 24 24"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {q && !noResults && (
          <p className="text-xs text-[var(--color-app-muted)] mb-4 pl-1">
            {totalMatches}টি টপিক পাওয়া গেছে
          </p>
        )}
        {!q && <div className="mb-4" />}

        {noResults && (
          <div className="text-center py-14">
            <p className="text-3xl mb-2">🔍</p>
            <p className="text-sm text-[var(--color-app-muted)]">
              কোনো টপিক পাওয়া যায়নি — অন্য কোনো শব্দ দিয়ে খুঁজে দেখুন।
            </p>
          </div>
        )}

        {paper.topics.length === 0 && !q && (
          <p className="text-sm text-[var(--color-app-muted)] py-8 text-center">
            এই পত্রে এখনো কোনো টপিক যোগ হয়নি।
          </p>
        )}

        {/* খণ্ড-ভিত্তিক অ্যাকর্ডিয়ন */}
        {filteredVolumes.map((vol) => {
          const open = isVolOpen(vol.era);
          return (
            <div
              key={vol.era}
              className="rounded-2xl border mb-3 overflow-hidden bg-[var(--color-app-surface)] border-[var(--color-app-border)]"
            >
              <div
                className="flex items-center justify-between px-4 py-3.5"
                style={{ borderLeft: "3px solid var(--color-app-primary)" }}
                onMouseEnter={() => setHoveredEra(vol.era)}
                onMouseLeave={() => setHoveredEra(null)}
              >
                <button
                  onClick={() => toggleVol(vol.era)}
                  className="flex-1 flex items-center justify-between text-left"
                >
                  <div>
                    <h2 className="font-[family-name:var(--font-bengali-serif)] text-[15px] font-bold text-[var(--color-app-text)]">
                      {highlightMatch(vol.era, q)}
                    </h2>
                    <p className="text-[11px] text-[var(--color-app-muted)] mt-0.5">
                      {vol.chapters.reduce((s, c) => s + c.topics.length, 0)}টি
                      টপিক
                    </p>
                  </div>
                </button>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* চেভরন বাটন */}
                  <button
                    onClick={() => toggleVol(vol.era)}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--color-app-primary-soft)] transition-colors"
                  >
                    <svg
                      className="w-4 h-4 transition-transform"
                      style={{
                        transform: open ? "rotate(180deg)" : "rotate(0deg)",
                        color: "var(--color-app-muted)",
                      }}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>

                  {/* নতুন বাটন — শুধু হোভার বা ওপেন থাকলে দেখাবে */}
                  {(hoveredEra === vol.era || open) && canManage && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setComposerEra(vol.era);
                        setComposerChapter("");
                        setEditingTopic(topic);
                        setShowComposer(true);
                      }}
                      className="flex items-center gap-1 rounded-full text-[11px] font-semibold px-3 py-1.5 border border-[var(--color-app-border)] bg-[var(--color-app-bg)] text-[var(--color-app-muted)] hover:text-[var(--color-app-primary)] hover:border-[var(--color-app-primary)] transition-all duration-200 animate-fadeIn"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                      নতুন
                    </button>
                  )}
                </div>
              </div>

              {open && (
                <div className="px-4 pb-4 pt-1 border-t border-[var(--color-app-border)]">
                  {vol.chapters.map((ch) => (
                    <div key={ch.key} className="mt-4 first:mt-3">
                      {ch.title && (
                        <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-dashed border-[var(--color-app-border)]">
                          <h3
                            className="text-[13px] font-bold"
                            style={{ color: "var(--color-app-primary)" }}
                          >
                            {highlightMatch(ch.title, q)}
                          </h3>
                          {ch.topics[0]?.contributor && (
                            <span className="flex items-center gap-1.5 flex-shrink-0">
                              {ch.topics[0].contributorAvatar && (
                                <img
                                  src={ch.topics[0].contributorAvatar}
                                  alt={ch.topics[0].contributor}
                                  className="w-5 h-5 rounded-full object-cover"
                                  style={{
                                    boxShadow:
                                      "0 0 0 1.5px var(--color-app-accent)",
                                  }}
                                />
                              )}
                              <span className="text-[10.5px] text-[var(--color-app-muted)] whitespace-nowrap">
                                {ch.topics[0].contributor}
                              </span>
                            </span>
                          )}
                        </div>
                      )}
                      <ul className="space-y-2">
                        {ch.topics.map((topic, index) => (
                          <li
                            key={topic.id}
                            onClick={() => setPreviewTopic(topic)}
                            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 cursor-pointer transition-colors bg-[var(--color-app-bg)] border border-[var(--color-app-border)] hover:border-[var(--color-app-primary)]"
                          >
                            <span
                              className="font-[family-name:var(--font-bengali-serif)] text-xs flex-shrink-0 w-6"
                              style={{ color: "var(--color-app-accent)" }}
                            >
                              {toBengaliNum(index + 1)}
                            </span>
                            <span className="text-[13.5px] flex-1 min-w-0 text-[var(--color-app-text)]">
                              {highlightMatch(topic.title, q)}
                            </span>
                            {canManage && (
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    moveTopicUp(subject, paperId, topic.id);
                                  }}
                                  className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[var(--color-app-primary-soft)]"
                                  title="উপরে নিন"
                                >
                                  ⬆️
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    moveTopicDown(subject, paperId, topic.id);
                                  }}
                                  className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[var(--color-app-primary-soft)]"
                                  title="নিচে নামান"
                                >
                                  ⬇️
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingTopic(topic);
                                  }}
                                  className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[var(--color-app-primary-soft)]"
                                  title="সম্পাদনা"
                                >
                                  <svg
                                    className="w-3.5 h-3.5"
                                    fill="none"
                                    stroke="var(--color-app-primary)"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" />
                                    <path d="M17.5 3.5a2.12 2.12 0 013 3L11 16l-4 1 1-4 9.5-9.5z" />
                                  </svg>
                                </button>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <p className="text-center text-[11px] text-[var(--color-app-muted)] mt-6 tracking-wide">
          মনোভূমি · {paper.title}
        </p>
      </div>

      {/* মোডালসমূহ */}
      {previewTopic && (
        <TopicPreviewModal
          topic={previewTopic}
          subject={subject}
          onClose={() => setPreviewTopic(null)}
        />
      )}

      {editingTopic && (
        <TopicFormModal
          initial={{
            era: editingTopic.era,
            chapter: editingTopic.chapter || "",
            title: editingTopic.title,
            content: editingTopic.content,
          }}
          onClose={() => setEditingTopic(null)}
          onSubmit={(fields) => {
            editTopic(subject, paperId, editingTopic.id, fields);
            setEditingTopic(null);
          }}
          onDelete={() => {
            deleteTopic(subject, paperId, editingTopic.id);
            setEditingTopic(null);
          }}
        />
      )}

      {showAddForm && (
        <TopicFormModal
          initial={
            formEra
              ? { era: formEra, chapter: "", title: "", content: "" }
              : undefined
          }
          onClose={() => {
            setShowAddForm(false);
            setFormEra("");
          }}
          onSubmit={(fields) => {
            addTopic(subject, paperId, {
              id: Date.now(),
              sortOrder: Date.now(),
              ...fields,
              featured: false,
            });
            setShowAddForm(false);
            setFormEra("");
          }}
        />
      )}

      {showComposer && (
        <ComposerModal
          prefillEra={composerEra}
          prefillChapter={composerChapter}
          onClose={() => {
            setShowComposer(false);
            setComposerEra("");
            setComposerChapter("");
          }}
          onSubmit={(fields) => {
            addTopic(subject, paperId, {
              id: Date.now(),
              ...fields,
              featured: false,
            });
            setShowComposer(false);
            setComposerEra("");
            setComposerChapter("");
          }}
        />
      )}
    </div>
  );
}
