import { getUpdatedPapers } from "./bookDetailedHelper";
import { arrayMove } from "@dnd-kit/sortable";

export function buildAddTopic(papers, paperId, newTopic) {
  return getUpdatedPapers(papers, paperId, (paper) => {
    const nextSortOrder =
      paper.topics.length === 0
        ? 1
        : Math.max(...paper.topics.map((topic) => topic.sortOrder || 0)) + 1;

    const now = Date.now();

    const topicId =
      newTopic.id !== undefined && newTopic.id !== null
        ? newTopic.id
        : `topic-${now}`;

    return {
      ...paper,

      topics: [
        ...paper.topics,

        {
          ...newTopic,

          id: topicId,

          sortOrder: nextSortOrder,

          lastActivity: {
            type: "new",
            updatedAt: now,
          },

          createdAt: newTopic.createdAt || now,

          updatedAt: newTopic.updatedAt || now,

          editType: "major",

          published: true,

          views: 0,
          likes: 0,
          comments: 0,
          shares: 0,
          bookmarks: 0,
        },
      ],
    };
  });
}

export function buildEditTopic(papers, paperId, topicId, updatedFields) {
  return getUpdatedPapers(papers, paperId, (paper) => {
    const now = Date.now();

    const editType = updatedFields.editType === "minor" ? "minor" : "major";

    return {
      ...paper,

      topics: paper.topics.map((topic) =>
        String(topic.id) === String(topicId)
          ? {
              ...topic,

              ...updatedFields,

              id: topic.id,

              updatedAt: editType === "major" ? now : topic.updatedAt || now,

              editType,

              lastActivity: {
                type: editType,
                updatedAt: now,
              },
            }
          : topic,
      ),
    };
  });
}

export function buildDeleteTopic(papers, paperId, topicId) {
  return getUpdatedPapers(papers, paperId, (paper) => ({
    ...paper,

    topics: paper.topics.filter(
      (topic) => String(topic.id) !== String(topicId),
    ),
  }));
}

export function buildDuplicateTopic(papers, paperId, topicId) {
  return getUpdatedPapers(papers, paperId, (paper) => {
    const topics = [...paper.topics];

    const index = topics.findIndex(
      (topic) => String(topic.id) === String(topicId),
    );

    if (index === -1) {
      return paper;
    }

    const original = topics[index];

    const nextSortOrder =
      topics.length === 0
        ? 1
        : Math.max(...topics.map((topic) => topic.sortOrder || 0)) + 1;

    const now = Date.now();

    const copied = {
      ...original,

      id: `topic-${now}`,

      sortOrder: nextSortOrder,

      title: original.title + " (Copy)",

      createdAt: now,
      updatedAt: now,

      editType: "major",

      lastActivity: {
        type: "new",
        updatedAt: now,
      },
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

    const index = topics.findIndex(
      (topic) => String(topic.id) === String(topicId),
    );

    if (index <= 0) {
      return paper;
    }

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

    const index = topics.findIndex(
      (topic) => String(topic.id) === String(topicId),
    );

    if (index === -1 || index >= topics.length - 1) {
      return paper;
    }

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

      topics: moved.map((topic, index) => ({
        ...topic,

        sortOrder: index + 1,
      })),
    };
  });
}

export function buildAddVolume(papers, paperId, volumeTitle) {
  return getUpdatedPapers(papers, paperId, (paper) => {
    const title = volumeTitle.trim();

    if (!title) {
      throw new Error("অধ্যায়ের নাম লিখুন।");
    }

    const volumes = Array.isArray(paper.volumes) ? [...paper.volumes] : [];

    const alreadyExists = volumes.some(
      (volume) =>
        (volume.title || "").trim().toLowerCase() === title.toLowerCase(),
    );

    if (alreadyExists) {
      throw new Error("এই অধ্যায়টি ইতিমধ্যে আছে।");
    }

    const now = Date.now();

    return {
      ...paper,

      volumes: [
        ...volumes,

        {
          id: `volume-${now}`,
          title,

          createdAt: now,
          updatedAt: now,
        },
      ],
    };
  });
}

export function buildRenameVolume(
  papers,
  paperId,
  volumeId,
  oldTitle,
  newTitle,
) {
  return getUpdatedPapers(papers, paperId, (paper) => {
    const title = newTitle.trim();

    if (!title) {
      throw new Error("অধ্যায়ের নাম লিখুন।");
    }

    const volumes = Array.isArray(paper.volumes) ? [...paper.volumes] : [];

    const alreadyExists = volumes.some(
      (volume) =>
        volume.id !== volumeId &&
        (volume.title || "").trim().toLowerCase() === title.toLowerCase(),
    );

    if (alreadyExists) {
      throw new Error("এই নামে একটি অধ্যায় ইতিমধ্যে আছে।");
    }

    const now = Date.now();

    return {
      ...paper,

      volumes: volumes.map((volume) =>
        volume.id === volumeId
          ? {
              ...volume,
              title,
              updatedAt: now,
            }
          : volume,
      ),

      topics: paper.topics.map((topic) =>
        (topic.era || "") === oldTitle
          ? {
              ...topic,

              era: title,

              updatedAt: now,
            }
          : topic,
      ),
    };
  });
}

export function buildDeleteVolume(papers, paperId, volumeId, volumeTitle) {
  return getUpdatedPapers(papers, paperId, (paper) => ({
    ...paper,

    volumes: (Array.isArray(paper.volumes) ? paper.volumes : []).filter(
      (volume) => volume.id !== volumeId,
    ),

    topics: paper.topics.filter((topic) => (topic.era || "") !== volumeTitle),
  }));
}
