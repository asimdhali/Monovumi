/*"use client";

import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { bookDetailedContent } from "../data";

export default function SeedPage() {
  const [status, setStatus] = useState("");

  async function handleSeed() {
    setStatus("আপলোড হচ্ছে...");
    try {
      const subjects = Object.keys(bookDetailedContent);
      for (const subject of subjects) {
        await setDoc(
          doc(db, "bookDetailedContent", subject),
          bookDetailedContent[subject],
        );
        setStatus((prev) => prev + `\n✅ ${subject} আপলোড হয়েছে`);
      }
      setStatus((prev) => prev + "\n\n🎉 সব ডেটা সফলভাবে আপলোড হয়েছে!");
    } catch (err) {
      setStatus("❌ এরর: " + err.message);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-6 pt-10">
      <h1 className="text-xl font-bold mb-4">Firestore সিডিং</h1>
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
*/
