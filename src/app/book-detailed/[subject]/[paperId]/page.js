"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useBookDetailed } from "../../../BookDetailedContext";
import { useAuth } from "../../../AuthContext";

export default function PaperPage({ params }) {
  const { subject: rawSubject, paperId } = use(params);
  const subject = decodeURIComponent(rawSubject);
  const { content, addTopic, editTopic } = useBookDetailed();
  const { role, teacherVerified } = useAuth();
  const canEdit = role === "teacher" && teacherVerified;

  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ era: "", title: "", content: "" });
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ era: "", title: "", content: "" });

  const subjectData = content[subject];
  const paper = subjectData?.papers.find((p) => p.id === paperId);

  if (!subjectData || !paper) {
    return (
      <div className="max-w-3xl mx-auto px-4 lg:px-6 pt-6">
        <p className="text-[var(--color-app-muted)]">
          পত্রটি খুঁজে পাওয়া যায়নি।
        </p>
      </div>
    );
  }

  // যুগ অনুযায়ী টপিকগুলো গ্রুপ করা (মূল ক্রম বজায় রেখে)
  const groupedByEra = [];
  paper.topics.forEach((topic) => {
    let group = groupedByEra.find((g) => g.era === topic.era);
    if (!group) {
      group = { era: topic.era, topics: [] };
      groupedByEra.push(group);
    }
    group.topics.push(topic);
  });

  function startEdit(topic) {
    setEditingId(topic.id);
    setEditForm({ era: topic.era, title: topic.title, content: topic.content });
    setExpandedId(topic.id);
  }

  function saveEdit(topicId) {
    if (!editForm.title.trim() || !editForm.content.trim()) return;
    editTopic(subject, paperId, topicId, editForm);
    setEditingId(null);
  }

  function submitNewTopic() {
    if (!addForm.era.trim() || !addForm.title.trim() || !addForm.content.trim())
      return;
    addTopic(subject, paperId, {
      id: Date.now(),
      era: addForm.era.trim(),
      title: addForm.title.trim(),
      content: addForm.content.trim(),
    });
    setAddForm({ era: "", title: "", content: "" });
    setShowAddForm(false);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 pt-6 pb-10">
      <div className="flex items-center gap-2 mb-5">
        <Link
          href={`/book-detailed/${encodeURIComponent(subject)}`}
          className="p-1.5 -ml-1.5 rounded-full hover:bg-[var(--color-app-primary-soft)] transition-colors"
        >
          <svg
            className="w-5 h-5"
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
          <h1 className="font-[family-name:var(--font-bengali-serif)] text-lg text-[var(--color-app-text)]">
            {paper.title}
          </h1>
          <p className="text-xs text-[var(--color-app-muted)]">{subject}</p>
        </div>
      </div>

      {groupedByEra.length === 0 && (
        <p className="text-sm text-[var(--color-app-muted)] mb-4">
          এখনো কোনো টপিক যোগ হয়নি।
        </p>
      )}

      {groupedByEra.map((group) => (
        <section key={group.era} className="mb-6">
          <h2 className="text-sm font-semibold mb-2 px-1 text-[var(--color-app-primary)]">
            {group.era}
          </h2>
          <div className="space-y-2">
            {group.topics.map((topic) => {
              const isExpanded = expandedId === topic.id;
              const isEditing = editingId === topic.id;
              return (
                <div
                  key={topic.id}
                  className="rounded-xl border bg-[var(--color-app-surface)] border-[var(--color-app-border)] overflow-hidden"
                >
                  {isEditing ? (
                    <div className="p-4 space-y-2">
                      <input
                        value={editForm.era}
                        onChange={(e) =>
                          setEditForm({ ...editForm, era: e.target.value })
                        }
                        placeholder="যুগ"
                        className="w-full p-2 rounded-lg border text-sm bg-[var(--color-app-bg)] border-[var(--color-app-border)] text-[var(--color-app-text)]"
                      />
                      <input
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm({ ...editForm, title: e.target.value })
                        }
                        placeholder="শিরোনাম"
                        className="w-full p-2 rounded-lg border text-sm bg-[var(--color-app-bg)] border-[var(--color-app-border)] text-[var(--color-app-text)]"
                      />
                      <textarea
                        value={editForm.content}
                        onChange={(e) =>
                          setEditForm({ ...editForm, content: e.target.value })
                        }
                        rows={4}
                        placeholder="বিস্তারিত লেখা"
                        className="w-full p-2 rounded-lg border text-sm resize-none bg-[var(--color-app-bg)] border-[var(--color-app-border)] text-[var(--color-app-text)]"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(topic.id)}
                          className="flex-1 py-2 rounded-full text-sm font-semibold text-white"
                          style={{ background: "var(--color-app-primary)" }}
                        >
                          সংরক্ষণ করুন
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-4 py-2 rounded-full text-sm font-medium text-[var(--color-app-muted)] border border-[var(--color-app-border)]"
                        >
                          বাতিল
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          setExpandedId(isExpanded ? null : topic.id)
                        }
                        className="w-full flex items-center justify-between p-4 text-left"
                      >
                        <p className="text-sm font-medium text-[var(--color-app-text)]">
                          {topic.title}
                        </p>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {canEdit && (
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                startEdit(topic);
                              }}
                              className="p-1 rounded-full hover:bg-[var(--color-app-primary-soft)]"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="var(--color-app-primary)"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </span>
                          )}
                          <svg
                            className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="var(--color-app-muted)"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </button>
                      {isExpanded && (
                        <div className="px-4 pb-4 text-sm leading-relaxed text-[var(--color-app-muted)]">
                          {topic.content}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {canEdit && (
        <div className="mt-6">
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-3 rounded-full text-sm font-semibold text-white"
              style={{ background: "var(--color-app-primary)" }}
            >
              + নতুন টপিক যোগ করুন
            </button>
          ) : (
            <div className="rounded-xl border p-4 space-y-2 bg-[var(--color-app-surface)] border-[var(--color-app-border)]">
              <input
                value={addForm.era}
                onChange={(e) =>
                  setAddForm({ ...addForm, era: e.target.value })
                }
                placeholder="যুগ (যেমন: প্রাচীনকাল, মধ্যযুগ, আধুনিক যুগ)"
                className="w-full p-2 rounded-lg border text-sm bg-[var(--color-app-bg)] border-[var(--color-app-border)] text-[var(--color-app-text)]"
              />
              <input
                value={addForm.title}
                onChange={(e) =>
                  setAddForm({ ...addForm, title: e.target.value })
                }
                placeholder="শিরোনাম"
                className="w-full p-2 rounded-lg border text-sm bg-[var(--color-app-bg)] border-[var(--color-app-border)] text-[var(--color-app-text)]"
              />
              <textarea
                value={addForm.content}
                onChange={(e) =>
                  setAddForm({ ...addForm, content: e.target.value })
                }
                rows={4}
                placeholder="বিস্তারিত লেখা"
                className="w-full p-2 rounded-lg border text-sm resize-none bg-[var(--color-app-bg)] border-[var(--color-app-border)] text-[var(--color-app-text)]"
              />
              <div className="flex gap-2">
                <button
                  onClick={submitNewTopic}
                  className="flex-1 py-2 rounded-full text-sm font-semibold text-white"
                  style={{ background: "var(--color-app-primary)" }}
                >
                  যোগ করুন
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-full text-sm font-medium text-[var(--color-app-muted)] border border-[var(--color-app-border)]"
                >
                  বাতিল
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {!canEdit && (
        <p className="mt-6 text-xs text-center text-[var(--color-app-muted)]">
          🔒 শুধুমাত্র যাচাইকৃত শিক্ষকরাই টপিক যোগ বা সম্পাদনা করতে পারেন
        </p>
      )}
    </div>
  );
}
