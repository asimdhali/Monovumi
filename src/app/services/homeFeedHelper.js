export function buildHomeFeed(content) {
  const feed = [];

  Object.entries(content).forEach(([subject, subjectData]) => {
    subjectData.papers.forEach((paper) => {
      paper.topics.forEach((topic) => {
        // if (!topic.published) return;

        feed.push({
          ...topic,

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
