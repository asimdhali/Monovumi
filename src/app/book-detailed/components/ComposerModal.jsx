"use client";

import { useState, useRef } from "react";

export default function ComposerModal({
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
