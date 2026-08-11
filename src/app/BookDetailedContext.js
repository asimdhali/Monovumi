"use client";

import { migrateHomeFeed } from "./services/migrateHomeFeedService";
import {
  saveHomeFeedPost,
  deleteHomeFeedPost,
} from "./services/homeFeedService";
import { createContext, useContext, useState, useEffect } from "react";
import { db } from "./firebase";
import {
  savePapers,
  subscribeToSubject,
  subscribeToAllSubjects,
  createSubject,
  updateSubjectIcon,
  deleteSubject,
  renameSubject,
} from "./services/bookDetailedService";
import { getUpdatedPapers } from "./services/bookDetailedHelper";
import {
  buildAddTopic,
  buildEditTopic,
  buildDeleteTopic,
  buildDuplicateTopic,
  buildMoveTopicUp,
  buildMoveTopicDown,
  buildReorderTopic,
  buildAddVolume,
  buildRenameVolume,
  buildDeleteVolume,
} from "./services/bookDetailedLogic";
import { arrayMove } from "@dnd-kit/sortable";

const BookDetailedContext = createContext(null);

const SUBJECT_ORDER = [
  "বাংলা সাহিত্য",
  "বাংলা ভাষা",
  "ইংরেজি সাহিত্য",
  "ইংরেজি ভাষা",
  "গণিত",
  "বাংলাদেশ বিষয়াবলি",
  "আন্তর্জাতিক বিষয়াবলি",
  "ভূগোল",
  "সাধারণ বিজ্ঞান",
  "কম্পিউটার শিক্ষা",
  "মানসিক দক্ষতা",
  "নৈতিকতা ও সুশাসন",
];

export function BookDetailedProvider({ children }) {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAllSubjects((data) => {
      setContent(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function addSubject(subject, icon = "📚") {
    const name = subject.trim();

    if (!name) return;

    if (content[name]) {
      throw new Error("এই বিষয়টি ইতিমধ্যে আছে।");
    }

    // নির্ধারিত তালিকায় থাকলে সেই অবস্থান
    // না থাকলে সবার শেষে
    const orderIndex = SUBJECT_ORDER.indexOf(name);

    const order =
      orderIndex !== -1
        ? orderIndex
        : Math.max(
            -1,
            ...Object.values(content).map((item) => item.order ?? -1),
          ) + 1;

    await createSubject(name, icon, order);
  }

  async function changeSubjectIcon(subject, icon) {
    if (!content[subject]) {
      throw new Error("বিষয়টি পাওয়া যায়নি।");
    }

    await updateSubjectIcon(subject, icon);
  }

  async function removeSubject(subject) {
    if (!content[subject]) {
      throw new Error("বিষয়টি পাওয়া যায়নি।");
    }

    await deleteSubject(subject);
  }

  async function renameBookSubject(oldName, newName) {
    const oldSubject = oldName.trim();
    const newSubject = newName.trim();

    if (!oldSubject) {
      throw new Error("পুরোনো বিষয়ের নাম পাওয়া যায়নি।");
    }

    if (!newSubject) {
      throw new Error("বিষয়ের নাম লিখুন।");
    }

    if (oldSubject === newSubject) {
      return;
    }

    if (content[newSubject]) {
      throw new Error("এই নামে বিষয় ইতিমধ্যে আছে।");
    }

    const oldData = content[oldSubject];

    if (!oldData) {
      throw new Error("পুরোনো বিষয়টি পাওয়া যায়নি।");
    }

    // নতুন নামে বিষয় তৈরি
    await createSubject(newSubject, oldData.icon || "📚", oldData.order ?? 999);

    // পুরোনো বিষয়ের সব papers নতুন বিষয়ে কপি
    await savePapers(newSubject, oldData.papers || []);

    // পুরোনো বিষয় মুছে ফেলা
    await deleteSubject(oldSubject);
  }

  async function renameSubjectHandler(oldName, newName) {
    const name = newName.trim();

    if (!name) {
      throw new Error("বিষয়ের নাম লিখুন।");
    }

    if (oldName === name) return;

    if (content[name]) {
      throw new Error("এই নামে বিষয় ইতিমধ্যে আছে।");
    }

    await renameSubject(oldName, name);
  }

  async function addVolume(subject, paperId, volumeTitle) {
    const subjectData = content[subject];

    if (!subjectData) {
      throw new Error("বিষয়টি পাওয়া যায়নি।");
    }

    const updatedPapers = buildAddVolume(
      subjectData.papers,
      paperId,
      volumeTitle,
    );

    await savePapers(subject, updatedPapers);
  }

  async function renameVolume(subject, paperId, volumeId, oldTitle, newTitle) {
    const subjectData = content[subject];

    if (!subjectData) {
      throw new Error("বিষয়টি পাওয়া যায়নি।");
    }

    const updatedPapers = buildRenameVolume(
      subjectData.papers,
      paperId,
      volumeId,
      oldTitle,
      newTitle,
    );

    await savePapers(subject, updatedPapers);
  }

  async function deleteVolume(subject, paperId, volumeId, volumeTitle) {
    const subjectData = content[subject];

    if (!subjectData) {
      throw new Error("বিষয়টি পাওয়া যায়নি।");
    }

    const updatedPapers = buildDeleteVolume(
      subjectData.papers,
      paperId,
      volumeId,
      volumeTitle,
    );

    await savePapers(subject, updatedPapers);
  }

  async function addTopic(subject, paperId, newTopic) {
    console.log("subject =", subject);
    console.log("paperId =", paperId);
    console.log("newTopic =", newTopic);

    const subjectData = content[subject];

    const now = Date.now();

    const updatedPapers = buildAddTopic(subjectData.papers, paperId, {
      ...newTopic,
      createdAt: now,
      updatedAt: now,
      editType: "major",
    });

    updatedPapers.forEach((p) => {
      console.log("paper =>", p.id, typeof p.id, p.title);
    });

    console.log("paperId type =", typeof paperId);

    await savePapers(subject, updatedPapers);

    const savedPaper = updatedPapers.find((p) => p.id === paperId);

    if (!savedPaper) {
      console.error("Paper not found:", paperId);
      return;
    }

    const savedTopic = savedPaper.topics.at(-1);

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

      activityType: updatedFields.editType,

      activityTime: now,
    });

    await savePapers(subject, updatedPapers);
    const savedPaper = updatedPapers.find((p) => p.id === paperId);

    if (!savedPaper) return;

    const savedTopic = savedPaper.topics.find(
      (t) => String(t.id) === String(topicId),
    );

    if (!savedTopic) return;

    await saveHomeFeedPost({
      ...savedTopic,
      subject,
      paperId,
      paperTitle: savedPaper.title,
      activityTime: now,
      activityType: updatedFields.editType || "major",
    });
  }

  async function deleteTopic(subject, paperId, topicId) {
    const subjectData = content[subject];

    if (!subjectData) {
      throw new Error("বিষয়টি পাওয়া যায়নি।");
    }

    const updatedPapers = buildDeleteTopic(
      subjectData.papers,
      paperId,
      topicId,
    );

    // মূল Book Detailed থেকে Topic মুছে ফেলুন
    await savePapers(subject, updatedPapers);

    // Home Feed থেকেও একই Topic-এর পোস্ট মুছে ফেলুন
    await deleteHomeFeedPost(topicId);
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
        addSubject,
        renameBookSubject,
        changeSubjectIcon,
        removeSubject,
        addVolume,
        renameVolume,
        deleteVolume,
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
