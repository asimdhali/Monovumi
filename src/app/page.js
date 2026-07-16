"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  MoreHorizontal,
  Heart,
  MessageCircle,
  Share2,
  LayoutGrid,
  BookText,
  Calculator,
  FlaskConical,
  Languages,
  HeartHandshake,
  Landmark,
} from "lucide-react";

import {
  posts as initialPosts,
  subjects,
  postTypes,
  moralQuotes,
} from "./data";

import { useAuth } from "./AuthContext";
import { usePosts } from "./PostsContext";

const subjectIcons = {
  সব: LayoutGrid,
  বাংলা: BookText,
  গণিত: Calculator,
  বিজ্ঞান: FlaskConical,
  ইংরেজি: Languages,
  "নৈতিক শিক্ষা": HeartHandshake,
  ইতিহাস: Landmark,
};

function PostCard({ post }) {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const textRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    if (el) setIsOverflowing(el.scrollHeight > el.clientHeight);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-xl border border-[#E3DDD0] p-5 hover:shadow-md hover:shadow-[#23291F]/5 transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#EDE8DB] flex-shrink-0 ring-1 ring-[#E3DDD0]">
            <Image
              src={post.avatar}
              alt={post.name}
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <p className="font-semibold text-[#23291F] text-sm flex items-center gap-1">
              {post.name}
              {post.verified && <span className="text-xs">👑</span>}
            </p>
            <p className="text-xs text-[#9c9686]">
              {post.date} · {post.subject}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-lg" title={post.type}>
            {postTypes[post.type] || "📌"}
          </span>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-full hover:bg-[#F1EEE4] transition-colors"
              aria-label="আরও অপশন"
            >
              <MoreHorizontal className="w-5 h-5 text-[#9c9686]" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-[#E3DDD0] py-1 z-10">
                <button className="w-full text-left px-4 py-2 text-sm text-[#5b5647] hover:bg-[#F7F5F0]">
                  রিপোর্ট করুন
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-[#5b5647] hover:bg-[#F7F5F0]">
                  সংরক্ষণ করুন
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-[#5b5647] hover:bg-[#F7F5F0]">
                  কপি লিংক
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-[#F7F5F0]">
                  লুকিয়ে রাখুন
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <p
        ref={textRef}
        className={`text-[#5b5647] text-sm leading-relaxed ${expanded ? "" : "line-clamp-2"}`}
      >
        {post.content}
      </p>

      {isOverflowing && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-1 text-xs font-medium text-[#3B6255] hover:underline"
        >
          {expanded ? "কম দেখুন" : "আরও দেখুন"}
        </button>
      )}

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#EFEBE0]">
        <button
          onClick={() => setLiked(!liked)}
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
            liked ? "text-red-500" : "text-[#9c9686] hover:text-red-500"
          }`}
        >
          <Heart className="w-4 h-4" fill={liked ? "currentColor" : "none"} />
          {post.likes + (liked ? 1 : 0)}
        </button>
        <button className="flex items-center gap-1.5 text-sm font-medium text-[#9c9686] hover:text-[#3B6255] transition-colors">
          <MessageCircle className="w-4 h-4" />
          মন্তব্য
        </button>
        <button className="flex items-center gap-1.5 text-sm font-medium text-[#9c9686] hover:text-[#C9A227] transition-colors">
          <Share2 className="w-4 h-4" />
          শেয়ার
        </button>
      </div>
    </div>
  );
}

function NewPostModal({ onClose, onSubmit }) {
  const [subject, setSubject] = useState(subjects[0]);
  const [type, setType] = useState(Object.keys(postTypes)[0]);
  const [content, setContent] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (content.trim().length < 5) {
      alert("লেখাটা একটু বড় করে লিখুন");
      return;
    }
    onSubmit({ subject, type, content: content.trim() });
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <h3 className="font-[family-name:var(--font-bengali-serif)] text-lg text-[#23291F] mb-4">
          নতুন পোস্ট লিখুন
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[#5b5647] block mb-1">
              বিষয়
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-[#E3DDD0] text-sm"
            >
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-[#5b5647] block mb-1">
              ধরন
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-[#E3DDD0] text-sm"
            >
              {Object.keys(postTypes).map((t) => (
                <option key={t} value={t}>
                  {postTypes[t]} {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-[#5b5647] block mb-1">
              লেখা
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              placeholder="এখানে আপনার নোট, ট্রিক বা পরামর্শ লিখুন..."
              className="w-full p-2.5 rounded-lg border border-[#E3DDD0] text-sm resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-full text-sm font-medium border border-[#E3DDD0] text-[#5b5647]"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-full text-sm font-semibold text-white bg-[#3B6255] hover:bg-[#2c4a40]"
            >
              পোস্ট করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Home() {
  const { teacherVerified } = useAuth();
  const { posts, addPost } = usePosts();
  const [activeSubject, setActiveSubject] = useState("সব");
  const [showForm, setShowForm] = useState(false);

  const filteredPosts = posts.filter(
    (post) => activeSubject === "সব" || post.subject === activeSubject,
  );

  const subjectCounts = subjects.map((s) => ({
    subject: s,
    count: posts.filter((p) => p.subject === s).length,
  }));

  return (
    <div className="min-h-screen font-[family-name:var(--font-bengali-sans)] px-6 pb-16">
      {/* হিরো সেকশন */}
      <section className="max-w-3xl mx-auto text-center pt-14 pb-10">
        <p className="text-xs tracking-[0.3em] uppercase text-[#3B6255]/70 mb-3">
          মনোভূমি — নৈতিক শিক্ষা ও জ্ঞানের ঠিকানা
        </p>
        <h1 className="font-[family-name:var(--font-bengali-serif)] text-3xl md:text-4xl text-[#23291F] leading-snug">
          আজ কী নিয়ে ভাবছেন?
        </h1>
        <svg
          className="mx-auto mt-2"
          width="120"
          height="10"
          viewBox="0 0 120 10"
          fill="none"
        >
          <path
            d="M2 7C20 2 40 2 60 5C80 8 100 8 118 3"
            stroke="#C9A227"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <p className="mt-4 text-sm md:text-base text-[#5b5647] max-w-xl mx-auto">
          শিক্ষকদের হাত ধরে, বাংলাদেশীদের নৈতিক শিক্ষা, দক্ষতা ও জ্ঞান-বিজ্ঞান
          অর্জনের ফ্রি প্ল্যাটফর্ম।
        </p>
      </section>

      {/* মূল কনটেন্ট: বাম সাইডবার + ফিড + ডান সাইডবার */}
      <div className="max-w-6xl mx-auto lg:grid lg:grid-cols-[200px_1fr_280px] lg:gap-6 lg:items-start">
        {/* বাম সাইডবার — বিষয় */}
        <aside className="hidden lg:block sticky top-24">
          <div className="bg-white rounded-xl border border-[#E3DDD0] p-4">
            <h3 className="font-[family-name:var(--font-bengali-serif)] text-base text-[#23291F] mb-3 px-1">
              বিষয়
            </h3>
            <nav className="space-y-1">
              {["সব", ...subjects].map((s) => {
                const Icon = subjectIcons[s] || LayoutGrid;
                return (
                  <button
                    key={s}
                    onClick={() => setActiveSubject(s)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeSubject === s
                        ? "bg-[#3B6255] text-white"
                        : "text-[#5b5647] hover:bg-[#F1EEE4]"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {s}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* মূল ফিড */}
        <div className="max-w-xl mx-auto lg:mx-0 w-full">
          {/* মোবাইলে বিষয় ফিল্টার (হরাইজন্টাল) */}
          <div className="flex lg:hidden flex-wrap gap-2 mb-6">
            {["সব", ...subjects].map((s) => (
              <button
                key={s}
                onClick={() => setActiveSubject(s)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  activeSubject === s
                    ? "bg-[#3B6255] text-white border-[#3B6255]"
                    : "bg-white text-[#5b5647] border-[#E3DDD0]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* উক্তি সেকশন */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {moralQuotes.slice(0, 2).map((q, i) => (
              <blockquote
                key={i}
                className="relative bg-white rounded-xl border-l-[3px] border-[#C9A227] border-t border-r border-b border-[#E3DDD0] p-6 text-center"
              >
                <span className="font-[family-name:var(--font-bengali-serif)] absolute top-2 left-4 text-4xl text-[#C9A227]/30 select-none">
                  “
                </span>
                <p className="font-[family-name:var(--font-bengali-serif)] text-sm md:text-base text-[#3a382f] leading-relaxed relative z-10">
                  {q.text}
                </p>
                <footer className="mt-3 text-xs font-medium text-[#3B6255]">
                  — {q.author}
                </footer>
              </blockquote>
            ))}
          </div>

          {/* পোস্ট তালিকা */}
          {teacherVerified && (
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-1.5 bg-[#3B6255] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#2c4a40] transition-colors"
              >
                <span className="text-base leading-none">+</span> নতুন পোস্ট
              </button>
            </div>
          )}

          <div className="space-y-5">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <p className="text-center text-[#9c9686] text-sm py-8">
                এই বিষয়ে কোনো পোস্ট পাওয়া যায়নি।
              </p>
            )}
          </div>
        </div>

        {/* ডান সাইডবার */}
        <aside className="hidden lg:block sticky top-24 space-y-5">
          <div className="bg-white rounded-xl border border-[#E3DDD0] p-5">
            <h3 className="font-[family-name:var(--font-bengali-serif)] text-lg text-[#23291F] mb-3">
              বিষয়ভিত্তিক পোস্ট
            </h3>
            <div className="flex flex-wrap gap-2">
              {subjectCounts.map(({ subject, count }) => (
                <button
                  key={subject}
                  onClick={() => setActiveSubject(subject)}
                  className="text-xs bg-[#EDF2EE] text-[#3B6255] px-2.5 py-1 rounded-full hover:bg-[#3B6255] hover:text-white transition-colors"
                >
                  {subject} <span className="opacity-60">({count})</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#3B6255] rounded-xl p-5 text-white">
            <h3 className="font-[family-name:var(--font-bengali-serif)] text-lg mb-2">
              মনোভূমি সম্পর্কে
            </h3>
            <p className="text-sm text-white/80 leading-relaxed">
              শুধুমাত্র যাচাইকৃত শিক্ষকদের পোস্ট, নোট ও প্রশ্নোত্তর —
              নির্ভরযোগ্য শিক্ষার নিশ্চয়তায়।
            </p>
          </div>
        </aside>
      </div>

      <footer className="mt-16 text-center text-[#9c9686] text-sm">
        © ২০২৬ মনোভূমি। সর্বস্বত্ব সংরক্ষিত।
      </footer>

      {showForm && (
        <NewPostModal
          onClose={() => setShowForm(false)}
          onSubmit={({ subject, type, content }) => {
            addPost({
              id: Date.now(),
              name: "আপনি",
              date: "আজ",
              avatar: "https://i.pravatar.cc/150?img=13",
              type,
              subject,
              verified: true,
              content,
              likes: 0,
            });
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}
