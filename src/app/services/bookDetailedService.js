import { doc, updateDoc, onSnapshot } from "firebase/firestore";

import { db } from "../firebase";

export function subscribeToSubject(subject, callback) {
  return onSnapshot(doc(db, "bookDetailedContent", subject), (snap) => {
    if (snap.exists()) {
      callback(snap.data());
    }
  });
}

export async function savePapers(subject, papers) {
  await updateDoc(doc(db, "bookDetailedContent", subject), {
    papers,
  });
}

export function getUpdatedPapers(subjectData, paperId, updater) {
  return subjectData.papers.map((paper) => {
    if (paper.id !== paperId) return paper;

    return updater(paper);
  });
}
