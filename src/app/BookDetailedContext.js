"use client";

import { createContext, useContext, useState } from "react";
import { bookDetailedContent as initialContent } from "./data";

const BookDetailedContext = createContext(null);

export function BookDetailedProvider({ children }) {
  const [content, setContent] = useState(initialContent);

  function addTopic(subject, paperId, newTopic) {
    setContent((prev) => {
      const updated = { ...prev };
      const papers = updated[subject].papers.map((paper) => {
        if (paper.id !== paperId) return paper;
        return { ...paper, topics: [...paper.topics, newTopic] };
      });
      updated[subject] = { ...updated[subject], papers };
      return updated;
    });
  }

  function editTopic(subject, paperId, topicId, updatedFields) {
    setContent((prev) => {
      const updated = { ...prev };
      const papers = updated[subject].papers.map((paper) => {
        if (paper.id !== paperId) return paper;
        const topics = paper.topics.map((t) =>
          t.id === topicId ? { ...t, ...updatedFields } : t,
        );
        return { ...paper, topics };
      });
      updated[subject] = { ...updated[subject], papers };
      return updated;
    });
  }

  return (
    <BookDetailedContext.Provider value={{ content, addTopic, editTopic }}>
      {children}
    </BookDetailedContext.Provider>
  );
}

export function useBookDetailed() {
  return useContext(BookDetailedContext);
}
