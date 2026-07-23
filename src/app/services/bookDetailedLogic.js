import { getUpdatedPapers } from "./bookDetailedHelper";
import { arrayMove } from "@dnd-kit/sortable";

export function buildAddTopic(papers, paperId, newTopic) {
  return getUpdatedPapers(papers, paperId, (paper) => {
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
}

// নতুন
export function buildEditTopic(papers, paperId, topicId, updatedFields) {
  return getUpdatedPapers(papers, paperId, (paper) => ({
    ...paper,
    topics: paper.topics.map((topic) =>
      topic.id === topicId
        ? {
            ...topic,
            ...updatedFields,
          }
        : topic,
    ),
  }));
}

export function buildDeleteTopic(papers, paperId, topicId) {
  return getUpdatedPapers(papers, paperId, (paper) => ({
    ...paper,
    topics: paper.topics.filter((topic) => topic.id !== topicId),
  }));
}

export function buildDuplicateTopic(papers, paperId, topicId) {
  return getUpdatedPapers(papers, paperId, (paper) => {
    const topics = [...paper.topics];

    const index = topics.findIndex((topic) => topic.id === topicId);

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
}

function sortTopics(topics) {
  return [...topics].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

export function buildMoveTopicUp(papers, paperId, topicId) {
  return getUpdatedPapers(papers, paperId, (paper) => {
    const topics = sortTopics(paper.topics);

    const index = topics.findIndex((topic) => topic.id === topicId);

    if (index <= 0) return paper;

    const temp = topics[index].sortOrder;

    topics[index].sortOrder = topics[index - 1].sortOrder;

    topics[index - 1].sortOrder = temp;

    return {
      ...paper,
      topics,
    };
  });
}

export function buildMoveTopicDown(papers, paperId, topicId) {
  return getUpdatedPapers(papers, paperId, (paper) => {
    const topics = sortTopics(paper.topics);

    const index = topics.findIndex((topic) => topic.id === topicId);

    if (index === -1 || index >= topics.length - 1) return paper;

    const temp = topics[index].sortOrder;

    topics[index].sortOrder = topics[index + 1].sortOrder;

    topics[index + 1].sortOrder = temp;

    return {
      ...paper,
      topics,
    };
  });
}

export function buildReorderTopic(papers, paperId, oldIndex, newIndex) {
  return getUpdatedPapers(papers, paperId, (paper) => {
    const topics = sortTopics(paper.topics);

    const moved = arrayMove(topics, oldIndex, newIndex);

    return {
      ...paper,
      topics: moved.map((topic, i) => ({
        ...topic,
        sortOrder: i + 1,
      })),
    };
  });
}
