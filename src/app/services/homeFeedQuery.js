import { db } from "../firebase";

import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";

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
