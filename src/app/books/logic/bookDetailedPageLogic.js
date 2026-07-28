export function buildVolumeGroups(topics) {
  const sortedTopics = [...topics].sort(
    (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0),
  );

  const volumeGroups = [];

  sortedTopics.forEach((topic) => {
    let volume = volumeGroups.find((v) => v.era === topic.era);

    if (!volume) {
      volume = {
        era: topic.era,
        chapters: [],
      };

      volumeGroups.push(volume);
    }

    const chapterKey = topic.chapter || "__none__";

    let chapter = volume.chapters.find((c) => c.key === chapterKey);

    if (!chapter) {
      chapter = {
        key: chapterKey,
        title: topic.chapter || null,
        topics: [],
      };

      volume.chapters.push(chapter);
    }

    chapter.topics.push(topic);
  });

  return volumeGroups;
}

export function filterVolumeGroups(volumeGroups, query) {
  const q = query.trim().toLowerCase();

  if (!q) return volumeGroups;

  return volumeGroups
    .map((vol) => {
      const volMatches = vol.era.toLowerCase().includes(q);

      const chapters = vol.chapters
        .map((ch) => {
          const chMatches = ch.title && ch.title.toLowerCase().includes(q);

          const topics =
            volMatches || chMatches
              ? ch.topics
              : ch.topics.filter((topic) =>
                  topic.title.toLowerCase().includes(q),
                );

          return {
            ...ch,
            topics,
          };
        })
        .filter((ch) => ch.topics.length > 0);

      return {
        ...vol,
        chapters,
      };
    })
    .filter((vol) => vol.chapters.length > 0);
}

export function getDragIndexes(topics, activeId, overId) {
  const oldIndex = topics.findIndex((topic) => topic.id === activeId);
  const newIndex = topics.findIndex((topic) => topic.id === overId);

  return {
    oldIndex,
    newIndex,
  };
}

export function canReorder(active, over) {
  if (!over) return false;
  if (active.id === over.id) return false;

  return true;
}
