"use client";

import { useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { posts as initialPosts } from "../data";

export default function SeedPostsPage() {
  const [status, setStatus] = useState("");

  async function handleSeed() {
    setStatus("চেক করা হচ্ছে...");
    const snapshot = await getDocs(collection(db, "posts"));
    if (!snapshot.empty) {
      setStatus("⚠️ posts কালেকশনে ইতিমধ্যে ডেটা আছে, সিডিং বাতিল করা হলো।");
      return;
    }
    setStatus("আপলোড হচ্ছে...");
    for (const post of initialPosts) {
      await addDoc(collection(db, "posts"), post);
      setStatus((prev) => prev + `\n✅ "${post.name}"-এর পোস্ট আপলোড হয়েছে`);
    }
    setStatus((prev) => prev + "\n\n🎉 সব পোস্ট সফলভাবে আপলোড হয়েছে!");
  }

  return (
    <div className="max-w-xl mx-auto px-6 pt-10">
      <h1 className="text-xl font-bold mb-4">Posts সিডিং</h1>
      <button
        onClick={handleSeed}
        className="px-5 py-2.5 rounded-full bg-[#3B6255] text-white text-sm font-semibold"
      >
        ডেটা আপলোড করো
      </button>
      <pre className="mt-4 text-sm whitespace-pre-wrap">{status}</pre>
    </div>
  );
}
