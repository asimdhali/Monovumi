"use client";

import { migrateHomeFeed } from "./services/migrateHomeFeedService";
import { saveHomeFeedPost } from "./services/homeFeedService";
import { createContext, useContext, useState, useEffect } from "react";
import { db } from "./firebase";
import { savePapers, subscribeToSubject } from "./services/bookDetailedService";
import { getUpdatedPapers } from "./services/bookDetailedHelper";
import {
  buildAddTopic,
  buildEditTopic,
  buildDeleteTopic,
  buildDuplicateTopic,
  buildMoveTopicUp,
  buildMoveTopicDown,
  buildReorderTopic,
} from "./services/bookDetailedLogic";
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

    const now = Date.now();

    const updatedPapers = buildAddTopic(subjectData.papers, paperId, {
      ...newTopic,
      createdAt: now,
      updatedAt: now,
      editType: "major",
    });

    await savePapers(subject, updatedPapers);
    const savedPaper = updatedPapers.find((p) => p.id === paperId);

    const savedTopic = savedPaper.topics[savedPaper.topics.length - 1];

    await saveHomeFeedPost({
      ...savedTopic,
      subject,
      paperId,
      paperTitle: savedPaper.title,
      activityTime: savedTopic.updatedAt,
      activityType: "new",
    });
  }

  async function editTopic(subject, paperId, topicId, updatedFields) {
    const subjectData = content[subject];

    const now = Date.now();

    const updatedPapers = buildEditTopic(subjectData.papers, paperId, topicId, {
      ...updatedFields,

      updatedAt: now,

      activityType: "major",

      activityTime: now,
    });

    await savePapers(subject, updatedPapers);
  }

  async function deleteTopic(subject, paperId, topicId) {
    const subjectData = content[subject];

    const updatedPapers = buildDeleteTopic(
      subjectData.papers,
      paperId,
      topicId,
    );

    await savePapers(subject, updatedPapers);
  }

  async function duplicateTopic(subject, paperId, topicId) {
    const subjectData = content[subject];

    const updatedPapers = buildDuplicateTopic(
      subjectData.papers,
      paperId,
      topicId,
    );

    await savePapers(subject, updatedPapers);
  }

  async function moveTopicUp(subject, paperId, topicId) {
    const subjectData = content[subject];

    const updatedPapers = buildMoveTopicUp(
      subjectData.papers,
      paperId,
      topicId,
    );

    await savePapers(subject, updatedPapers);
  }

  async function moveTopicDown(subject, paperId, topicId) {
    const subjectData = content[subject];

    const updatedPapers = buildMoveTopicDown(
      subjectData.papers,
      paperId,
      topicId,
    );

    await savePapers(subject, updatedPapers);
  }

  async function reorderTopic(subject, paperId, oldIndex, newIndex) {
    const subjectData = content[subject];

    const updatedPapers = buildReorderTopic(
      subjectData.papers,
      paperId,
      oldIndex,
      newIndex,
    );

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
        reorderTopic,
        loading,
      }}
    >
      {children}
    </BookDetailedContext.Provider>
  );
}

export function useBookDetailed() {
  return useContext(BookDetailedContext);
}
