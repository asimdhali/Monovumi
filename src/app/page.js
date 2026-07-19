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

import { subjects, postTypes } from "./data";
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
  const [followed, setFollowed] = useState(false);
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
    <div className="bg-[var(--color-app-surface)] rounded-2xl border border-[var(--color-app-border)] p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-2.5">
          <div className="relative flex-shrink-0">
            <div
              className="relative w-[46px] h-[46px] rounded-full overflow-hidden bg-[var(--color-app-border)]"
              style={{ boxShadow: "0 0 0 2px var(--color-app-accent)" }}
            >
              <Image
                src={post.avatar}
                alt={post.name}
                width={46}
                height={46}
                className="object-cover w-full h-full"
              />
            </div>
            {post.verified && (
              <span
                className="absolute -bottom-0.5 -left-0.5 w-[17px] h-[17px] rounded-full flex items-center justify-center text-[10px]"
                style={{
                  background: "var(--color-app-accent)",
                  border: "2px solid var(--color-app-surface)",
                }}
              >
                ✓
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[14.5px] font-bold text-[var(--color-app-text)]">
                {post.name}
              </span>
              <button
                onClick={() => setFollowed(!followed)}
                className="text-[12.5px] font-bold"
                style={{ color: "var(--color-app-primary)" }}
              >
                {followed ? "✓ ফলো করছেন" : "· ফলো"}
              </button>
              <span
                className="text-xs font-semibold"
                style={{ color: "var(--color-app-accent)" }}
              >
                {post.subject}
              </span>
            </div>
            <p className="text-xs text-[var(--color-app-muted)] mt-0.5">
              {post.date}
            </p>
          </div>
        </div>

        <div className="relative flex-shrink-0" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[var(--color-app-primary-soft)] transition-colors"
            aria-label="আরও অপশন"
          >
            <MoreHorizontal className="w-5 h-5 text-[var(--color-app-muted)]" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-1 w-40 bg-[var(--color-app-surface)] rounded-lg shadow-lg border border-[var(--color-app-border)] py-1 z-10">
              <button className="w-full text-left px-4 py-2 text-sm text-[var(--color-app-text)] hover:bg-[var(--color-app-primary-soft)]">
                রিপোর্ট করুন
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-[var(--color-app-text)] hover:bg-[var(--color-app-primary-soft)]">
                সংরক্ষণ করুন
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-[var(--color-app-text)] hover:bg-[var(--color-app-primary-soft)]">
                কপি লিংক
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[var(--color-app-primary-soft)]">
                লুকিয়ে রাখুন
              </button>
            </div>
          )}
        </div>
      </div>

      <p
        ref={textRef}
        className={`text-[14px] leading-relaxed text-[var(--color-app-text)] mb-1 ${expanded ? "" : "line-clamp-3"}`}
      >
        {post.content}
      </p>

      {isOverflowing && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mb-2.5 text-[13px] font-bold block"
          style={{ color: "var(--color-app-accent)" }}
        >
          {expanded ? "কম দেখুন" : "আরও দেখুন"}
        </button>
      )}

      {post.image && (
        <img
          src={post.image}
          alt="পোস্ট ছবি"
          className="w-full rounded-xl mb-3 max-h-[280px] object-cover"
        />
      )}

      <div className="flex items-center justify-between pt-3 border-t border-[var(--color-app-border)]">
        <button
          onClick={() => setLiked(!liked)}
          className="flex items-center gap-1.5 text-sm font-medium transition-colors"
          style={{ color: liked ? "#e0637a" : "var(--color-app-muted)" }}
        >
          <Heart
            className="w-[17px] h-[17px]"
            fill={liked ? "currentColor" : "none"}
          />
          {post.likes + (liked ? 1 : 0)}
        </button>
        <button className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-app-muted)] hover:text-[var(--color-app-primary)] transition-colors">
          <MessageCircle className="w-[17px] h-[17px]" />
          মন্তব্য
        </button>
        <button className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-app-muted)] hover:text-[var(--color-app-accent)] transition-colors">
          <Share2 className="w-[17px] h-[17px]" />
          শেয়ার
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const { teacherVerified } = useAuth();
  const { posts } = usePosts();
  const [activeSubject, setActiveSubject] = useState("সব");

  const filteredPosts = posts.filter(
    (post) => activeSubject === "সব" || post.subject === activeSubject,
  );

  const subjectCounts = subjects.map((s) => ({
    subject: s,
    count: posts.filter((p) => p.subject === s).length,
  }));

  return (
    <div className="min-h-screen font-[family-name:var(--font-bengali-sans)] px-6 pb-16">
      {/* মূল কনটেন্ট: বাম সাইডবার + ফিড + ডান সাইডবার */}
      <div className="max-w-6xl mx-auto lg:grid lg:grid-cols-[200px_1fr_280px] lg:gap-6 lg:items-start">
        {/* বাম সাইডবার — বিষয় */}
        <aside className="hidden lg:block sticky top-24">
          <div className="bg-[var(--color-app-surface)] rounded-xl border border-[var(--color-app-border)] p-4">
            <h3 className="font-[family-name:var(--font-bengali-serif)] text-base text-[var(--color-app-text)] mb-3 px-1">
              বিষয়
            </h3>
            <nav className="space-y-1">
              {["সব", ...subjects].map((s) => {
                const Icon = subjectIcons[s] || LayoutGrid;
                return (
                  <button
                    key={s}
                    onClick={() => setActiveSubject(s)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      background:
                        activeSubject === s
                          ? "var(--color-app-primary)"
                          : "transparent",
                      color:
                        activeSubject === s
                          ? "white"
                          : "var(--color-app-muted)",
                    }}
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
                className="px-4 py-1.5 rounded-full text-sm font-medium border transition-colors"
                style={{
                  background:
                    activeSubject === s
                      ? "var(--color-app-primary)"
                      : "var(--color-app-surface)",
                  color:
                    activeSubject === s ? "white" : "var(--color-app-muted)",
                  borderColor:
                    activeSubject === s
                      ? "var(--color-app-primary)"
                      : "var(--color-app-border)",
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* পোস্ট তালিকা */}
          <div className="space-y-3.5">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <p className="text-center text-[var(--color-app-muted)] text-sm py-8">
                এই বিষয়ে কোনো পোস্ট পাওয়া যায়নি।
              </p>
            )}
          </div>
        </div>

        {/* ডান সাইডবার */}
        <aside className="hidden lg:block sticky top-24 space-y-5">
          <div className="bg-[var(--color-app-surface)] rounded-xl border border-[var(--color-app-border)] p-5">
            <h3 className="font-[family-name:var(--font-bengali-serif)] text-lg text-[var(--color-app-text)] mb-3">
              বিষয়ভিত্তিক পোস্ট
            </h3>
            <div className="flex flex-wrap gap-2">
              {subjectCounts.map(({ subject, count }) => (
                <button
                  key={subject}
                  onClick={() => setActiveSubject(subject)}
                  className="text-xs px-2.5 py-1 rounded-full transition-colors"
                  style={{
                    background: "var(--color-app-primary-soft)",
                    color: "var(--color-app-primary)",
                  }}
                >
                  {subject} <span className="opacity-60">({count})</span>
                </button>
              ))}
            </div>
          </div>

          <div
            className="rounded-xl p-5 text-white"
            style={{ background: "var(--color-app-primary)" }}
          >
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

      <footer className="mt-16 text-center text-[var(--color-app-muted)] text-sm">
        © ২০২৬ মনোভূমি। সর্বস্বত্ব সংরক্ষিত।
      </footer>
    </div>
  );
}
