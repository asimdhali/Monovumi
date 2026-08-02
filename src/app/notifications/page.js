"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/* ---------------------------------------------------------
   ডেমো নোটিফিকেশন ডেটা — বাস্তব অ্যাপে এটি Firestore থেকে
   ব্যবহারকারীর UID অনুযায়ী রিয়েল-টাইম আসবে।
--------------------------------------------------------- */
const initialNotifications = [
  {
    id: "n1",
    type: "post",
    icon: "📘",
    title: "রফিক স্যার নতুন নোট যোগ করেছেন",
    body: "‘আলো ও প্রতিফলন’ অধ্যায়ে নতুন নোট প্রকাশিত হয়েছে — বিজ্ঞান",
    time: "১০ মিনিট আগে",
    group: "আজ",
    read: false,
  },
  {
    id: "n2",
    type: "mcq",
    icon: "🏆",
    title: "সাপ্তাহিক MCQ প্রতিযোগিতার ফলাফল প্রকাশিত",
    body: "আপনি ১২০ জনের মধ্যে ৭ম স্থান অর্জন করেছেন। অভিনন্দন!",
    time: "১ ঘণ্টা আগে",
    group: "আজ",
    read: false,
  },
  {
    id: "n3",
    type: "comment",
    icon: "💬",
    title: "আপনার প্রশ্নে নতুন মন্তব্য এসেছে",
    body: "নাদিয়া আপনার প্রশ্নের উত্তর দিয়েছেন: “সালোকসংশ্লেষণ প্রক্রিয়ায়…”",
    time: "৩ ঘণ্টা আগে",
    group: "আজ",
    read: true,
  },
  {
    id: "n4",
    type: "streak",
    icon: "🔥",
    title: "আপনার পড়ার ধারা ভাঙার পথে!",
    body: "আজ মাত্র ৫ মিনিট পড়ে আপনার ৭ দিনের স্ট্রিক ধরে রাখুন",
    time: "গতকাল",
    group: "গতকাল",
    read: true,
  },
  {
    id: "n5",
    type: "teacher",
    icon: "👑",
    title: "শিক্ষক যাচাইকরণ অনুমোদিত হয়েছে",
    body: "অভিনন্দন! আপনি এখন মনোভূমিতে পোস্ট ও নোট যুক্ত করতে পারবেন",
    time: "গতকাল",
    group: "গতকাল",
    read: true,
  },
  {
    id: "n6",
    type: "system",
    icon: "📢",
    title: "মনোভূমিতে নতুন ফিচার: মনঘর",
    body: "এখন মন খারাপ লাগলে মনঘরে গিয়ে মনের কথা শেয়ার করতে পারবেন",
    time: "৩ দিন আগে",
    group: "এই সপ্তাহে",
    read: true,
  },
];

const typeStyles = {
  post: {
    bg: "var(--color-app-primary-soft)",
    color: "var(--color-app-primary)",
  },
  mcq: { bg: "var(--color-app-accent-soft)", color: "var(--color-app-accent)" },
  comment: {
    bg: "var(--color-app-primary-soft)",
    color: "var(--color-app-primary)",
  },
  streak: {
    bg: "var(--color-app-accent-soft)",
    color: "var(--color-app-accent)",
  },
  teacher: {
    bg: "var(--color-app-accent-soft)",
    color: "var(--color-app-accent)",
  },
  system: {
    bg: "var(--color-app-primary-soft)",
    color: "var(--color-app-primary)",
  },
};

const FILTERS = [
  { id: "all", label: "সব" },
  { id: "unread", label: "না পড়া" },
];

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const visible = notifications.filter((n) =>
    filter === "unread" ? !n.read : true,
  );

  const groups = visible.reduce((acc, n) => {
    (acc[n.group] ||= []).push(n);
    return acc;
  }, {});

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markRead(id) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }

  function clearAll() {
    setNotifications([]);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-6 pt-4 pb-10">
      {/* ---------- হেডার ---------- */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            aria-label="ফিরে যান"
            className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-[var(--color-app-text)]"
          >
            ←
          </button>
          <h1 className="font-[family-name:var(--font-bengali-serif)] text-xl text-[var(--color-app-text)]">
            নোটিফিকেশন
          </h1>
          {unreadCount > 0 && (
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded-full text-white"
              style={{ background: "var(--color-app-accent)" }}
            >
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs font-medium"
            style={{ color: "var(--color-app-primary)" }}
          >
            সব পড়া হয়েছে ✓
          </button>
        )}
      </div>

      {/* ---------- ফিল্টার ট্যাব ---------- */}
      <div className="flex gap-2 mt-4 mb-3">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className="px-4 py-1.5 rounded-full text-xs font-semibold transition-colors"
            style={{
              background:
                filter === f.id
                  ? "var(--color-app-primary)"
                  : "var(--color-app-surface)",
              color: filter === f.id ? "#fff" : "var(--color-app-muted)",
              border: `1px solid ${
                filter === f.id
                  ? "var(--color-app-primary)"
                  : "var(--color-app-border)"
              }`,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ---------- তালিকা ---------- */}
      {visible.length === 0 ? (
        <EmptyState filter={filter} />
      ) : (
        <div className="space-y-5">
          {Object.entries(groups).map(([groupName, items]) => (
            <div key={groupName}>
              <p className="text-[11px] font-semibold uppercase tracking-wide mb-2 text-[var(--color-app-muted)]">
                {groupName}
              </p>
              <div className="rounded-2xl border overflow-hidden bg-[var(--color-app-surface)] border-[var(--color-app-border)]">
                {items.map((n, i) => (
                  <button
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className="w-full flex items-start gap-3 p-3.5 text-left relative"
                    style={{
                      borderTop:
                        i === 0 ? "none" : "1px solid var(--color-app-border)",
                      background: n.read
                        ? "transparent"
                        : "var(--color-app-primary-soft)",
                    }}
                  >
                    <span
                      className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-lg"
                      style={{ background: typeStyles[n.type].bg }}
                    >
                      {n.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-sm leading-snug text-[var(--color-app-text)]"
                        style={{ fontWeight: n.read ? 500 : 700 }}
                      >
                        {n.title}
                      </p>
                      <p className="text-xs mt-0.5 leading-relaxed text-[var(--color-app-muted)] line-clamp-2">
                        {n.body}
                      </p>
                      <p className="text-[11px] mt-1 text-[var(--color-app-muted)]">
                        {n.time}
                      </p>
                    </div>
                    {!n.read && (
                      <span
                        className="w-2 h-2 rounded-full shrink-0 mt-1.5"
                        style={{ background: "var(--color-app-accent)" }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {notifications.length > 0 && (
        <button
          onClick={clearAll}
          className="w-full mt-6 py-2.5 text-xs font-medium text-[var(--color-app-muted)]"
        >
          সব নোটিফিকেশন মুছে ফেলুন
        </button>
      )}
    </div>
  );
}

function EmptyState({ filter }) {
  return (
    <div className="rounded-2xl border p-10 text-center bg-[var(--color-app-surface)] border-[var(--color-app-border)]">
      <p className="text-4xl mb-3">🔔</p>
      <p className="text-sm font-medium text-[var(--color-app-text)]">
        {filter === "unread"
          ? "কোনো না পড়া নোটিফিকেশন নেই"
          : "এখনো কোনো নোটিফিকেশন আসেনি"}
      </p>
      <p className="text-xs mt-1 text-[var(--color-app-muted)]">
        নতুন পোস্ট, মন্তব্য বা ফলাফল এলে এখানে দেখতে পাবেন
      </p>
    </div>
  );
}
