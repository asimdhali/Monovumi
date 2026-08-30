"use client";

import { use, useState } from "react";
import Link from "next/link";

import SortableTopic from "../components/SortableTopic";

import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";

import { useBookDetailed } from "./../../BookDetailedContext";
import { useAuth } from "../../AuthContext";

import TopicPreviewModal from "../components/TopicPreviewModal";
import ComposerModal from "../components/ComposerModal";

import { toBengaliNum } from "../helpers/bookDetailedPageHelper";

import {
  buildVolumeGroups,
  filterVolumeGroups,
  getDragIndexes,
  canReorder,
} from "../logic/bookDetailedPageLogic";

import { highlightMatch } from "../utils/highlightMatch";

import VolumeAccordion from "../components/VolumeAccordion";
import VolumeHeader from "../components/VolumeHeader";
import ChapterSection from "../components/ChapterSection";

import HomeFeedSkeleton from "@/app/components/HomeFeedSkeleton";

export default function SubjectPage({ params }) {
  const { subject: rawSubject } = use(params);

  const subject = decodeURIComponent(rawSubject);

  const {
    content,
    addTopic,
    addVolume,
    editTopic,
    renameVolume,
    deleteVolume,
    deleteTopic,
    duplicateTopic,
    moveTopicUp,
    moveTopicDown,
    reorderTopic,
    loading,
  } = useBookDetailed();

  const { user, approved, role } = useAuth();

  const canManage =
    approved === true && (role === "teacher" || role === "admin");

  const [query, setQuery] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  const [showVolumeModal, setShowVolumeModal] = useState(false);
  const [volumeTitle, setVolumeTitle] = useState("");
  const [volumeError, setVolumeError] = useState("");

  const [renameVolumeData, setRenameVolumeData] = useState(null);
  const [renameVolumeTitle, setRenameVolumeTitle] = useState("");
  const [renameVolumeError, setRenameVolumeError] = useState("");

  const [deleteVolumeData, setDeleteVolumeData] = useState(null);
  const [deleteVolumeError, setDeleteVolumeError] = useState("");

  const [openEras, setOpenEras] = useState({});
  const [openChapters, setOpenChapters] = useState({});

  const [previewTopic, setPreviewTopic] = useState(null);

  const [editingComposerTopic, setEditingComposerTopic] = useState(null);

  const [showComposer, setShowComposer] = useState(false);

  const [composerEra, setComposerEra] = useState("");
  const [composerChapter, setComposerChapter] = useState("");

  const [hoveredEra, setHoveredEra] = useState(null);
  const [hoveredChapter, setHoveredChapter] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  if (loading) {
    return <HomeFeedSkeleton />;
  }

  const subjectData = content?.[subject];

  /*
   * এখন URL-এ paperId নেই।
   *
   * তাই এই Subject-এর প্রথম paper-টিকেই
   * বর্তমান বিস্তারিত পেজের paper হিসেবে ব্যবহার করা হচ্ছে।
   */
  const paper = subjectData?.papers?.[0];

  if (!subjectData || !paper) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-[var(--color-app-text)]">
            বিষয়টির তথ্য পাওয়া যায়নি।
          </p>

          <Link
            href="/books"
            className="inline-block mt-4 px-5 py-2.5 rounded-xl bg-[var(--color-app-accent)] text-white"
          >
            বইয়ের তালিকায় ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  const paperId = paper.id;

  const q = query.trim().toLowerCase();

  const volumeGroups = buildVolumeGroups(
    paper.topics || [],
    paper.volumes || [],
  );

  const filteredVolumes = filterVolumeGroups(volumeGroups, query);

  const totalMatches = filteredVolumes.reduce(
    (sum, volume) =>
      sum +
      volume.chapters.reduce(
        (chapterSum, chapter) => chapterSum + chapter.topics.length,
        0,
      ),
    0,
  );

  const noResults = q && filteredVolumes.length === 0;

  function isVolOpen(era) {
    if (q) return true;

    return !!openEras[era];
  }

  function toggleVol(era) {
    setOpenEras((prev) => ({
      ...prev,
      [era]: !prev[era],
    }));
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

  async function handleAddVolume() {
    const title = volumeTitle.trim();

    if (!title) {
      setVolumeError("অধ্যায়ের নাম লিখুন।");
      return;
    }

    try {
      setVolumeError("");

      await addVolume(subject, paperId, title);

      setVolumeTitle("");
      setShowVolumeModal(false);
      setShowOptions(false);
    } catch (error) {
      setVolumeError(error.message || "অধ্যায় যোগ করা যায়নি।");
    }
  }

  function handleOpenRenameVolume(vol) {
    setRenameVolumeData(vol);
    setRenameVolumeTitle(vol.era || "");
    setRenameVolumeError("");
  }

  async function handleRenameVolume() {
    if (!renameVolumeData) return;

    const newTitle = renameVolumeTitle.trim();

    if (!newTitle) {
      setRenameVolumeError("অধ্যায়ের নাম লিখুন।");
      return;
    }

    try {
      setRenameVolumeError("");

      await renameVolume(
        subject,
        paperId,
        renameVolumeData.volumeId,
        renameVolumeData.era,
        newTitle,
      );

      setRenameVolumeData(null);
      setRenameVolumeTitle("");
    } catch (error) {
      setRenameVolumeError(error.message || "অধ্যায়ের নাম পরিবর্তন করা যায়নি।");
    }
  }

  function handleOpenDeleteVolume(vol) {
    setDeleteVolumeData(vol);
    setDeleteVolumeError("");
  }

  async function handleDeleteVolume() {
    if (!deleteVolumeData) return;

    try {
      setDeleteVolumeError("");

      await deleteVolume(
        subject,
        paperId,
        deleteVolumeData.volumeId,
        deleteVolumeData.era,
      );

      setDeleteVolumeData(null);
    } catch (error) {
      setDeleteVolumeError(error.message || "অধ্যায় মুছে ফেলা যায়নি।");
    }
  }

  function handleOpenNewPost() {
    setEditingComposerTopic(null);
    setComposerEra("");
    setComposerChapter("");
    setShowComposer(true);
  }

  function handleOpenVolumeNewPost(vol) {
    setEditingComposerTopic(null);
    setComposerEra(vol.era || "");
    setComposerChapter("");
    setShowComposer(true);
  }

  return (
    <div className="w-full min-h-screen bg-[var(--color-app-bg)]">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 lg:px-6 pt-4 pb-20">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <Link
                href="/books"
                className="w-9 h-9 rounded-full bg-[var(--color-app-surface)] border border-[var(--color-app-border)] flex items-center justify-center hover:bg-[var(--color-app-primary-soft)] transition-colors"
                aria-label="ফিরে যান"
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
                <h1 className="font-[family-name:var(--font-bengali-serif)] text-[19px] font-bold text-[var(--color-app-text)] leading-tight">
                  {subject}
                </h1>

                <p className="text-[11px] text-[var(--color-app-muted)] mt-0.5">
                  {paper.topics?.length || 0}টি টপিক
                </p>
              </div>
            </div>

            {/* Paper Options */}
            {canManage && (
              <div className="relative">
                <button
                  onClick={() => setShowOptions((prev) => !prev)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--color-app-text)] hover:bg-[var(--color-app-primary-soft)] transition-colors"
                  title="অপশন"
                  aria-label="অপশন"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="5" r="1.8" />
                    <circle cx="12" cy="12" r="1.8" />
                    <circle cx="12" cy="19" r="1.8" />
                  </svg>
                </button>

                {showOptions && (
                  <div className="absolute right-0 top-11 z-40 w-48 rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] shadow-xl p-1.5">
                    {/* নতুন অধ্যায় */}
                    <button
                      onClick={() => {
                        setShowVolumeModal(true);
                        setVolumeError("");
                        setVolumeTitle("");
                        setShowOptions(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-left text-[var(--color-app-text)] hover:bg-[var(--color-app-primary-soft)] transition"
                    >
                      <span className="text-base">＋</span>
                      <span>নতুন অধ্যায়</span>
                    </button>

                    {/* নতুন পোস্ট */}
                    <button
                      onClick={() => {
                        setShowOptions(false);
                        handleOpenNewPost();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-left text-[var(--color-app-text)] hover:bg-[var(--color-app-primary-soft)] transition"
                    >
                      <span className="text-base">＋</span>
                      <span>নতুন পোস্ট</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Search */}
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
                ×
              </button>
            )}
          </div>

          {q && !noResults && (
            <p className="text-xs text-[var(--color-app-muted)] mb-4 pl-1">
              {toBengaliNum(totalMatches)}টি টপিক পাওয়া গেছে
            </p>
          )}

          {!q && <div className="mb-4" />}

          {/* Search result না পাওয়া গেলে */}
          {noResults && (
            <div className="text-center py-14">
              <p className="text-3xl mb-2">🔍</p>

              <p className="text-sm text-[var(--color-app-muted)]">
                কোনো টপিক পাওয়া যায়নি — অন্য কোনো শব্দ দিয়ে খুঁজে দেখুন।
              </p>
            </div>
          )}

          {/* কোনো Topic নেই */}
          {paper.topics?.length === 0 && !q && (
            <div className="text-center py-14">
              <p className="text-4xl mb-3">📝</p>

              <p className="text-sm text-[var(--color-app-muted)]">
                এই বিষয়ে এখনো কোনো টপিক যোগ হয়নি।
              </p>

              {canManage && (
                <button
                  onClick={handleOpenNewPost}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-[var(--color-app-accent)] text-white text-sm font-semibold"
                >
                  + নতুন পোস্ট
                </button>
              )}
            </div>
          )}

          {/* Volume */}
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
                  onNewPost={handleOpenVolumeNewPost}
                  onRename={handleOpenRenameVolume}
                  onDelete={handleOpenDeleteVolume}
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
                          deleteTopic={deleteTopic}
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
            মনোভূমি · {subject}
          </p>
        </div>
      </DndContext>

      {/* Topic Preview */}
      {previewTopic && (
        <TopicPreviewModal
          topic={previewTopic}
          subject={subject}
          onClose={() => setPreviewTopic(null)}
        />
      )}

      {/* Rename Volume Modal */}
      {renameVolumeData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50"
          onClick={() => {
            setRenameVolumeData(null);
            setRenameVolumeTitle("");
            setRenameVolumeError("");
          }}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-[var(--color-app-text)]">
              অধ্যায়ের নাম পরিবর্তন
            </h2>

            <p className="text-xs mt-1 mb-4 text-[var(--color-app-muted)]">
              নতুন নাম লিখুন।
            </p>

            <input
              autoFocus
              value={renameVolumeTitle}
              onChange={(e) => {
                setRenameVolumeTitle(e.target.value);
                setRenameVolumeError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleRenameVolume();
                }
              }}
              className="w-full rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-bg)] px-4 py-3 text-sm outline-none text-[var(--color-app-text)] placeholder:text-[var(--color-app-muted)] focus:border-[var(--color-app-primary)]"
            />

            {renameVolumeError && (
              <p className="text-xs text-red-400 mt-2">{renameVolumeError}</p>
            )}

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => {
                  setRenameVolumeData(null);
                  setRenameVolumeTitle("");
                  setRenameVolumeError("");
                }}
                className="px-4 py-2 rounded-xl text-sm text-[var(--color-app-muted)] hover:bg-[var(--color-app-primary-soft)]"
              >
                বাতিল
              </button>

              <button
                onClick={handleRenameVolume}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-[var(--color-app-accent)] text-white"
              >
                সংরক্ষণ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Volume Confirmation Modal */}
      {deleteVolumeData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50"
          onClick={() => {
            setDeleteVolumeData(null);
            setDeleteVolumeError("");
          }}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-11 h-11 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-4">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v4m0 4h.01M10.3 3.7l-8 14A2 2 0 004 20.7h16a2 2 0 001.7-3l-8-14a2 2 0 00-3.4 0z"
                />
              </svg>
            </div>

            <h2 className="text-lg font-bold text-[var(--color-app-text)]">
              অধ্যায় মুছে ফেলবেন?
            </h2>

            <p className="text-sm mt-2 leading-6 text-[var(--color-app-muted)]">
              আপনি কি{" "}
              <span className="font-semibold text-[var(--color-app-text)]">
                “{deleteVolumeData.era}”
              </span>{" "}
              অধ্যায়টি মুছে ফেলতে চান?
            </p>

            <div className="mt-3 rounded-xl bg-red-500/5 border border-red-500/10 px-3 py-2.5">
              <p className="text-xs leading-5 text-red-400">
                সতর্কতা: এই অধ্যায়ের অধীনে থাকা সব টপিকও মুছে যাবে।
              </p>
            </div>

            {deleteVolumeError && (
              <p className="text-xs text-red-400 mt-3">{deleteVolumeError}</p>
            )}

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => {
                  setDeleteVolumeData(null);
                  setDeleteVolumeError("");
                }}
                className="px-4 py-2 rounded-xl text-sm text-[var(--color-app-muted)] hover:bg-[var(--color-app-primary-soft)]"
              >
                বাতিল
              </button>

              <button
                onClick={handleDeleteVolume}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition"
              >
                মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* নতুন অধ্যায় Modal */}
      {showVolumeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50"
          onClick={() => setShowVolumeModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-[var(--color-app-text)]">
              নতুন অধ্যায়
            </h2>

            <p className="text-xs mt-1 mb-4 text-[var(--color-app-muted)]">
              এই অধ্যায়টি এই পত্রের মধ্যে যোগ হবে।
            </p>

            <input
              autoFocus
              value={volumeTitle}
              onChange={(e) => {
                setVolumeTitle(e.target.value);
                setVolumeError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddVolume();
                }
              }}
              placeholder="অধ্যায়ের নাম লিখুন"
              className="w-full rounded-xl border border-[var(--color-app-border)] bg-[var(--color-app-bg)] px-4 py-3 text-sm outline-none text-[var(--color-app-text)] placeholder:text-[var(--color-app-muted)] focus:border-[var(--color-app-primary)]"
            />

            {volumeError && (
              <p className="text-xs text-red-400 mt-2">{volumeError}</p>
            )}

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => {
                  setShowVolumeModal(false);
                  setVolumeTitle("");
                  setVolumeError("");
                }}
                className="px-4 py-2 rounded-xl text-sm text-[var(--color-app-muted)] hover:bg-[var(--color-app-primary-soft)]"
              >
                বাতিল
              </button>

              <button
                onClick={handleAddVolume}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-[var(--color-app-accent)] text-white"
              >
                যোগ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Composer */}
      {showComposer && (
        <ComposerModal
          initialTopic={editingComposerTopic}
          mode={editingComposerTopic ? "edit" : "create"}
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
