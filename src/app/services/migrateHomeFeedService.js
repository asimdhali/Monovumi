import { saveHomeFeedPost } from "./homeFeedService";

export async function migrateHomeFeed(content) {
  for (const subjectName of Object.keys(content)) {
    const subject = content[subjectName];

    for (const paper of subject.papers || []) {
      for (const topic of paper.topics || []) {
        await saveHomeFeedPost({
          ...topic,
          subject: subjectName,
          paperId: paper.id,
          paperTitle: paper.title,
          activityType: topic.activityType || "new",
          activityTime:
            topic.activityTime ||
            topic.updatedAt ||
            topic.createdAt ||
            Date.now(),
        });
      }
    }
  }

  console.log("Migration Complete");
}
