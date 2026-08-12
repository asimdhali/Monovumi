"use client";

import { useState } from "react";
import { useAuth } from "./AuthContext";

export default function LoginPromptModal() {
  const { user, loading, loginWithGoogle } = useAuth();
  const [visible, setVisible] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState("");

  // Auth state এখনো জানা না গেলে কিছু দেখাব না
  if (loading) return null;

  // লগইন করা থাকলে Modal দরকার নেই
  if (user) return null;

  // ব্যবহারকারী বন্ধ করে দিলে আর দেখাব না
  if (!visible) return null;

  async function handleGoogleLogin() {
    try {
      setLoggingIn(true);
      setError("");

      await loginWithGoogle();

      // সফল হলে AuthContext-এর user update হবে
      setVisible(false);
    } catch (error) {
      console.error("Google login error:", error);
      setError("লগ ইন করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setLoggingIn(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
      {/* Background */}
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        onClick={() => setVisible(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-[360px] overflow-hidden rounded-3xl bg-[var(--color-app-surface)] border border-[var(--color-app-border)] shadow-2xl">
        {/* Close */}
        <button
          onClick={() => setVisible(false)}
          className="absolute right-3 top-3 w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-app-muted)] hover:bg-[var(--color-app-primary-soft)]"
          aria-label="বন্ধ করুন"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="px-6 pt-8 pb-6 text-center">
          {/* Icon */}
          <div
            className="mx-auto mb-4 w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: "var(--color-app-primary-soft)",
              color: "var(--color-app-primary)",
            }}
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-[19px] font-bold text-[var(--color-app-text)]">
            সব কনটেন্ট দেখতে লগ ইন করুন
          </h2>

          {/* Description */}
          <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-app-muted)]">
            লগ ইন করলে আপনি সম্পূর্ণ কনটেন্ট দেখতে, পোস্ট করতে এবং আপনার
            প্রোফাইল ব্যবহার করতে পারবেন।
          </p>

          {/* Error */}
          {error && <p className="mt-3 text-[12px] text-red-500">{error}</p>}

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loggingIn}
            className="mt-5 w-full flex items-center justify-center gap-3 rounded-full py-3 px-4 bg-white border border-gray-300 text-gray-800 text-[14px] font-semibold shadow-sm hover:bg-gray-50 disabled:opacity-60"
          >
            {loggingIn ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
                লগ ইন হচ্ছে...
              </>
            ) : (
              <>
                <span className="text-[18px] font-bold">G</span>
                Google দিয়ে লগ ইন করুন
              </>
            )}
          </button>

          {/* Continue */}
          <button
            onClick={() => setVisible(false)}
            className="mt-3 w-full py-2.5 text-[13px] font-medium text-[var(--color-app-muted)] hover:text-[var(--color-app-text)]"
          >
            এখন নয়
          </button>

          <p className="mt-2 text-[10.5px] text-[var(--color-app-muted)]">
            লগ ইন সম্পূর্ণ বিনামূল্যে
          </p>
        </div>
      </div>
    </div>
  );
}
