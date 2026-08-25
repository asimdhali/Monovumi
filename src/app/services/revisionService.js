import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

// =========================================================
// Revision যোগ করা
// =========================================================

export async function addRevision(userId, post) {
  if (!userId || !post) return;

  // একই পোস্ট আগে থেকেই Revision-এ আছে কি না
  const q = query(
    collection(db, "revisions"),
    where("userId", "==", userId),
    where("postId", "==", post.id),
  );

  const snapshot = await getDocs(q);

  // আগে থেকেই থাকলে আবার যোগ করবে না
  if (!snapshot.empty) {
    return;
  }

  await addDoc(collection(db, "revisions"), {
    userId,

    postId: post.id,
    title: post.title || "",
    content: post.content || "",

    subject: post.subject || "",
    paperId: post.paperId || "",
    paperTitle: post.paperTitle || "",
    era: post.era || "",
    chapter: post.chapter || "",

    image: post.image || "",
    href: post.href || "",

    contributor: post.contributor || post.name || "",
    contributorAvatar: post.contributorAvatar || post.avatar || "",

    createdAt: serverTimestamp(),
  });
}

// =========================================================
// User-এর Revision তালিকা
// =========================================================

export async function getUserRevisions(userId) {
  if (!userId) return [];

  const q = query(
    collection(db, "revisions"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    docId: docSnap.id,
    ...docSnap.data(),
  }));
}

// =========================================================
// Revision মুছে ফেলা
// =========================================================

export async function removeRevision(revisionId) {
  if (!revisionId) return;

  await deleteDoc(doc(db, "revisions", revisionId));
}
