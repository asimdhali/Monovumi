"use client";

import { useState } from "react";
import RichTextEditor from "./editor/RichTextEditor";
import PostLocationModal from "./PostLocationModal";
import { useAuth } from "./../../AuthContext";

export default function ComposerModal({
  mode = "create",
  onClose,
  onSubmit,
  prefillEra = "",
  prefillChapter = "",
  initialTopic = null,
}) {
  const { user, profile, loading: authLoading } = useAuth();

  const [authorName, setAuthorName] = useState(
    initialTopic?.name ||
      initialTopic?.contributor ||
      profile?.name ||
      user?.displayName ||
      "",
  );

  const [content, setContent] = useState(initialTopic?.content || "");
  const [title, setTitle] = useState(initialTopic?.title || "");

  const [era, setEra] = useState(initialTopic?.era || prefillEra);

  const [chapter, setChapter] = useState(
    initialTopic?.chapter || prefillChapter,
  );

  const [subject, setSubject] = useState(initialTopic?.subject || "");

  const [showLocationModal, setShowLocationModal] = useState(false);

  const [postLocation, setPostLocation] = useState(
    initialTopic?.postLocation || null,
  );

  const [paperId, setPaperId] = useState(initialTopic?.paperId || "");

  const canPublish =
    content.trim().length >= 10 &&
    title.trim().length > 0 &&
    postLocation?.subject &&
    postLocation?.chapter &&
    postLocation?.paperId;

  async function handlePublish() {
    if (!canPublish) return;

    try {
      await onSubmit({
        subject: postLocation?.subject || subject,
        paperId: postLocation?.paperId || paperId,
        postLocation,

        title: title.trim(),
        content: content.trim(),

        era: era.trim(),
        chapter: chapter.trim() || "",

        contributor: authorName.trim() || "",

        contributorAvatar:
          initialTopic?.contributorAvatar ||
          initialTopic?.avatar ||
          profile?.photoURL ||
          user?.photoURL ||
          "",
      });

      // Firestore save সফল হওয়ার পরেই modal বন্ধ হবে
      onClose();
    } catch (error) {
      console.error("পোস্ট সংরক্ষণ করতে সমস্যা:", error);

      alert(error?.message || "পোস্ট সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।");
    }
  }

  return (
    <div className="fixed inset-0 z-[95] flex flex-col bg-[var(--color-app-bg)]">
      {/* Header */}
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
          {mode === "edit" ? "পোস্ট সম্পাদনা" : "নতুন পোস্ট"}
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
          {mode === "edit" ? "আপডেট করুন" : "প্রকাশ করুন"}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Profile */}
        <div className="flex items-center gap-2.5 mb-3.5">
          <div
            className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 bg-[var(--color-app-border)]"
            style={{
              boxShadow: "0 0 0 2px var(--color-app-accent-soft)",
            }}
          >
            {authLoading ? (
              <div className="w-full h-full animate-pulse bg-[var(--color-app-border)]" />
            ) : initialTopic?.avatar || initialTopic?.contributorAvatar ? (
              <img
                src={initialTopic.avatar || initialTopic.contributorAvatar}
                alt={authorName || "প্রোফাইল"}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : profile?.photoURL || user?.photoURL ? (
              <img
                src={profile?.photoURL || user?.photoURL}
                alt={authorName || "প্রোফাইল"}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-[var(--color-app-border)]" />
            )}
          </div>

          <div className="flex-1">
            <p className="text-[15px] font-semibold text-[var(--color-app-text)]">
              {authorName || "নাম পাওয়া যায়নি"}
            </p>

            <p className="text-[11px] text-[var(--color-app-muted)] mt-0.5">
              {mode === "edit" ? "পোস্টের লেখক" : "আপনার Google account"}
            </p>
          </div>
        </div>

        {/* Title */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="শিরোনাম লিখুন..."
          className="w-full bg-transparent text-[17px] font-bold text-[var(--color-app-text)] outline-none mb-3 placeholder:text-[var(--color-app-muted)]"
        />

        {/* Rich Text Content */}
        <RichTextEditor value={content} onChange={setContent} />

        {/* Post Location */}
        <div className="mt-5 mb-4">
          <button
            type="button"
            onClick={() => setShowLocationModal(true)}
            className="
      w-full
      flex
      items-center
      justify-between
      gap-3
      px-3.5
      py-3
      rounded-xl
      border
      border-[var(--color-app-border)]
      bg-[var(--color-app-surface)]
      text-left
      transition-colors
      hover:border-[var(--color-app-primary)]
      hover:bg-[var(--color-app-primary-soft)]
    "
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className="
          flex-shrink-0
          w-8
          h-8
          rounded-lg
          flex
          items-center
          justify-center
          text-[22px]
          font-light
          leading-none
        "
                style={{
                  color: "var(--color-app-primary)",
                }}
              >
                +
              </span>

              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-[var(--color-app-text)]">
                  {postLocation
                    ? `${postLocation.subject} / ${postLocation.chapter}`
                    : "পোস্ট লোকেশন নির্বাচন করুন"}
                </p>

                <p className="text-[11px] text-[var(--color-app-muted)] mt-0.5 truncate">
                  {postLocation
                    ? "লোকেশন পরিবর্তন করতে ক্লিক করুন"
                    : "যেমন- বিসিএস/বাংলা সাহিত্য/প্রাচীন কাল/চর্যাপদ"}
                </p>
              </div>
            </div>

            <span className="flex-shrink-0 text-lg text-[var(--color-app-muted)]">
              ›
            </span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-[var(--color-app-border)] flex-shrink-0">
        <span className="text-[11.5px] text-[var(--color-app-muted)]">
          {content.length} অক্ষর
        </span>

        <span className="text-[11.5px] text-[var(--color-app-muted)]">
          সর্বনিম্ন ১০ অক্ষর প্রয়োজন
        </span>
      </div>
      {showLocationModal && (
        <PostLocationModal
          onClose={() => setShowLocationModal(false)}
          onSelect={(location) => {
            setPostLocation(location);

            // Location থেকে subject নেওয়া হবে
            if (location?.subject) {
              setSubject(location.subject);
            }

            // নির্বাচিত Books-এর অধ্যায়/Volume-এর নাম
            if (location?.chapter) {
              setEra(location.chapter);
            }

            // Location থেকে paperId নেওয়া হবে
            if (location?.paperId) {
              setPaperId(location.paperId);
            }

            // গুরুত্বপূর্ণ:
            // এখানে setChapter(location.chapter) করা যাবে না

            setShowLocationModal(false);
          }}
        />
      )}
    </div>
  );
}
