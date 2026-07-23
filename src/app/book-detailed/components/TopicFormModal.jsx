"use client";

import { useState } from "react";

export default function TopicFormModal({
  initial,
  onClose,
  onSubmit,
  onDelete,
}) {
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
