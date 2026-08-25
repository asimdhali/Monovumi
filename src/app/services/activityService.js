import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../firebase";

/*
 * =========================================================
 * নতুন Activity Log তৈরি
 * =========================================================
 */
export async function createActivity({
  type = "general",

  actorId = "",
  actorName = "",
  actorEmail = "",
  actorPhotoURL = "",

  targetType = "",
  targetId = "",

  subject = "",
  paperId = "",

  title = "",

  metadata = {},
}) {
  if (!type) return;

  await addDoc(collection(db, "activities"), {
    type,

    actorId,
    actorName,
    actorEmail,
    actorPhotoURL,

    targetType,
    targetId,

    subject,
    paperId,

    title,

    metadata,

    createdAt: serverTimestamp(),
  });
}

/*
 * =========================================================
 * সব Activity Real-time শোনা
 * =========================================================
 */
export function subscribeToActivities(callback, maxItems = 100) {
  const q = query(
    collection(db, "activities"),
    orderBy("createdAt", "desc"),
    limit(maxItems),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const activities = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      callback(activities);
    },
    (error) => {
      console.error("Activity load করতে সমস্যা:", error);

      callback([]);
    },
  );
}
