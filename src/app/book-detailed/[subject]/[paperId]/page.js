"use client";

import SortableTopic from "../../components/SortableTopic";
import { use, useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useBookDetailed } from "../../../BookDetailedContext";
import { useAuth } from "../../../AuthContext";
import TopicPreviewModal from "../../components/TopicPreviewModal";
import ComposerModal from "../../components/ComposerModal";
import { toBengaliNum } from "../../helpers/bookDetailedPageHelper";
import {
  buildVolumeGroups,
  filterVolumeGroups,
  getDragIndexes,
  canReorder,
} from "../../logic/bookDetailedPageLogic";
import { highlightMatch } from "../../utils/highlightMatch";
import VolumeAccordion from "../../components/VolumeAccordion";
import VolumeHeader from "../../components/VolumeHeader";
import ChapterSection from "../../components/ChapterSection";
import TopicItem from "../../components/TopicItem";

export default function PaperPage({ params }) {
  const { subject: rawSubject, paperId } = use(params);
  const subject = decodeURIComponent(rawSubject);
  const {
    content,
    addTopic,
    editTopic,
    deleteTopic,
    duplicateTopic,
    moveTopicUp,
    moveTopicDown,
    reorderTopic,
  } = useBookDetailed();
  const { role, teacherVerified } = useAuth();
  const canManage = role === "teacher" && teacherVerified;

  const [query, setQuery] = useState("");
  const [openEras, setOpenEras] = useState({});
  const [openChapters, setOpenChapters] = useState({});
  const [previewTopic, setPreviewTopic] = useState(null);
  const [editingTopic, setEditingTopic] = useState(null);
  const [editingComposerTopic, setEditingComposerTopic] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formEra, setFormEra] = useState("");
  const [showComposer, setShowComposer] = useState(false);
  const [composerEra, setComposerEra] = useState("");
  const [composerChapter, setComposerChapter] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );
  const [hoveredEra, setHoveredEra] = useState(null);
  const [hoveredChapter, setHoveredChapter] = useState(null);

  const subjectData = content?.[subject];
  const paper = subjectData?.papers?.find((p) => p.id === paperId);

  if (!subjectData || !paper) {
    return (
      <div className="max-w-2xl mx-auto px-4 lg:px-6 pt-6">
        <p className="text-[var(--color-app-muted)]">
          পত্রটি খুঁজে পাওয়া যায়নি।
        </p>
      </div>
    );
  }

  const q = query.trim().toLowerCase();

  // sortOrder অনুযায়ী আগে সাজানো

  const volumeGroups = buildVolumeGroups(paper.topics);

  const filteredVolumes = filterVolumeGroups(volumeGroups, query);
  const totalMatches = filteredVolumes.reduce(
    (sum, v) => sum + v.chapters.reduce((s, c) => s + c.topics.length, 0),
    0,
  );
  const noResults = q && filteredVolumes.length === 0;

  function isVolOpen(era) {
    if (q) return true;
    return !!openEras[era];
  }

  function toggleVol(era) {
    setOpenEras((prev) => ({ ...prev, [era]: !prev[era] }));
  }

  function isChapterOpen(key) {
    if (q) return true;
    return !!openChapters[key];
  }

  function toggleChapter(key) {
    setOpenChapters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }
  function handleDragEnd(event) {
    const { active, over } = event;

    if (!canReorder(active, over)) return;

    const { oldIndex, newIndex } = getDragIndexes(
      paper.topics,
      active.id,
      over.id,
    );

    if (oldIndex === -1 || newIndex === -1) return;

    reorderTopic(subject, paperId, oldIndex, newIndex);
  }

  return (
    <div className="w-full min-h-screen bg-[var(--color-app-bg)]">
      {/* মূল কন্টেন্ট — মোবাইলে ফুল-উইডথ, বড় স্ক্রিনে সেন্টার্ড */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 lg:px-6 pt-4 pb-20 sm:pb-16">
          {/* হেডার — ছবির মতো */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <Link
                href={`/book-detailed/${encodeURIComponent(subject)}`}
                className="w-9 h-9 rounded-full bg-[var(--color-app-surface)] border border-[var(--color-app-border)] flex items-center justify-center hover:bg-[var(--color-app-primary-soft)] transition-colors flex-shrink-0"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="var(--color-app-text)"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Link>
              <div>
                <h1 className="font-[family-name:var(--font-bengali-serif)] text-[17px] font-bold text-[var(--color-app-text)] leading-tight">
                  {paper.title}
                </h1>
                <p className="text-[11px] text-[var(--color-app-muted)] mt-0.5">
                  {subject} · {volumeGroups.length}টি খণ্ড
                </p>
              </div>
            </div>
            {canManage && (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-1.5 rounded-full text-[var(--color-app-text)] text-xs font-semibold px-4 py-2 border border-[var(--color-app-border)] bg-[var(--color-app-surface)] hover:bg-[var(--color-app-primary-soft)] transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5"
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
          </div>
          {/* সার্চ */}
          <div className="relative mb-2">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-app-muted)]">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="টপিক, অধ্যায় বা খণ্ডের নাম লিখে খুঁজুন..."
              className="w-full pl-10 pr-9 py-2.5 sm:py-3 rounded-xl border text-sm outline-none bg-[var(--color-app-surface)] border-[var(--color-app-border)] text-[var(--color-app-text)]"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center bg-[var(--color-app-border)] text-[var(--color-app-muted)]"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {q && !noResults && (
            <p className="text-xs text-[var(--color-app-muted)] mb-4 pl-1">
              {totalMatches}টি টপিক পাওয়া গেছে
            </p>
          )}
          {!q && <div className="mb-4" />}

          {noResults && (
            <div className="text-center py-14">
              <p className="text-3xl mb-2">🔍</p>
              <p className="text-sm text-[var(--color-app-muted)]">
                কোনো টপিক পাওয়া যায়নি — অন্য কোনো শব্দ দিয়ে খুঁজে দেখুন।
              </p>
            </div>
          )}

          {paper.topics.length === 0 && !q && (
            <p className="text-sm text-[var(--color-app-muted)] py-8 text-center">
              এই পত্রে এখনো কোনো টপিক যোগ হয়নি।
            </p>
          )}

          {/* খণ্ড-ভিত্তিক অ্যাকর্ডিয়ন */}
          {filteredVolumes.map((vol) => {
            const open = isVolOpen(vol.era);
            return (
              <VolumeAccordion
                key={vol.era}
                className="rounded-2xl border mb-3 overflow-hidden bg-[var(--color-app-surface)] border-[var(--color-app-border)]"
              >
                <VolumeHeader
                  vol={vol}
                  open={open}
                  toggleVol={toggleVol}
                  hoveredEra={hoveredEra}
                  setHoveredEra={setHoveredEra}
                  canManage={canManage}
                  setComposerEra={setComposerEra}
                  setComposerChapter={setComposerChapter}
                  setShowComposer={setShowComposer}
                  highlightMatch={highlightMatch}
                  q={q}
                />

                {open && (
                  <div className="px-4 pb-4 pt-1 border-t border-[var(--color-app-border)]">
                    {vol.chapters.map((ch) => {
                      const chapterOpen = isChapterOpen(`${vol.era}-${ch.key}`);
                      return (
                        <ChapterSection
                          key={ch.key}
                          vol={vol}
                          ch={ch}
                          q={q}
                          canManage={canManage}
                          hoveredChapter={hoveredChapter}
                          setHoveredChapter={setHoveredChapter}
                          chapterOpen={chapterOpen}
                          toggleChapter={toggleChapter}
                          setComposerEra={setComposerEra}
                          setComposerChapter={setComposerChapter}
                          setShowComposer={setShowComposer}
                          highlightMatch={highlightMatch}
                          subject={subject}
                          paperId={paperId}
                          moveTopicUp={moveTopicUp}
                          moveTopicDown={moveTopicDown}
                          duplicateTopic={duplicateTopic}
                          setEditingTopic={(topic) => {
                            setEditingComposerTopic(topic);
                            setComposerEra(topic.era || "");
                            setComposerChapter(topic.chapter || "");
                            setShowComposer(true);
                          }}
                          setPreviewTopic={setPreviewTopic}
                          toBengaliNum={toBengaliNum}
                        />
                      );
                    })}
                  </div>
                )}
              </VolumeAccordion>
            );
          })}

          <p className="text-center text-[11px] text-[var(--color-app-muted)] mt-6 tracking-wide">
            মনোভূমি · {paper.title}
          </p>
        </div>
      </DndContext>
      {/* মোডালসমূহ */}
      {previewTopic && (
        <TopicPreviewModal
          topic={previewTopic}
          subject={subject}
          onClose={() => setPreviewTopic(null)}
        />
      )}
      {editingTopic && (
        <ComposerModal
          mode="edit"
          initialTopic={editingTopic}
          onClose={() => setEditingTopic(null)}
          onSubmit={(fields) => {
            editTopic(subject, paperId, editingTopic.id, fields);
            setEditingTopic(null);
          }}
        />
      )}
      {showAddForm && (
        <TopicFormModal
          initial={
            formEra
              ? { era: formEra, chapter: "", title: "", content: "" }
              : undefined
          }
          onClose={() => {
            setShowAddForm(false);
            setFormEra("");
          }}
          onSubmit={(fields) => {
            addTopic(subject, paperId, {
              id: Date.now(),
              sortOrder: Date.now(),
              ...fields,
              featured: false,
            });
            setShowAddForm(false);
            setFormEra("");
          }}
        />
      )}
      {showComposer && (
        <ComposerModal
          initialTopic={editingComposerTopic}
          mode="create"
          prefillEra={composerEra}
          prefillChapter={composerChapter}
          onClose={() => {
            setShowComposer(false);
            setComposerEra("");
            setComposerChapter("");
            setEditingComposerTopic(null);
          }}
          onSubmit={(fields) => {
            if (editingComposerTopic) {
              editTopic(subject, paperId, editingComposerTopic.id, fields);
            } else {
              addTopic(subject, paperId, {
                id: Date.now(),
                ...fields,
                featured: false,
              });
            }

            setShowComposer(false);
            setComposerEra("");
            setComposerChapter("");
            setEditingComposerTopic(null);
          }}
        />
      )}
    </div>
  );
}
