"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  forwardRef,
  Suspense,
} from "react";
import Link from "next/link";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  MoreHorizontal,
  BookMarked,
  Share2,
  Copy,
  MessageCircle,
  Send,
  Facebook,
  X,
} from "lucide-react";
import { doc, deleteDoc } from "firebase/firestore";

import { db } from "./firebase";
import { addRevision, getRevisionPostIds } from "./services/revisionService";

import { subjects, postTypes } from "./data";
import { useAuth } from "./AuthContext";
import ComposerModal from "./books/components/ComposerModal";
import { useBookDetailed } from "./BookDetailedContext";
import { usePosts } from "./PostsContext";
import { buildHomeFeed } from "./services/homeFeedHelper";
import {
  getInitialHomeFeed,
  getNextHomeFeed,
  subscribeHomeFeed,
} from "./services/homeFeedQuery";
import HomeFeedSkeleton from "./components/HomeFeedSkeleton";

function formatBanglaDate(timestamp) {
  if (!timestamp) return "";

  return new Date(timestamp).toLocaleString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function ShareModal({ post, onClose, onCopySuccess }) {
  if (!post) return null;

  const postUrl =
    post.href ||
    `/books/${encodeURIComponent(post.subject)}/${post.paperId}/${post.id}`;

  const fullUrl =
    typeof window !== "undefined" ? `${window.location.origin}${postUrl}` : "";

  const shareText = post.title || "মনোভূমির একটি পোস্ট";

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(fullUrl);

      onCopySuccess?.();
      onClose();
    } catch (error) {
      console.error("Copy link error:", error);
      alert("লিংক কপি করা যায়নি।");
    }
  }

  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareText,
          text: shareText,
          url: fullUrl,
        });

        onClose();
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Share error:", error);
        }
      }
    } else {
      await copyLink();
    }
  }

  function shareTo(url) {
    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[200]" onClick={onClose}>
      <div
        className="
          absolute
          right-4
          bottom-20
          w-[300px]
          max-w-[calc(100vw-32px)]
          rounded-2xl
          border
          border-[var(--color-app-border)]
          bg-[var(--color-app-surface)]
          shadow-2xl
          p-3
          animate-in
          fade-in
          zoom-in-95
          duration-150
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-2 pb-2">
          <h3 className="text-sm font-bold text-[var(--color-app-text)]">
            শেয়ার করুন
          </h3>

          <button
            onClick={onClose}
            className="
              w-7
              h-7
              rounded-full
              flex
              items-center
              justify-center
              text-[var(--color-app-muted)]
              hover:bg-[var(--color-app-primary-soft)]
              transition
            "
            aria-label="বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Share options */}
        <div className="grid grid-cols-2 gap-2">
          {/* Messenger */}
          <button
            onClick={() =>
              shareTo(
                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  fullUrl,
                )}`,
              )
            }
            className="
              flex
              items-center
              gap-2.5
              p-2.5
              rounded-xl
              hover:bg-[var(--color-app-primary-soft)]
              transition
              text-left
            "
          >
            <span className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-base">
              💬
            </span>

            <span className="text-xs font-medium text-[var(--color-app-text)]">
              Messenger
            </span>
          </button>

          {/* WhatsApp */}
          <button
            onClick={() =>
              shareTo(
                `https://wa.me/?text=${encodeURIComponent(
                  `${shareText}\n${fullUrl}`,
                )}`,
              )
            }
            className="
              flex
              items-center
              gap-2.5
              p-2.5
              rounded-xl
              hover:bg-[var(--color-app-primary-soft)]
              transition
              text-left
            "
          >
            <span className="w-9 h-9 shrink-0 rounded-full bg-emerald-500 flex items-center justify-center text-white text-base">
              🟢
            </span>

            <span className="text-xs font-medium text-[var(--color-app-text)]">
              WhatsApp
            </span>
          </button>

          {/* Facebook */}
          <button
            onClick={() =>
              shareTo(
                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  fullUrl,
                )}`,
              )
            }
            className="
              flex
              items-center
              gap-2.5
              p-2.5
              rounded-xl
              hover:bg-[var(--color-app-primary-soft)]
              transition
              text-left
            "
          >
            <span className="w-9 h-9 shrink-0 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
              f
            </span>

            <span className="text-xs font-medium text-[var(--color-app-text)]">
              Facebook
            </span>
          </button>

          {/* Copy link */}
          <button
            onClick={copyLink}
            className="
              flex
              items-center
              gap-2.5
              p-2.5
              rounded-xl
              hover:bg-[var(--color-app-primary-soft)]
              transition
              text-left
            "
          >
            <span className="w-9 h-9 shrink-0 rounded-full bg-[var(--color-app-primary-soft)] flex items-center justify-center">
              <Copy className="w-4 h-4 text-[var(--color-app-primary)]" />
            </span>

            <span className="text-xs font-medium text-[var(--color-app-text)]">
              লিংক কপি করুন
            </span>
          </button>
        </div>

        {/* Other apps */}
        <button
          onClick={nativeShare}
          className="
            w-full
            flex
            items-center
            gap-2.5
            mt-1
            p-2.5
            rounded-xl
            hover:bg-[var(--color-app-primary-soft)]
            transition
            text-left
          "
        >
          <span className="w-9 h-9 shrink-0 rounded-full bg-[var(--color-app-primary-soft)] flex items-center justify-center">
            <Share2 className="w-4 h-4 text-[var(--color-app-primary)]" />
          </span>

          <span className="text-xs font-medium text-[var(--color-app-text)]">
            অন্যান্য অ্যাপে শেয়ার করুন
          </span>
        </button>
      </div>
    </div>
  );
}

