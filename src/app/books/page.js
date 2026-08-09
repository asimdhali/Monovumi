"use client";

import { useState } from "react";
import Link from "next/link";
import { useBookDetailed } from "../BookDetailedContext";

const subjectIcons = {
  বাংলা: "📖",
  ইংরেজি: "🔤",
  গণিত: "🧮",
  বিজ্ঞান: "🔬",
};

const availableIcons = [
  "📖",
  "🔤",
  "🧮",
  "🔬",
  "📚",
  "🏛️",
  "🌍",
  "💻",
  "⚖️",
  "🎨",
  "🎵",
  "🧪",
  "🚀",
  "🌱",
  "📐",
  "🧠",
];

export default function BookDetailedPage() {
  const { content, addSubject } = useBookDetailed();

  const [showModal, setShowModal] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("📚");
  const [error, setError] = useState("");

  const subjects = Object.keys(content);

  async function handleAddSubject() {
    const name = subjectName.trim();

    if (!name) {
      setError("বিষয়ের নাম লিখুন।");
      return;
    }

    if (content[name]) {
      setError("এই বিষয়টি ইতিমধ্যে আছে।");
      return;
    }

    try {
      await addSubject(name, selectedIcon);

      setSubjectName("");
      setSelectedIcon("📚");
      setError("");
      setShowModal(false);
    } catch (error) {
      console.error(error);
      setError("বিষয় যোগ করা যায়নি। আবার চেষ্টা করুন।");
    }
  }

  return (
    <div className="min-h-screen px-4 py-6">
      {/* Header */}
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-app-text)]">
              বই বিস্তারিত
            </h1>

            <p className="text-sm mt-1 text-[var(--color-app-muted)]">
              প্রাচীনকাল থেকে আধুনিক কাল — যুগ অনুযায়ী সাজানো নোট ও পাঠ্যবিষয়
            </p>
          </div>

          {/* + Button */}
          <button
            onClick={() => {
              setSubjectName("");
              setSelectedIcon("📚");
              setError("");
              setShowModal(true);
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-2xl font-bold bg-[var(--color-app-primary)] text-white hover:opacity-90 transition"
            aria-label="নতুন বিষয় যোগ করুন"
          >
            +
          </button>
        </div>

        {/* Subject Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {subjects.map((subject) => {
            const subjectData = content[subject];

            return (
              <Link
                key={subject}
                href={`/books/${encodeURIComponent(subject)}`}
                className="text-center rounded-2xl border p-6 bg-[var(--color-app-surface)] border-[var(--color-app-border)] hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-2">
                  {subjectData?.icon || subjectIcons[subject] || "📚"}
                </div>

                <p className="font-semibold text-sm text-[var(--color-app-text)]">
                  {subject}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Add Subject Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-5 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[var(--color-app-text)]">
                নতুন বিষয় যোগ করুন
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="text-xl text-[var(--color-app-muted)] hover:text-[var(--color-app-text)]"
              >
                ×
              </button>
            </div>

            {/* Subject Name */}
            <label className="block text-sm font-semibold mb-2 text-[var(--color-app-text)]">
              বিষয়ের নাম
            </label>

            <input
              type="text"
              value={subjectName}
              onChange={(e) => {
                setSubjectName(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddSubject();
                }
              }}
              placeholder="যেমন: ইতিহাস"
              className="w-full rounded-xl border border-[var(--color-app-border)] bg-transparent px-4 py-3 text-[var(--color-app-text)] outline-none focus:border-[var(--color-app-accent)]"
              autoFocus
            />

            {/* Icon Selection */}
            <label className="block text-sm font-semibold mt-5 mb-3 text-[var(--color-app-text)]">
              আইকন নির্বাচন করুন
            </label>

            <div className="grid grid-cols-8 gap-2">
              {availableIcons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`h-10 w-10 rounded-xl flex items-center justify-center text-xl transition ${
                    selectedIcon === icon
                      ? "bg-[var(--color-app-primary-soft)] ring-2 ring-[var(--color-app-accent)]"
                      : "hover:bg-[var(--color-app-primary-soft)]"
                  }`}
                  aria-label={`আইকন ${icon}`}
                >
                  {icon}
                </button>
              ))}
            </div>

            {/* Selected Icon Preview */}
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-[var(--color-app-border)] p-3">
              <div className="text-3xl">{selectedIcon}</div>

              <div>
                <p className="text-xs text-[var(--color-app-muted)]">
                  নির্বাচিত আইকন
                </p>

                <p className="text-sm font-semibold text-[var(--color-app-text)]">
                  {subjectName.trim() || "নতুন বিষয়"}
                </p>
              </div>
            </div>

            {/* Error */}
            {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2.5 rounded-xl border border-[var(--color-app-border)] text-sm font-semibold text-[var(--color-app-muted)]"
              >
                বাতিল
              </button>

              <button
                onClick={handleAddSubject}
                className="px-5 py-2.5 rounded-xl bg-[var(--color-app-accent)] text-white text-sm font-semibold hover:opacity-90 transition"
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
