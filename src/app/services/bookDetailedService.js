import {
  collection,
  doc,
  updateDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";

import { db } from "../firebase";

export function subscribeToSubject(subject, callback) {
  return onSnapshot(doc(db, "bookDetailedContent", subject), (snap) => {
    if (snap.exists()) {
      callback(snap.data());
    }
  });
}

export function subscribeToAllSubjects(callback) {
  return onSnapshot(collection(db, "bookDetailedContent"), (snapshot) => {
    const data = {};

    snapshot.docs.forEach((docSnap) => {
      data[docSnap.id] = docSnap.data();
    });

    callback(data);
  });
}

export async function savePapers(subject, papers) {
  await updateDoc(doc(db, "bookDetailedContent", subject), {
    papers,
  });
}

export async function createSubject(subject, icon = "📚") {
  await setDoc(doc(db, "bookDetailedContent", subject), {
    icon,
    papers: [
      {
        id: "general",
        title: "সাধারণ",
        topics: [],
      },
    ],
  });
}

export function getUpdatedPapers(subjectData, paperId, updater) {
  return subjectData.papers.map((paper) => {
    if (paper.id !== paperId) return paper;

    return updater(paper);
  });
}
