"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "./firebase";

const PostsContext = createContext(null);

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("id", "desc"));
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
    await addDoc(collection(db, "posts"), newPost);
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
