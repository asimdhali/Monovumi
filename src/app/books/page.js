"use client";

import { useState } from "react";
import Link from "next/link";
import { useBookDetailed } from "../BookDetailedContext";
import { useAuth } from "../AuthContext";

const subjectIcons = {
  বাংলা: "📖",
  ইংরেজি: "🔤",
  গণিত: "🧮",
  বিজ্ঞান: "🔬",
};

const subjectOrder = [
  "বাংলা সাহিত্য",
  "বাংলা ভাষা",
  "ইংরেজি সাহিত্য",
  "ইংরেজি ভাষা",
  "গণিত",
  "বাংলাদেশ বিষয়াবলি",
  "আন্তর্জাতিক বিষয়াবলি",
  "ভূগোল",
  "সাধারণ বিজ্ঞান",
  "কম্পিউটার শিক্ষা",
  "মানসিক দক্ষতা",
  "নৈতিকতা ও সুশাসন",
];

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
  const {
    content,
    addSubject,
    renameBookSubject,
    changeSubjectIcon,
    removeSubject,
  } = useBookDetailed();

  const { user, canManage, loading: authLoading } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("📚");
  const [error, setError] = useState("");
  const [menuSubject, setMenuSubject] = useState(null);

  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameName, setRenameName] = useState("");

  const [showIconModal, setShowIconModal] = useState(false);
  const [editingIconSubject, setEditingIconSubject] = useState(null);

  const [actionError, setActionError] = useState("");

  const subjects = Object.keys(content).sort((a, b) => {
    const indexA = subjectOrder.indexOf(a);
    const indexB = subjectOrder.indexOf(b);

    const orderA = indexA === -1 ? 999 : indexA;
    const orderB = indexB === -1 ? 999 : indexB;

    return orderA - orderB;
  });

  async function handleRenameSubject() {
    const newName = renameName.trim();

    if (!newName) {
      setActionError("বিষয়ের নাম লিখুন।");
      return;
    }

    if (content[newName] && newName !== menuSubject) {
      setActionError("এই বিষয়টি ইতিমধ্যে আছে।");
      return;
    }

    try {
      await renameBookSubject(menuSubject, newName);

      setShowRenameModal(false);
      setMenuSubject(null);
      setRenameName("");
      setActionError("");
    } catch (error) {
      console.error(error);
      setActionError(error.message || "বিষয়টির নাম পরিবর্তন করা যায়নি।");
    }
  }

  async function handleChangeIcon(icon) {
    try {
      await changeSubjectIcon(editingIconSubject, icon);

      setShowIconModal(false);
      setEditingIconSubject(null);
      setMenuSubject(null);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteSubject(subject) {
    const ok = window.confirm(
      `"${subject}" বিষয়টি মুছে ফেলতে চান? এই বিষয়ের সব তথ্য মুছে যাবে।`,
    );

    if (!ok) return;

    try {
      await removeSubject(subject);
      setMenuSubject(null);
    } catch (error) {
      console.error(error);
      alert("বিষয়টি মুছে ফেলা যায়নি।");
    }
  }

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
    <div className="min-h-screen px-4 pt-6 pb-24">
      {/* Header */}
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-app-text)]">
              বিসিএস ফ্রি ডিটেইল বই
            </h1>

            <p className="text-sm mt-1 text-[var(--color-app-muted)]">
              বিসিএস এর সকল বিষয়
            </p>
          </div>

          {/* + Button */}
          {canManage && (
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
          )}
        </div>

        {/* Subject Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {subjects.map((subject) => {
            const subjectData = content[subject];

            return (
              <div
                key={subject}
                className="relative rounded-2xl border bg-[var(--color-app-surface)] border-[var(--color-app-border)] hover:shadow-md transition-shadow"
              >
                {/* Three Dot Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();

                    if (!canManage) return;

                    setMenuSubject(menuSubject === subject ? null : subject);
                  }}
                  disabled={!canManage}
                  className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition ${
                    canManage
                      ? "text-[var(--color-app-muted)] hover:bg-[var(--color-app-primary-soft)]"
                      : "text-[var(--color-app-muted)] opacity-40 cursor-not-allowed"
                  }`}
                  aria-label={
                    canManage ? "বিষয় অপশন" : "ম্যানেজ করার অনুমতি নেই"
                  }
                >
                  ⋮
                </button>

                {/* Menu */}
                {menuSubject === subject && canManage && (
                  <div className="absolute top-10 right-2 z-30 w-44 rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] shadow-xl overflow-hidden">
                    <button
                      onClick={() => {
                        setRenameName(subject);
                        setActionError("");
                        setShowRenameModal(true);
                      }}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-[var(--color-app-primary-soft)]"
                    >
                      ✏️ Rename
                    </button>

                    <button
                      onClick={() => {
                        setEditingIconSubject(subject);
                        setShowIconModal(true);
                      }}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-[var(--color-app-primary-soft)]"
                    >
                      🎨 আইকন পরিবর্তন
                    </button>

                    <button
                      onClick={() => handleDeleteSubject(subject)}
                      className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}

                {/* Subject Link */}
                <Link
                  href={`/books/${encodeURIComponent(subject)}`}
                  className="block text-center p-6"
                >
                  <div className="text-4xl mb-2">
                    {subjectData?.icon || subjectIcons[subject] || "📚"}
                  </div>

                  <p className="font-semibold text-sm text-[var(--color-app-text)]">
                    {subject}
                  </p>
                </Link>
              </div>
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
      {showRenameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[var(--color-app-text)]">
                বিষয়ের নাম পরিবর্তন
              </h2>

              <button
                onClick={() => setShowRenameModal(false)}
                className="text-xl text-[var(--color-app-muted)]"
              >
                ×
              </button>
            </div>

            <input
              type="text"
              value={renameName}
              onChange={(e) => {
                setRenameName(e.target.value);
                setActionError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleRenameSubject();
                }
              }}
              className="w-full rounded-xl border border-[var(--color-app-border)] bg-transparent px-4 py-3 text-[var(--color-app-text)] outline-none focus:border-[var(--color-app-accent)]"
              autoFocus
            />

            {actionError && (
              <p className="mt-2 text-sm text-red-400">{actionError}</p>
            )}

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowRenameModal(false)}
                className="px-4 py-2.5 rounded-xl border border-[var(--color-app-border)] text-sm"
              >
                বাতিল
              </button>

              <button
                onClick={handleRenameSubject}
                className="px-5 py-2.5 rounded-xl bg-[var(--color-app-accent)] text-white text-sm font-semibold"
              >
                সংরক্ষণ
              </button>
            </div>
          </div>
        </div>
      )}
      {showIconModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[var(--color-app-text)]">
                আইকন পরিবর্তন
              </h2>

              <button
                onClick={() => setShowIconModal(false)}
                className="text-xl text-[var(--color-app-muted)]"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-8 gap-2">
              {availableIcons.map((icon) => (
                <button
                  key={icon}
                  onClick={() => handleChangeIcon(icon)}
                  className="h-10 w-10 rounded-xl flex items-center justify-center text-xl hover:bg-[var(--color-app-primary-soft)] transition"
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
