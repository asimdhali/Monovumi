"use client";

export default function ChapterSection({
  vol,
  ch,
  q,
  canManage,
  hoveredChapter,
  setHoveredChapter,
  chapterOpen,
  toggleChapter,
  setComposerEra,
  setComposerChapter,
  setShowComposer,
  highlightMatch,
  subject,
  paperId,
  moveTopicUp,
  moveTopicDown,
  duplicateTopic,
  setEditingTopic,
  setPreviewTopic,
  toBengaliNum,
}) {
  return (
    <div
      key={ch.key}
      className="mt-4 first:mt-3"
      onMouseEnter={() => setHoveredChapter(`${vol.era}-${ch.key}`)}
      onMouseLeave={() => setHoveredChapter(null)}
    >
      {ch.title && (
        <button
          onClick={() => toggleChapter(`${vol.era}-${ch.key}`)}
          className="w-full flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-dashed border-[var(--color-app-border)] hover:opacity-90 transition"
        >
          <h3
            className="text-[13px] font-bold"
            style={{ color: "var(--color-app-primary)" }}
          >
            {highlightMatch(ch.title, q)}
          </h3>
          <div className="flex items-center gap-2">
            {canManage &&
              (hoveredChapter === `${vol.era}-${ch.key}` || chapterOpen) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setComposerEra(vol.era);
                    setComposerChapter(ch.title);
                    setShowComposer(true);
                  }}
                  className="flex items-center gap-1 rounded-full text-[11px] font-semibold px-3 py-1 border border-[var(--color-app-border)] bg-[var(--color-app-bg)] text-[var(--color-app-muted)] hover:text-[var(--color-app-primary)] hover:border-[var(--color-app-primary)] transition-all"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  নতুন
                </button>
              )}
            <svg
              className="w-4 h-4 transition-transform"
              style={{
                transform: chapterOpen ? "rotate(180deg)" : "rotate(0deg)",
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
            {ch.topics[0]?.contributor && (
              <span className="flex items-center gap-1.5 flex-shrink-0">
                {ch.topics[0].contributorAvatar && (
                  <img
                    src={ch.topics[0].contributorAvatar}
                    alt={ch.topics[0].contributor}
                    className="w-5 h-5 rounded-full object-cover"
                    style={{
                      boxShadow: "0 0 0 1.5px var(--color-app-accent)",
                    }}
                  />
                )}
                <span className="text-[10.5px] text-[var(--color-app-muted)] whitespace-nowrap">
                  {ch.topics[0].contributor}
                </span>
              </span>
            )}
          </div>
        </button>
      )}
      <SortableContext
        items={ch.topics.map((topic) => topic.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="space-y-2">
          {ch.topics.map((topic, index) => (
            <SortableTopic key={topic.id} id={topic.id}>
              <li
                onClick={() => setPreviewTopic(topic)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 cursor-pointer transition-colors bg-[var(--color-app-bg)] border border-[var(--color-app-border)] hover:border-[var(--color-app-primary)]"
              >
                <span
                  className="font-[family-name:var(--font-bengali-serif)] text-xs flex-shrink-0 w-6"
                  style={{
                    color: "var(--color-app-accent)",
                  }}
                >
                  {toBengaliNum(index + 1)}
                </span>
                <span className="text-[13.5px] flex-1 min-w-0 text-[var(--color-app-text)]">
                  {highlightMatch(topic.title, q)}
                </span>
                {canManage && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveTopicUp(subject, paperId, topic.id);
                      }}
                      className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[var(--color-app-primary-soft)]"
                      title="উপরে নিন"
                    >
                      ⬆️
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveTopicDown(subject, paperId, topic.id);
                      }}
                      className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[var(--color-app-primary-soft)]"
                      title="নিচে নামান"
                    >
                      ⬇️
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateTopic(subject, paperId, topic.id);
                      }}
                      className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[var(--color-app-primary-soft)]"
                      title="কপি করুন"
                    >
                      📋
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingTopic(topic);
                      }}
                      className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[var(--color-app-primary-soft)]"
                      title="সম্পাদনা"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="var(--color-app-primary)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 24 24"
                      >
                        <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5" />
                        <path d="M17.5 3.5a2.12 2.12 0 013 3L11 16l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                  </div>
                )}
              </li>
            </SortableTopic>
          ))}
        </ul>
      </SortableContext>
    </div>
  );
}
