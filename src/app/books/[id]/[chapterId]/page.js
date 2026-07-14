'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { books } from '../../../data';

export default function ChapterDetailPage({ params }) {
  const { id, chapterId } = use(params);
  const book = books.find((b) => b.id === parseInt(id));
  const chapter = book?.chapters.find((c) => c.id === parseInt(chapterId));

  const [answered, setAnswered] = useState({});

  if (!book || !chapter) {
    return (
      <div className="max-w-3xl mx-auto px-4 lg:px-6 pt-6">
        <p className="text-[var(--color-app-muted)]">অধ্যায়টি খুঁজে পাওয়া যায়নি।</p>
      </div>
    );
  }

  function handleAnswer(mcqIndex, optionIndex) {
    setAnswered((prev) => ({ ...prev, [mcqIndex]: optionIndex }));
  }

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 pt-6 pb-10">
      <div className="flex items-center gap-2 mb-5">
        <Link
          href={`/books/${book.id}`}
          className="p-1.5 -ml-1.5 rounded-full hover:bg-[var(--color-app-primary-soft)] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="var(--color-app-text)" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="font-[family-name:var(--font-bengali-serif)] text-lg text-[var(--color-app-text)]">
            {chapter.title}
          </h1>
          <p className="text-xs text-[var(--color-app-muted)]">{book.title}</p>
        </div>
      </div>

      {/* নোট */}
      <section className="mb-6">
        <h2 className="text-sm font-semibold mb-2 text-[var(--color-app-text)]">📝 শিক্ষকের নোট</h2>
        {chapter.notes.length > 0 ? (
          chapter.notes.map((note, i) => (
            <div
              key={i}
              className="rounded-xl border p-3 mb-2 text-sm leading-relaxed bg-[var(--color-app-surface)] border-[var(--color-app-border)] text-[var(--color-app-muted)]"
            >
              {note}
            </div>
          ))
        ) : (
          <p className="text-xs text-[var(--color-app-muted)]">এই অধ্যায়ে এখনো কোনো নোট যোগ হয়নি।</p>
        )}
      </section>

      {/* প্রশ্ন-উত্তর */}
      <section className="mb-6">
        <h2 className="text-sm font-semibold mb-2 text-[var(--color-app-text)]">❓ প্রশ্ন-উত্তর</h2>
        {chapter.qa.length > 0 ? (
          chapter.qa.map((qa, i) => (
            <div
              key={i}
              className="rounded-xl border p-3 mb-2 bg-[var(--color-app-surface)] border-[var(--color-app-border)]"
            >
              <p className="text-sm font-medium text-[var(--color-app-text)]">প্রশ্ন: {qa.q}</p>
              <p className="text-sm mt-1 text-[var(--color-app-muted)]">উত্তর: {qa.a}</p>
              <p className="text-xs mt-1 text-[var(--color-app-primary)]">— {qa.teacher}</p>
            </div>
          ))
        ) : (
          <p className="text-xs text-[var(--color-app-muted)]">এখনো কোনো প্রশ্নোত্তর যোগ হয়নি।</p>
        )}
      </section>

      {/* MCQ */}
      <section>
        <h2 className="text-sm font-semibold mb-2 text-[var(--color-app-text)]">✅ এমসিকিউ অনুশীলন</h2>
        {chapter.mcqs.length > 0 ? (
          chapter.mcqs.map((mcq, mcqIndex) => {
            const selected = answered[mcqIndex];
            return (
              <div
                key={mcqIndex}
                className="rounded-xl border p-3 mb-2 bg-[var(--color-app-surface)] border-[var(--color-app-border)]"
              >
                <p className="text-sm font-medium mb-2 text-[var(--color-app-text)]">{mcq.q}</p>
                <div className="space-y-1.5">
                  {mcq.options.map((opt, optIndex) => {
                    let style = {
                      borderColor: 'var(--color-app-border)',
                      color: 'var(--color-app-text)',
                    };
                    if (selected !== undefined) {
                      if (optIndex === mcq.correct) {
                        style = {
                          borderColor: 'var(--color-app-primary)',
                          background: 'var(--color-app-primary-soft)',
                          color: 'var(--color-app-primary)',
                        };
                      } else if (optIndex === selected) {
                        style = { borderColor: '#ef4444', background: '#fef2f2', color: '#ef4444' };
                      }
                    }
                    return (
                      <button
                        key={optIndex}
                        disabled={selected !== undefined}
                        onClick={() => handleAnswer(mcqIndex, optIndex)}
                        style={style}
                        className="w-full text-left text-sm px-3 py-2 rounded-lg border transition-colors"
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {selected !== undefined && (
                  <p className="text-xs mt-2 leading-relaxed text-[var(--color-app-muted)]">
                    💡 {mcq.explain}
                  </p>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-xs text-[var(--color-app-muted)]">এখনো কোনো এমসিকিউ যোগ হয়নি।</p>
        )}
      </section>
    </div>
  );
}