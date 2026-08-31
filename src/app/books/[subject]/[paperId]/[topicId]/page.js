"use client";

import { use, useEffect } from "react";
import TopicHeader from "../../../components/TopicHeader";
import TopicContent from "../../../components/TopicContent";
import { useBookDetailed } from "../../../../BookDetailedContext";
import TopicNavigation from "../../../components/TopicNavigation";
import RelatedTopics from "../../../components/RelatedTopics";
import HomeFeedSkeleton from "@/app/components/HomeFeedSkeleton";

export default function TopicPage({ params }) {
  const { subject: rawSubject, paperId, topicId } = use(params);

  const subject = decodeURIComponent(rawSubject);

  const { content, loading } = useBookDetailed();

  const subjectData = content?.[subject];

  const paper = subjectData?.papers?.find(
    (paper) => String(paper.id) === String(paperId),
  );

  const topic = paper?.topics?.find(
    (topic) => String(topic.id) === String(topicId),
  );

  // ---------------------------------------------------------
  // Page title
  // ---------------------------------------------------------
  useEffect(() => {
    if (topic) {
      document.title = `${topic.title} — ${subject} — মনোভূমি`;
    } else {
      document.title = "টপিক — মনোভূমি";
    }
  }, [topic, subject]);

  // ---------------------------------------------------------
  // Sorted topics
  // ---------------------------------------------------------
  const sortedTopics = [...(paper?.topics || [])].sort(
    (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0),
  );

  // ---------------------------------------------------------
  // Related topics
  // ---------------------------------------------------------
  const relatedTopics = sortedTopics.filter(
    (t) =>
      String(t.id) !== String(topicId) &&
      (t.chapter === topic?.chapter || t.era === topic?.era),
  );

  // ---------------------------------------------------------
  // Current topic index
  // ---------------------------------------------------------
  const currentIndex = sortedTopics.findIndex(
    (t) => String(t.id) === String(topicId),
  );

  // ---------------------------------------------------------
  // Previous topic
  // ---------------------------------------------------------
  const previousTopic =
    currentIndex > 0 ? sortedTopics[currentIndex - 1] : null;

  // ---------------------------------------------------------
  // Next topic
  // ---------------------------------------------------------
  const nextTopic =
    currentIndex >= 0 && currentIndex < sortedTopics.length - 1
      ? sortedTopics[currentIndex + 1]
      : null;

  // ---------------------------------------------------------
  // Loading
  // ---------------------------------------------------------
  if (loading) {
    return <HomeFeedSkeleton />;
  }

  // ---------------------------------------------------------
  // Topic not found
  // ---------------------------------------------------------
  if (!topic) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-[var(--color-app-text)]">
        Topic পাওয়া যায়নি।
      </div>
    );
  }

  // ---------------------------------------------------------
  // Topic page
  // ---------------------------------------------------------
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5">
      <TopicHeader subject={subject} paperId={paperId} topic={topic} />

      <TopicContent content={topic.content} />

      <TopicNavigation
        subject={subject}
        paperId={paperId}
        previousTopic={previousTopic}
        nextTopic={nextTopic}
      />

      <RelatedTopics
        subject={subject}
        paperId={paperId}
        currentTopicId={topic.id}
        topics={relatedTopics}
      />
    </div>
  );
}
