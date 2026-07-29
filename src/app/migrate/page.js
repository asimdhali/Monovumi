"use client";

import { useState } from "react";
import { useBookDetailed } from "../BookDetailedContext";
import { saveHomeFeedPost } from "../services/homeFeedService";

export default function MigrateHomeFeed() {
  const { content } = useBookDetailed();

  const [running, setRunning] = useState(false);

  async function handleMigrate() {
    setRunning(true);

    try {
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

      alert("Migration Completed");
    } catch (err) {
      console.error(err);

      alert("Migration Failed");
    }

    setRunning(false);
  }

  return (
    <div className="p-10">
      <button
        onClick={handleMigrate}
        disabled={running}
        className="px-5 py-3 rounded bg-blue-600 text-white"
      >
        {running ? "Migrating..." : "Start HomeFeed Migration"}
      </button>
    </div>
  );
}
