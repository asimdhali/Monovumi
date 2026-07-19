"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { MoreHorizontal, Heart, MessageCircle, Share2 } from "lucide-react";

import { subjects, postTypes } from "./data";
import { useAuth } from "./AuthContext";
import { usePosts } from "./PostsContext";

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

  return (
    <div className="min-h-screen font-[family-name:var(--font-bengali-sans)] px-4 pb-16">
      {/* মূল ফিড */}
      <div className="max-w-xl mx-auto">
        <div className="space-y-1.5">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <p className="text-center text-[var(--color-app-muted)] text-sm py-8">
              এই বিষয়ে কোনো পোস্ট পাওয়া যায়নি।
            </p>
          )}
        </div>
      </div>

      <footer className="mt-16 text-center text-[var(--color-app-muted)] text-sm">
        © ২০২৬ মনোভূমি। সর্বস্বত্ব সংরক্ষিত।
      </footer>
    </div>
  );
}
