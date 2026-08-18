"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useAuth } from "../AuthContext";
import {
  subscribeToNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../services/notificationService";

export default function NotificationsPage() {
  const { user, loading: authLoading } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = subscribeToNotifications(user.uid, (data) => {
      setNotifications(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, authLoading]);

  async function handleNotificationClick(notification) {
    if (!notification.read) {
      try {
        await markNotificationAsRead(notification.id);
      } catch (error) {
        console.error("Notification read error:", error);
      }
    }
  }

  async function handleMarkAllAsRead() {
    if (!user) return;

    try {
      await markAllNotificationsAsRead(user.uid);
    } catch (error) {
      console.error("Mark all notifications error:", error);
    }
  }

  const unreadCount = notifications.filter(
    (notification) => notification.read !== true,
  ).length;

  if (authLoading || loading) {
    return (
      <main className="w-full min-h-screen bg-[var(--color-app-bg)]">
        <div className="w-full max-w-2xl mx-auto px-4 pt-6 pb-24">
          <div className="h-7 w-32 rounded-lg animate-pulse bg-[var(--color-app-border)]" />

          <div className="mt-6 space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-20 rounded-2xl animate-pulse bg-[var(--color-app-surface)] border border-[var(--color-app-border)]"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="w-full min-h-screen bg-[var(--color-app-bg)]">
        <div className="w-full max-w-2xl mx-auto px-4 pt-8 pb-24">
          <div className="rounded-2xl border border-[var(--color-app-border)] bg-[var(--color-app-surface)] p-6 text-center">
            <div className="text-4xl mb-3">🔔</div>

            <h1 className="text-lg font-bold text-[var(--color-app-text)]">
              নোটিফিকেশন দেখতে লগ ইন করুন
            </h1>

            <p className="text-sm text-[var(--color-app-muted)] mt-2">
              আপনার নোটিফিকেশন দেখতে প্রথমে আপনার অ্যাকাউন্টে লগ ইন করুন।
            </p>

            <Link
              href="/"
              className="inline-block mt-5 px-5 py-2.5 rounded-xl bg-[var(--color-app-accent)] text-white text-sm font-semibold"
            >
              হোমে ফিরে যান
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen bg-[var(--color-app-bg)]">
      <div className="w-full max-w-2xl mx-auto px-4 pt-5 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="font-[family-name:var(--font-bengali-serif)] text-xl font-bold text-[var(--color-app-text)]">
              নোটিফিকেশন
            </h1>

            <p className="text-xs text-[var(--color-app-muted)] mt-1">
              {unreadCount > 0
                ? `${unreadCount}টি নতুন নোটিফিকেশন`
                : "সব নোটিফিকেশন পড়া হয়েছে"}
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs font-medium text-[var(--color-app-primary)] hover:underline"
            >
              সব পড়া হয়েছে
            </button>
          )}
        </div>

        {/* Empty */}
        {notifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔔</div>

            <p className="text-sm font-medium text-[var(--color-app-text)]">
              এখনো কোনো নোটিফিকেশন নেই
            </p>

            <p className="text-xs text-[var(--color-app-muted)] mt-1">
              নতুন কোনো আপডেট হলে এখানে দেখা যাবে।
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => {
              const isUnread = notification.read !== true;

              const content = (
                <div
                  className={`rounded-2xl border p-4 transition-colors ${
                    isUnread
                      ? "bg-[var(--color-app-primary-soft)] border-[var(--color-app-primary)]/20"
                      : "bg-[var(--color-app-surface)] border-[var(--color-app-border)]"
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isUnread
                          ? "bg-[var(--color-app-primary)]/10"
                          : "bg-[var(--color-app-border)]"
                      }`}
                    >
                      <span className="text-base">
                        {notification.type === "new"
                          ? "🆕"
                          : notification.type === "major"
                            ? "✏️"
                            : notification.type === "minor"
                              ? "📝"
                              : "🔔"}
                      </span>
                    </div>

                    {/* Text */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h2
                          className={`text-sm leading-5 ${
                            isUnread
                              ? "font-bold text-[var(--color-app-text)]"
                              : "font-semibold text-[var(--color-app-text)]"
                          }`}
                        >
                          {notification.title}
                        </h2>

                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-[var(--color-app-accent)] flex-shrink-0 mt-1.5" />
                        )}
                      </div>

                      <p className="text-xs leading-5 text-[var(--color-app-muted)] mt-1">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              );

              if (notification.link) {
                return (
                  <Link
                    key={notification.id}
                    href={notification.link}
                    onClick={() => handleNotificationClick(notification)}
                    className="block"
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className="block w-full text-left"
                >
                  {content}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
