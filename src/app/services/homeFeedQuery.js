import { db } from "../firebase";

import {
  collection,
  getDocs,
  limit,
  orderBy,
  onSnapshot,
  query,
  startAfter,
} from "firebase/firestore";

export async function getInitialHomeFeed() {
  const q = query(
    collection(db, "homeFeed"),
    orderBy("activityTime", "desc"),
    limit(10),
  );

  const snapshot = await getDocs(q);

  return {
    posts: snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })),
    lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
  };
}

export async function getNextHomeFeed(lastDoc) {
  if (!lastDoc) {
    return {
      posts: [],
      lastDoc: null,
    };
  }

  const q = query(
    collection(db, "homeFeed"),
    orderBy("activityTime", "desc"),
    startAfter(lastDoc),
    limit(10),
  );

  const snapshot = await getDocs(q);

  return {
    posts: snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })),
    lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
  };
}

export function subscribeHomeFeed(callback) {
  const q = query(
    collection(db, "homeFeed"),
    orderBy("activityTime", "desc"),
    limit(10),
  );

  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
    );
  });
}
