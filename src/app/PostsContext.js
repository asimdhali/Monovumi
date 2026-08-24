"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { createAdminNotification } from "./services/notificationService";
const PostsContext = createContext(null);

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      where("published", "==", true),
      orderBy("id", "desc"),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedPosts = snapshot.docs.map((d) => ({
        docId: d.id,
        ...d.data(),
      }));
      setPosts(loadedPosts);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function addPost(newPost) {
    const postRef = await addDoc(collection(db, "posts"), {
      ...newPost,

      // Admin review না করা পর্যন্ত Public হবে না
      published: false,

      // Admin review-এর জন্য
      reviewStatus: "pending",

      createdAt: newPost.createdAt || Date.now(),
      updatedAt: Date.now(),
    });

    // পোস্ট সফলভাবে তৈরি হওয়ার পর Admin-কে Notification
    try {
      await createAdminNotification({
        type: "new_post",
        title: "নতুন পোস্ট এসেছে",
        message: `${newPost.name || newPost.contributor || "একজন ব্যবহারকারী"} নতুন একটি পোস্ট করেছেন${
          newPost.title ? `: ${newPost.title}` : "।"
        }`,
        link: `/`,
      });
    } catch (notificationError) {
      // Notification ব্যর্থ হলেও পোস্ট সফল থাকবে
      console.error("Admin post notification error:", notificationError);
    }

    return postRef.id;
  }

  return (
    <PostsContext.Provider value={{ posts, addPost, loading }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  return useContext(PostsContext);
}
