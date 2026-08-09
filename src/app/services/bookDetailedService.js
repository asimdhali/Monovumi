import {
  collection,
  doc,
  updateDoc,
  onSnapshot,
  setDoc,
  deleteDoc,
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

export async function createSubject(subject, icon = "📚", order = 999) {
  await setDoc(doc(db, "bookDetailedContent", subject), {
    icon,
    order,
    papers: [],
  });
}

export async function updateSubjectIcon(subject, icon) {
  await updateDoc(doc(db, "bookDetailedContent", subject), {
    icon,
  });
}

export async function deleteSubject(subject) {
  await deleteDoc(doc(db, "bookDetailedContent", subject));
}

/* বিষয় Rename */
export async function renameSubject(oldName, newName) {
  const oldRef = doc(db, "bookDetailedContent", oldName);
  const newRef = doc(db, "bookDetailedContent", newName);

  const snapshot = await import("firebase/firestore").then(({ getDoc }) =>
    getDoc(oldRef),
  );

  if (!snapshot.exists()) {
    throw new Error("পুরোনো বিষয় পাওয়া যায়নি।");
  }

  await setDoc(newRef, snapshot.data());
  await deleteDoc(oldRef);
}

export function getUpdatedPapers(subjectData, paperId, updater) {
  return subjectData.papers.map((paper) => {
    if (paper.id !== paperId) return paper;

    return updater(paper);
  });
}
