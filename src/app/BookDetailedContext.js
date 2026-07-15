"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { doc, onSnapshot, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "./firebase";

const BookDetailedContext = createContext(null);

const subjectList = ["বাংলা", "ইংরেজি", "গণিত", "বিজ্ঞান"];

export function BookDetailedProvider({ children }) {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribers = subjectList.map((subject) =>
      onSnapshot(doc(db, "bookDetailedContent", subject), (snap) => {
        if (snap.exists()) {
          setContent((prev) => ({ ...prev, [subject]: snap.data() }));
        }
        setLoading(false);
      }),
    );
    return () => unsubscribers.forEach((unsub) => unsub());
  }, []);

  async function addTopic(subject, paperId, newTopic) {
    const subjectData = content[subject];
    const updatedPapers = subjectData.papers.map((paper) => {
      if (paper.id !== paperId) return paper;
      return { ...paper, topics: [...paper.topics, newTopic] };
    });
    await updateDoc(doc(db, "bookDetailedContent", subject), {
      papers: updatedPapers,
    });
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
    await updateDoc(doc(db, "bookDetailedContent", subject), {
      papers: updatedPapers,
    });
  }

  return (
    <BookDetailedContext.Provider
      value={{ content, addTopic, editTopic, loading }}
    >
      {children}
    </BookDetailedContext.Provider>
  );
}

export function useBookDetailed() {
  return useContext(BookDetailedContext);
}