const PostCard = forwardRef(function PostCard(
  { post, onEdit, onDelete, onCopyLink, onShare, isRevised, onRevisionAdded },
  ref,
) {
  const { user, approved, role } = useAuth();
  const canManagePost =
    approved === true && (role === "admin" || role === "teacher");
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
    <div
      ref={ref}
      className="bg-[var(--color-app-surface)] rounded-2xl border border-[var(--color-app-border)] p-4"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-2.5">
          <div className="relative flex-shrink-0">
            <div
              className="relative w-[46px] h-[46px] rounded-full overflow-hidden bg-[var(--color-app-border)]"
              style={{ boxShadow: "0 0 0 2px var(--color-app-accent)" }}
            >
              {(
                post.avatar && !post.avatar.includes("i.pravatar.cc")
                  ? post.avatar
                  : post.contributorAvatar &&
                      !post.contributorAvatar.includes("i.pravatar.cc")
                    ? post.contributorAvatar
                    : null
              ) ? (
                <Image
                  src={
                    post.avatar && !post.avatar.includes("i.pravatar.cc")
                      ? post.avatar
                      : post.contributorAvatar
                  }
                  alt={post.name || post.contributor || "প্রোফাইল"}
                  width={46}
                  height={46}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-[var(--color-app-border)]" />
              )}
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
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="text-[14.5px] font-bold text-[var(--color-app-text)]">
                {post.name || post.contributor || "অজ্ঞাত"}
              </span>

              {post.activityType === "new" && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400">
                  নতুন
                </span>
              )}

              {post.activityType === "major" && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/15 text-sky-400">
                  আপডেট
                </span>
              )}

              {post.activityType === "minor" && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300">
                  📝 ছোট আপডেট
                </span>
              )}

              <span className="text-[11px] text-[var(--color-app-muted)]">
                • {formatBanglaDate(post.activityTime)}
              </span>
            </div>
            {post.paperTitle && (
              <div className="flex items-center gap-1 mt-1 text-[12px] text-[var(--color-app-muted)]">
                <span>📖</span>
                <span>
                  {post.subject} &gt; {post.paperTitle} &gt; {post.era}
                </span>
              </div>
            )}
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
            <div className="absolute right-0 mt-1 w-44 rounded-xl overflow-hidden border border-[var(--color-app-border)] bg-[var(--color-app-surface)] shadow-xl z-20">
              <button
                disabled={!canManagePost}
                onClick={() => {
                  if (!canManagePost) return;

                  setMenuOpen(false);
                  onEdit(post);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition ${
                  canManagePost
                    ? "hover:bg-[var(--color-app-primary-soft)]"
                    : "opacity-40 cursor-not-allowed"
                }`}
              >
                ✏️
                <span>Edit</span>
              </button>

              <button
                disabled={!canManagePost}
                onClick={() => {
                  if (!canManagePost) return;

                  setMenuOpen(false);

                  const ok = window.confirm(
                    "আপনি কি নিশ্চিত যে পোস্টটি মুছে ফেলতে চান?",
                  );

                  if (ok) {
                    onDelete(post);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition ${
                  canManagePost
                    ? "text-red-400 hover:bg-red-500/10"
                    : "text-[var(--color-app-muted)] opacity-40 cursor-not-allowed"
                }`}
              >
                🗑️
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
      {post.title && (
        <Link
          href={
            post.href ||
            `/books/${encodeURIComponent(post.subject)}/${post.paperId}/${post.id}`
          }
          className="block text-lg font-bold mb-2 text-[var(--color-app-text)] hover:text-[var(--color-app-primary)] transition-colors"
        >
          {post.title}
        </Link>
      )}
      <div
        ref={textRef}
        className={`post-content text-[14px] leading-relaxed text-[var(--color-app-text)] mb-1 ${
          expanded ? "" : "line-clamp-3"
        }`}
        dangerouslySetInnerHTML={{
          __html: post.content,
        }}
      />

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
          onClick={async () => {
            if (!user?.uid) {
              alert("রিভিশনে যোগ করতে প্রথমে লগইন করুন।");
              return;
            }

            if (isRevised) {
              return;
            }

            try {
              await addRevision(user.uid, post);

              onRevisionAdded(post.id);

              alert("পোস্টটি রিভিশনে যোগ হয়েছে।");
            } catch (error) {
              console.error("Revision add error:", error);
              alert("রিভিশনে যোগ করা যায়নি।");
            }
          }}
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
            isRevised
              ? "text-emerald-500"
              : "text-[var(--color-app-muted)] hover:text-[var(--color-app-primary)]"
          }`}
        >
          <BookMarked
            className={`w-[17px] h-[17px] ${isRevised ? "fill-current" : ""}`}
          />

          {isRevised ? "রিভিশনে আছে" : "রিভিশন"}
        </button>

        <button
          onClick={() => onShare(post)}
          className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-app-muted)] hover:text-[var(--color-app-accent)] transition-colors"
        >
          <Share2 className="w-[17px] h-[17px]" />
          শেয়ার
        </button>
      </div>
    </div>
  );
});

function HomeContent() {
  const searchParams = useSearchParams();
  const postIdFromUrl = searchParams.get("post");

  const { user, teacherVerified } = useAuth();
  const { posts } = usePosts();
  const { content, addTopic, editTopic, deleteTopic, loading } =
    useBookDetailed();
  const [showComposer, setShowComposer] = useState(false);

  const [editingTopic, setEditingTopic] = useState(null);

  const [composerEra, setComposerEra] = useState("");

  const [composerChapter, setComposerChapter] = useState("");

  const [activeSubject, setActiveSubject] = useState("সব");

  const [loadingMore, setLoadingMore] = useState(false);
  const [feedPosts, setFeedPosts] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [feedLoading, setFeedLoading] = useState(true);

  const [revisionPostIds, setRevisionPostIds] = useState(new Set());
  const [sharePost, setSharePost] = useState(null);
  const [showCopyToast, setShowCopyToast] = useState(false);

  const allPosts = feedPosts;

  const filteredPosts = allPosts.filter(
    (post) => activeSubject === "সব" || post.subject === activeSubject,
  );

  const visiblePosts = filteredPosts;
  async function handleDeletePost(post) {
    try {
      await deleteDoc(doc(db, "homeFeed", post.docId));

      setFeedPosts((prev) => prev.filter((item) => item.id !== post.id));
    } catch (error) {
      console.error("HomeFeed delete error:", error);
      alert("পোস্টটি মুছে ফেলা যায়নি।");
    }
  }
  const observer = useRef();
  const postRefs = useRef({});

  const lastPostRef = useCallback(
    (node) => {
      if (feedLoading || loadingMore) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(async (entries) => {
        if (!entries[0].isIntersecting) return;

        if (!lastDoc) return;

        setLoadingMore(true);

        try {
          const result = await getNextHomeFeed(lastDoc);

          if (result.posts.length > 0) {
            setFeedPosts((prev) => [...prev, ...result.posts]);
            setLastDoc(result.lastDoc);
          } else {
            setLastDoc(null);
          }
        } finally {
          setLoadingMore(false);
        }
      });

      if (node) observer.current.observe(node);
    },
    [feedLoading, loadingMore, lastDoc],
  );

  useEffect(() => {
    async function loadRevisionPostIds() {
      if (!user?.uid) {
        setRevisionPostIds(new Set());
        return;
      }

      try {
        const postIds = await getRevisionPostIds(user.uid);

        setRevisionPostIds(new Set(postIds));
      } catch (error) {
        console.error("Revision IDs load error:", error);
        setRevisionPostIds(new Set());
      }
    }

    loadRevisionPostIds();
  }, [user?.uid]);

  useEffect(() => {
    async function loadFeed() {
      setFeedLoading(true);

      const result = await getInitialHomeFeed();

      setFeedPosts(result.posts);
      setLastDoc(result.lastDoc);

      setFeedLoading(false);
    }

    loadFeed();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeHomeFeed((posts) => {
      setFeedPosts(posts);
    });

    return () => unsubscribe();
  }, []);

  // এখানে নতুন কোড
  useEffect(() => {
    if (!postIdFromUrl) return;

    const timer = setTimeout(() => {
      const element = postRefs.current[postIdFromUrl];

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [postIdFromUrl, feedPosts]);

  function showCopiedToast() {
    setShowCopyToast(true);

    setTimeout(() => {
      setShowCopyToast(false);
    }, 2500);
  }

  return (
    <div className="min-h-screen font-[family-name:var(--font-bengali-sans)] px-4 pb-16">
      {/* মূল ফিড */}
      <div className="max-w-xl mx-auto">
        <div className="space-y-1.5">
          {feedLoading ? (
            <HomeFeedSkeleton />
          ) : filteredPosts.length > 0 ? (
            <>
              {visiblePosts.map((post, index) => (
                <PostCard
                  ref={(node) => {
                    // প্রতিটি পোস্টের DOM reference সংরক্ষণ
                    if (node) {
                      postRefs.current[post.docId || post.id] = node;
                    }

                    // শেষ পোস্টে infinite scroll observer
                    if (index === visiblePosts.length - 1) {
                      lastPostRef(node);
                    }
                  }}
                  key={post.id}
                  post={post}
                  isRevised={revisionPostIds.has(post.id)}

                  onRevisionAdded={(postId) => {
                    setRevisionPostIds((prev) => {
                      const updated = new Set(prev);
                      updated.add(postId);
                      return updated;
                    });
                  }}
                  onEdit={(post) => {
                    setEditingTopic(post);
                    setShowComposer(true);
                  }}
                  onDelete={handleDeletePost}
                  onShare={(post) => {
                    setSharePost(post);
                  }}
                  onCopyLink={(post) => {
                    const postUrl =
                      post.href ||
                      `/books/${encodeURIComponent(post.subject)}/${post.paperId}/${post.id}`;

                    navigator.clipboard.writeText(
                      `${window.location.origin}${postUrl}`,
                    );

                    alert("লিংক কপি হয়েছে।");
                  }}
                />
              ))}

              {loadingMore && <HomeFeedSkeleton count={3} />}
            </>
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
      {showComposer && (
        <ComposerModal
          mode={editingTopic ? "edit" : "create"}
          initialTopic={editingTopic}
          prefillEra={composerEra}
          prefillChapter={composerChapter}
          onClose={() => {
            setShowComposer(false);
            setEditingTopic(null);
          }}

          onSubmit={async (data) => {
            console.log(editingTopic);
            if (editingTopic) {
              await editTopic(
                editingTopic.subject,
                editingTopic.paperId,
                editingTopic.originalId || editingTopic.id,
                data,
              );
            }

            setShowComposer(false);
            setEditingTopic(null);
          }}
        />
      )}

      {sharePost && (
        <ShareModal
          post={sharePost}
          onClose={() => setSharePost(null)}
          onCopySuccess={showCopiedToast}
        />
      )}

      {showCopyToast && (
        <div
          className="
      fixed
      left-1/2
      bottom-6
      -translate-x-1/2
      z-[300]
      flex
      items-center
      gap-2
      px-4
      py-3
      rounded-2xl
      shadow-xl
      border
      border-[var(--color-app-border)]
      bg-[var(--color-app-surface)]
      text-[var(--color-app-text)]
      animate-in
      fade-in
      slide-in-from-bottom-4
      duration-200
    "
        >
          <span className="flex w-6 h-6 items-center justify-center rounded-full bg-emerald-500 text-white text-sm font-bold">
            ✓
          </span>

          <span className="text-sm font-medium">লিংক কপি হয়েছে</span>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeFeedSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}
