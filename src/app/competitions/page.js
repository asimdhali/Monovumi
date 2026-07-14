'use client';

import { useState } from 'react';
import { competitions as initialCompetitions } from '../data';

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState(initialCompetitions);
  const [joined, setJoined] = useState({});

  function handleJoin(id) {
    if (joined[id]) return;
    setJoined((prev) => ({ ...prev, [id]: true }));
    setCompetitions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, participants: c.participants + 1 } : c))
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 pt-6 pb-10">
      <div className="mb-6">
        <h1 className="font-[family-name:var(--font-bengali-serif)] text-2xl text-[var(--color-app-text)]">
          প্রতিযোগিতা সমূহ
        </h1>
        <p className="text-sm mt-1 text-[var(--color-app-muted)]">
          নিজের সেরাটা তুলে ধরার সুযোগ, সম্পূর্ণ বিনামূল্যে
        </p>
      </div>

      <div className="space-y-4">
        {competitions.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl border p-4 bg-[var(--color-app-surface)] border-[var(--color-app-border)]"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{c.icon}</span>
              <div className="flex-1">
                <p className="font-semibold text-sm text-[var(--color-app-text)]">{c.title}</p>
                <p className="text-xs mt-0.5 text-[var(--color-app-muted)]">{c.desc}</p>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-[var(--color-app-muted)]">
                  <span>📚 {c.subject}</span>
                  <span>⏰ {c.deadline}</span>
                  <span>👥 {c.participants}+ অংশগ্রহণকারী</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleJoin(c.id)}
              className="w-full mt-3 py-2.5 rounded-full text-sm font-semibold transition-colors"
              style={
                joined[c.id]
                  ? { background: 'var(--color-app-primary-soft)', color: 'var(--color-app-primary)' }
                  : { background: 'var(--color-app-primary)', color: 'white' }
              }
            >
              {joined[c.id] ? '✓ যোগদান সম্পন্ন' : 'যোগদান করুন'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}