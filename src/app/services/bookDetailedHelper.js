export function getUpdatedPapers(papers, paperId, callback) {
  return papers.map((paper) => {
    if (paper.id !== paperId) return paper;

    return callback(paper);
  });
}
