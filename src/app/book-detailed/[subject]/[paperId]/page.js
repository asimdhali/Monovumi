"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useBookDetailed } from "../../../BookDetailedContext";
import { useAuth } from "../../../AuthContext";

function TopicCard({ topic, canEdit, onOpen }) {
  return (
    <button
      onClick={onOpen}
      className="text-left rounded-xl border p-4 bg-[var(--color-app-surface)] border-[var(--color-app-border)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 flex flex-col h-full"
    >
      <p className="text-sm font-semibold mb-1.5 text-[var(--color-app-text)] line-clamp-2">
        {topic.title}
      </p>
      <p className="text-xs leading-relaxed text-[var(--color-app-muted)] line-clamp-3 flex-1">
        {topic.content}
      </p>
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-[var(--color-app-border)]">
        <span className="text-[10px] font-medium text-[var(--color-app-primary)]">
          বিস্তারিত পড়ুন →
        </span>
        {canEdit && (
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="var(--color-app-muted)"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        )}
      </div>
    </button>
  );
}

function TopicModal({ topic, canEdit, onClose, onSave, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    era: topic.era,
    title: topic.title,
    content: topic.content,
  });
  const [confirmDelete, setConfirmDelete] = useState(false);

  function handleSave() {
    if (!form.title.trim() || !form.content.trim()) return;
    onSave(form);
    setIsEditing(false);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-[var(--color-app-surface)] rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6">
        {isEditing ? (
          <div className="space-y-3">
            <h3 className="font-[family-name:var(--font-bengali-serif)] text-lg text-[var(--color-app-text)] mb-2">
              টপিক সম্পাদনা
            </h3>
            <input
              value={form.era}
              onChange={(e) => setForm({ ...form, era: e.target.value })}
              placeholder="যুগ"
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
              className="w-full p-2.5 rounded-lg border text-sm resize-none bg-[var(--color-app-bg)] border-[var(--color-app-border)] text-[var(--color-app-text)]"
            />
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 rounded-full text-sm font-semibold text-white"
                style={{ background: "var(--color-app-primary)" }}
              >
                সংরক্ষণ করুন
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 rounded-full text-sm font-medium border border-[var(--color-app-border)] text-[var(--color-app-muted)]"
              >
                বাতিল
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span
                  className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2"
                  style={{
                    background: "var(--color-app-primary-soft)",
                    color: "var(--color-app-primary)",
                  }}
                >
                  {topic.era}
                </span>
                <h3 className="font-[family-name:var(--font-bengali-serif)] text-lg text-[var(--color-app-text)]">
                  {topic.title}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-[var(--color-app-primary-soft)] flex-shrink-0"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <p className="text-sm leading-relaxed text-[var(--color-app-muted)] whitespace-pre-wrap">
              {topic.content}
            </p>

            {canEdit && (
              <div className="flex gap-2 mt-5 pt-4 border-t border-[var(--color-app-border)]">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 py-2 rounded-full text-sm font-semibold text-white"
                  style={{ background: "var(--color-app-primary)" }}
                >
                  ✏️ সম্পাদনা করুন
                </button>
                {!confirmDelete ? (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="px-4 py-2 rounded-full text-sm font-medium border border-red-300 text-red-500"
                  >
                    🗑️ মুছুন
                  </button>
                ) : (
                  <div className="flex gap-1.5">
                    <button
                      onClick={onDelete}
                      className="px-3 py-2 rounded-full text-sm font-semibold text-white bg-red-500"
                    >
                      নিশ্চিত?
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="px-3 py-2 rounded-full text-sm font-medium border border-[var(--color-app-border)] text-[var(--color-app-muted)]"
                    >
                      না
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function AddTopicModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ era: "", title: "", content: "" });

  function handleSubmit() {
    if (!form.era.trim() || !form.title.trim() || !form.content.trim()) return;
    onAdd(form);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-[var(--color-app-surface)] rounded-2xl w-full max-w-lg p-6">
        <h3 className="font-[family-name:var(--font-bengali-serif)] text-lg text-[var(--color-app-text)] mb-4">
          + নতুন টপিক যোগ করুন
        </h3>
        <div className="space-y-3">
          <input
            value={form.era}
            onChange={(e) => setForm({ ...form, era: e.target.value })}
            placeholder="যুগ (যেমন: প্রাচীনকাল, মধ্যযুগ, আধুনিক যুগ)"
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
              যোগ করুন
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-full text-sm font-medium border border-[var(--color-app-border)] text-[var(--color-app-muted)]"
            >
              বাতিল
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaperPage({ params }) {
  const { subject: rawSubject, paperId } = use(params);
  const subject = decodeURIComponent(rawSubject);
  const { content, addTopic, editTopic, deleteTopic } = useBookDetailed();
  const { role, teacherVerified } = useAuth();
  const canEdit = role === "teacher" && teacherVerified;

  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

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

  const groupedByEra = [];
  paper.topics.forEach((topic) => {
    let group = groupedByEra.find((g) => g.era === topic.era);
    if (!group) {
      group = { era: topic.era, topics: [] };
      groupedByEra.push(group);
    }
    group.topics.push(topic);
  });

  function handleSaveEdit(updatedFields) {
    editTopic(subject, paperId, selectedTopic.id, updatedFields);
    setSelectedTopic({ ...selectedTopic, ...updatedFields });
  }

  function handleDelete() {
    deleteTopic(subject, paperId, selectedTopic.id);
    setSelectedTopic(null);
  }

  function handleAdd(form) {
    addTopic(subject, paperId, {
      id: Date.now(),
      era: form.era.trim(),
      title: form.title.trim(),
      content: form.content.trim(),
    });
    setShowAddModal(false);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-6 pt-6 pb-14">
      {/* হেডার */}
      <div className="flex items-start justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Link
            href={`/book-detailed/${encodeURIComponent(subject)}`}
            className="p-1.5 -ml-1.5 rounded-full hover:bg-[var(--color-app-primary-soft)] transition-colors flex-shrink-0"
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
            <h1 className="font-[family-name:var(--font-bengali-serif)] text-xl text-[var(--color-app-text)]">
              {paper.title}
            </h1>
            <p className="text-xs text-[var(--color-app-muted)]">
              {subject} · {paper.topics.length}টি টপিক
            </p>
          </div>
        </div>

        {canEdit && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex-shrink-0 flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full text-white"
            style={{ background: "var(--color-app-primary)" }}
          >
            <span className="text-base leading-none">+</span> নতুন টপিক
          </button>
        )}
      </div>

      {groupedByEra.length === 0 && (
        <p className="text-sm text-center text-[var(--color-app-muted)] py-10">
          এখনো কোনো টপিক যোগ হয়নি।
        </p>
      )}

      {/* যুগ অনুযায়ী গ্রুপ করা গ্রিড */}
      {groupedByEra.map((group) => (
        <section key={group.era} className="mb-8">
          <div className="flex items-center gap-2 mb-3 px-1">
            <h2 className="text-sm font-semibold text-[var(--color-app-primary)]">
              {group.era}
            </h2>
            <span className="text-[10px] text-[var(--color-app-muted)]">
              ({group.topics.length}টি)
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {group.topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                canEdit={canEdit}
                onOpen={() => setSelectedTopic(topic)}
              />
            ))}
          </div>
        </section>
      ))}

      {!canEdit && (
        <p className="mt-6 text-xs text-center text-[var(--color-app-muted)]">
          🔒 শুধুমাত্র যাচাইকৃত শিক্ষকরাই টপিক যোগ, সম্পাদনা বা মুছতে পারেন
        </p>
      )}

      {selectedTopic && (
        <TopicModal
          topic={selectedTopic}
          canEdit={canEdit}
          onClose={() => setSelectedTopic(null)}
          onSave={handleSaveEdit}
          onDelete={handleDelete}
        />
      )}

      {showAddModal && (
        <AddTopicModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
}
