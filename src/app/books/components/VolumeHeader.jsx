"use client";

import { useState } from "react";

export default function VolumeHeader({
  vol,
  open,
  toggleVol,
  hoveredEra,
  setHoveredEra,
  canManage,

  // নতুন
  onRename,
  onDelete,

  highlightMatch,
  q,
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      className="relative flex items-center justify-between px-4 py-3.5"
      style={{ borderLeft: "3px solid var(--color-app-primary)" }}
      onMouseEnter={() => setHoveredEra(vol.era)}
      onMouseLeave={() => setHoveredEra(null)}
    >
      {/* বাম পাশের Volume title */}
      <button
        onClick={() => toggleVol(vol.era)}
        className="flex-1 flex items-center justify-between text-left min-w-0"
      >
        <div className="min-w-0">
          <h2 className="font-[family-name:var(--font-bengali-serif)] text-[15px] font-bold text-[var(--color-app-text)] truncate">
            {highlightMatch(vol.era, q)}
          </h2>

          <p className="text-[11px] text-[var(--color-app-muted)] mt-0.5">
            {vol.chapters.reduce((s, c) => s + c.topics.length, 0)}
            টি টপিক
          </p>
        </div>
      </button>

      {/* ডান পাশের অপশন */}
      <div className="flex items-center gap-1 flex-shrink-0 ml-2">
        {canManage && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu((prev) => !prev);
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-app-text)] hover:bg-[var(--color-app-primary-soft)] transition-colors"
              aria-label="অধ্যায় অপশন"
              title="অপশন"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="5" r="1.8" />
                <circle cx="12" cy="12" r="1.8" />
                <circle cx="12" cy="19" r="1.8" />
              </svg>
            </button>

            {showMenu && (
              <div
                className="absolute right-0 top-9 z-50 w-44 rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] shadow-xl p-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                {/* নতুন পোস্ট */}
                <button
                  onClick={() => {
                    setShowMenu(false);

                    if (onRename) {
                      // আপাতত placeholder
                    }
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-left text-[var(--color-app-text)] hover:bg-[var(--color-app-primary-soft)] transition"
                >
                  <span className="text-base">＋</span>
                  <span>নতুন পোস্ট</span>
                </button>

                {/* Rename */}
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onRename?.(vol);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-left text-[var(--color-app-text)] hover:bg-[var(--color-app-primary-soft)] transition"
                >
                  <span className="text-base">✎</span>
                  <span>নাম পরিবর্তন</span>
                </button>

                {/* Topic সাজানো */}
                <button
                  onClick={() => {
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-left text-[var(--color-app-text)] hover:bg-[var(--color-app-primary-soft)] transition"
                >
                  <span className="text-base">☷</span>
                  <span>টপিক সাজান</span>
                </button>

                <div className="my-1 border-t border-[var(--color-app-border)]" />

                {/* Delete */}
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDelete?.(vol);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-left text-red-500 hover:bg-red-500/10 transition"
                >
                  <span className="text-base">⌫</span>
                  <span>অধ্যায় মুছে ফেলুন</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Accordion arrow */}
        <button
          onClick={() => toggleVol(vol.era)}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--color-app-primary-soft)] transition-colors"
          aria-label="খুলুন বা বন্ধ করুন"
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
      </div>
    </div>
  );
}
