import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

/*
 * নতুন Notification তৈরি
 */
export async function createNotification({
  userId,
  type = "general",
  title,
  message,
  link = "",
}) {
  if (!userId || !title || !message) {
    return;
  }

  await addDoc(collection(db, "notifications"), {
    userId,
    type,
    title,
    message,
    link,
    read: false,
    createdAt: serverTimestamp(),
  });
}

/*
 * নির্দিষ্ট User-এর Notification শোনা
 */
export function subscribeToNotifications(userId, callback) {
  if (!userId) {
    callback([]);
    return () => {};
  }

  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    callback(notifications);
  });
}

/*
 * Notification পড়া হয়েছে হিসেবে চিহ্নিত
 */
export async function markNotificationAsRead(notificationId) {
  if (!notificationId) return;

  await updateDoc(doc(db, "notifications", notificationId), {
    read: true,
  });
}

/*
 * সব Notification পড়া হয়েছে হিসেবে চিহ্নিত
 */
export async function markAllNotificationsAsRead(userId) {
  if (!userId) return;

  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId),
  );

  const unsubscribe = onSnapshot(q, async (snapshot) => {
    const updates = snapshot.docs
      .filter((docSnap) => docSnap.data().read !== true)
      .map((docSnap) =>
        updateDoc(doc(db, "notifications", docSnap.id), {
          read: true,
        }),
      );

    await Promise.all(updates);
    unsubscribe();
  });
}
