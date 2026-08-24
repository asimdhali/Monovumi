export function buildHomeFeed(content) {
  const feed = [];

  Object.entries(content).forEach(([subject, subjectData]) => {
    subjectData.papers.forEach((paper) => {
      paper.topics.forEach((topic) => {
        if (!topic?.id) {
          console.warn("Topic skipped because id is missing", topic);
          return;
        }

        feed.push({
          ...topic,

          topicId: topic.id,

          subject,
          paperId: paper.id,
          paperTitle: paper.title,

          activityTime:
            topic.lastActivity?.updatedAt ||
            topic.updatedAt ||
            topic.createdAt ||
            0,

          activityType: topic.lastActivity?.type || "new",
        });
      });
    });
  });

  return feed.sort((a, b) => b.activityTime - a.activityTime);
}
