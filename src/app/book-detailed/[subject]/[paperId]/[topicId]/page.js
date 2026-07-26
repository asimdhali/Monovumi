"use client";

import { use } from "react";
import TopicHeader from "../../../components/TopicHeader";
import TopicContent from "../../../components/TopicContent";
import { useBookDetailed } from "../../../../BookDetailedContext";
import TopicNavigation from "../../../components/TopicNavigation";

export default function TopicPage({ params }) {
  const { subject: rawSubject, paperId, topicId } = use(params);

  const subject = decodeURIComponent(rawSubject);

  const { content } = useBookDetailed();

  const subjectData = content?.[subject];

  const paper = subjectData?.papers?.find((paper) => paper.id === paperId);

  const topic = paper?.topics?.find((topic) => String(topic.id) === topicId);
  const sortedTopics = [...(paper?.topics || [])].sort(
    (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0),
  );

  const currentIndex = sortedTopics.findIndex((t) => String(t.id) === topicId);

  const previousTopic =
    currentIndex > 0 ? sortedTopics[currentIndex - 1] : null;

  const nextTopic =
    currentIndex < sortedTopics.length - 1
      ? sortedTopics[currentIndex + 1]
      : null;

  if (!topic) {
    return <div className="max-w-3xl mx-auto p-6">Topic পাওয়া যায়নি।</div>;
  }

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
    </div>
  );
}
