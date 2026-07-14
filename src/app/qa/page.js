'use client';

import { useState } from 'react';
import { questions as initialQuestions, subjects } from '../data';

export default function QAPage() {
  const [questions, setQuestions] = useState(initialQuestions);
  const [showForm, setShowForm] = useState(false);
  const [newSubject, setNewSubject] = useState(subjects[0]);
  const [newText, setNewText] = useState('');

  function handleSubmit() {
    if (!newText.trim()) return;
    const newQuestion = {
      id: Date.now(),
      subject: newSubject,
      student: 'আপনি',
      text: newText.trim(),
      answers: [],
    };
    setQuestions([newQuestion, ...questions]);
    setNewText('');
    setShowForm(false);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 pt-6 pb-10">
      <div className="mb-4">
        <h1 className="font-[family-name:var(--font-bengali-serif)] text-2xl text-[var(--color-app-text)]">
          প্রশ্ন করো, শিক্ষকরা উত্তর দেবেন
        </h1>
        <p className="text-sm mt-1 text-[var(--color-app-muted)]">
          যেকোনো বিষয়ে আটকে গেলে এখানে প্রশ্ন করো
        </p>
      </div>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 rounded-full text-sm font-semibold text-white mb-6"
          style={{ background: 'var(--color-app-primary)' }}
        >
          + নতুন প্রশ্ন করুন
        </button>
      ) : (
        <div className="rounded-2xl border p-4 mb-6 bg-[var(--color-app-surface)] border-[var(--color-app-border)]">
          <select
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            className="w-full p-2.5 rounded-lg border text-sm mb-2 bg-[var(--color-app-bg)] border-[var(--color-app-border)] text-[var(--color-app-text)]"
          >
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            rows={3}
            placeholder="তোমার প্রশ্নটি বিস্তারিত লিখো..."
            className="w-full p-3 rounded-xl border text-sm resize-none bg-[var(--color-app-bg)] border-[var(--color-app-border)] text-[var(--color-app-text)]"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSubmit}
              className="flex-1 py-2.5 rounded-full text-sm font-semibold text-white"
              style={{ background: 'var(--color-app-primary)' }}
            >
              প্রশ্ন পাঠান
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2.5 rounded-full text-sm font-medium text-[var(--color-app-muted)] border border-[var(--color-app-border)]"
            >
              বাতিল
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {questions.map((q) => (
          <div
            key={q.id}
            className="rounded-2xl border p-4 bg-[var(--color-app-surface)] border-[var(--color-app-border)]"
          >
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'var(--color-app-accent-soft)', color: 'var(--color-app-accent)' }}
            >
              {q.subject}
            </span>
            <p className="text-sm font-medium mt-2 text-[var(--color-app-text)]">{q.text}</p>
            <p className="text-xs mt-1 text-[var(--color-app-muted)]">— {q.student}</p>

            <div className="mt-2 space-y-2">
              {q.answers.length > 0 ? (
                q.answers.map((a, i) => (
                  <div key={i} className="rounded-lg p-2.5" style={{ background: 'var(--color-app-primary-soft)' }}>
                    <p className="text-sm text-[var(--color-app-text)]">{a.text}</p>
                    <p className="text-xs mt-1 font-medium text-[var(--color-app-primary)]">👑 {a.teacher}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[var(--color-app-muted)]">
                  এখনো কোনো উত্তর আসেনি — শিক্ষকরা শীঘ্রই উত্তর দেবেন।
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}