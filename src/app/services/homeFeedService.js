import { db } from "../firebase";

import { collection, doc, setDoc, deleteDoc } from "firebase/firestore";

/**
 * Home Feed-এ একটি পোস্ট যোগ/আপডেট
 */
export async function saveHomeFeedPost(post) {
  await setDoc(
    doc(db, "homeFeed", String(post.id)),
    {
      ...post,
      updatedAt: Date.now(),
    },
    { merge: true },
  );
}

/**
 * Home Feed থেকে পোস্ট ডিলিট
 */
export async function deleteHomeFeedPost(postId) {
  await deleteDoc(doc(db, "homeFeed", String(postId)));
}
