"use client";

export default function VolumeHeader({
  vol,
  open,
  toggleVol,
  hoveredEra,
  setHoveredEra,
  canManage,
  setComposerEra,
  setComposerChapter,
  setShowComposer,
  highlightMatch,
  q,
}) {
  return (
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
            {vol.chapters.reduce((s, c) => s + c.topics.length, 0)}
            টি টপিক
          </p>
        </div>
      </button>

      <div className="flex items-center gap-2 flex-shrink-0">
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
