"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { db } from "./firebase";
import {
  savePapers,
  subscribeToSubject,
  getUpdatedPapers,
} from "./services/bookDetailedService";
import { arrayMove } from "@dnd-kit/sortable";

const BookDetailedContext = createContext(null);

const subjectList = ["বাংলা", "ইংরেজি", "গণিত", "বিজ্ঞান"];

export function BookDetailedProvider({ children }) {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribers = subjectList.map((subject) =>
      subscribeToSubject(subject, (data) => {
        setContent((prev) => ({
          ...prev,
          [subject]: data,
        }));

        setLoading(false);
      }),
    );

    return () => unsubscribers.forEach((unsub) => unsub());
  }, []);

  async function addTopic(subject, paperId, newTopic) {
    const subjectData = content[subject];
    const updatedPapers = getUpdatedPapers(subjectData, paperId, (paper) => {
      const nextSortOrder =
        paper.topics.length === 0
          ? 1
          : Math.max(...paper.topics.map((t) => t.sortOrder || 0)) + 1;

      return {
        ...paper,
        topics: [
          ...paper.topics,
          {
            ...newTopic,
            sortOrder: nextSortOrder,
          },
        ],
      };
    });
    await savePapers(subject, updatedPapers);
  }

  async function editTopic(subject, paperId, topicId, updatedFields) {
    const subjectData = content[subject];
    const updatedPapers = subjectData.papers.map((paper) => {
      if (paper.id !== paperId) return paper;
      const topics = paper.topics.map((t) =>
        t.id === topicId ? { ...t, ...updatedFields } : t,
      );
      return { ...paper, topics };
    });
    await savePapers(subject, updatedPapers);
  }

  async function deleteTopic(subject, paperId, topicId) {
    const subjectData = content[subject];
    const updatedPapers = subjectData.papers.map((paper) => {
      if (paper.id !== paperId) return paper;
      return { ...paper, topics: paper.topics.filter((t) => t.id !== topicId) };
    });
    await savePapers(subject, updatedPapers);
  }

  async function duplicateTopic(subject, paperId, topicId) {
    const subjectData = content[subject];

    const updatedPapers = subjectData.papers.map((paper) => {
      if (paper.id !== paperId) return paper;

      const topics = [...paper.topics];

      const index = topics.findIndex((t) => t.id === topicId);

      if (index === -1) return paper;

      const original = topics[index];

      const nextSortOrder =
        topics.length === 0
          ? 1
          : Math.max(...topics.map((t) => t.sortOrder || 0)) + 1;

      const copied = {
        ...original,
        id: Date.now(),
        sortOrder: nextSortOrder,
        title: original.title + " (Copy)",
      };

      topics.splice(index + 1, 0, copied);

      return {
        ...paper,
        topics,
      };
    });

    await savePapers(subject, updatedPapers);
  }

  async function moveTopicUp(subject, paperId, topicId) {
    const subjectData = content[subject];

    const updatedPapers = subjectData.papers.map((paper) => {
      if (paper.id !== paperId) return paper;

      // sortOrder অনুযায়ী সাজানো
      const topics = [...paper.topics].sort(
        (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
      );

      const index = topics.findIndex((t) => t.id === topicId);

      if (index <= 0) return paper;

      // sortOrder অদলবদল
      const currentOrder = topics[index].sortOrder;
      topics[index].sortOrder = topics[index - 1].sortOrder;
      topics[index - 1].sortOrder = currentOrder;

      return {
        ...paper,
        topics,
      };
    });

    await savePapers(subject, updatedPapers);
  }

  async function moveTopicDown(subject, paperId, topicId) {
    const subjectData = content[subject];

    const updatedPapers = subjectData.papers.map((paper) => {
      if (paper.id !== paperId) return paper;

      // sortOrder অনুযায়ী সাজানো
      const topics = [...paper.topics].sort(
        (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
      );

      const index = topics.findIndex((t) => t.id === topicId);

      if (index === -1 || index >= topics.length - 1) return paper;

      // sortOrder অদলবদল
      const currentOrder = topics[index].sortOrder;
      topics[index].sortOrder = topics[index + 1].sortOrder;
      topics[index + 1].sortOrder = currentOrder;

      return {
        ...paper,
        topics,
      };
    });

    await savePapers(subject, updatedPapers);
  }

  async function reorderTopic(subject, paperId, oldIndex, newIndex) {
    const subjectData = content[subject];

    const updatedPapers = subjectData.papers.map((paper) => {
      if (paper.id !== paperId) return paper;

      // sortOrder অনুযায়ী সাজানো
      const topics = [...paper.topics].sort(
        (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
      );
      const moved = arrayMove(topics, oldIndex, newIndex);

      const reordered = moved.map((topic, i) => ({
        ...topic,
        sortOrder: i + 1,
      }));

      return {
        ...paper,
        topics: reordered,
      };
    });

    await savePapers(subject, updatedPapers);
  }

  return (
    <BookDetailedContext.Provider
      value={{
        content,
        addTopic,
        editTopic,
        deleteTopic,
        duplicateTopic,
        moveTopicUp,
        moveTopicDown,
        loading,
        reorderTopic,
      }}
    >
      {children}
    </BookDetailedContext.Provider>
  );
}

export function useBookDetailed() {
  return useContext(BookDetailedContext);
}
