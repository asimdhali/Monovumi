"use client";

import { useState } from "react";
import { useAuth } from "./AuthContext";

export default function LoginPromptModal({ visible, onClose }) {
  const { user, loading, loginWithGoogle } = useAuth();

  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState("");

  // Auth state জানা না গেলে কিছু দেখাব না
  if (loading) return null;

  // লগইন করা থাকলে Modal দরকার নেই
  if (user) return null;

  // Context থেকে Modal বন্ধ থাকলে কিছু দেখাব না
  if (!visible) return null;

  async function handleGoogleLogin() {
    if (loggingIn) return;

    try {
      setLoggingIn(true);
      setError("");

      await loginWithGoogle();

      onClose();
    } catch (error) {
      console.error("Google login error:", error);

      if (error?.code === "auth/cancelled-popup-request") {
        return;
      }

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
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="
          relative w-full max-w-[330px]
          rounded-2xl
          bg-[var(--color-app-surface)]
          border border-[var(--color-app-border)]
          shadow-2xl
          overflow-hidden
        "
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="
            absolute right-2.5 top-2.5
            w-7 h-7
            rounded-full
            flex items-center justify-center
            text-[var(--color-app-muted)]
            hover:bg-[var(--color-app-primary-soft)]
            transition
          "
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
              d="M6 6l12 12M18 6L6 18"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="px-5 pt-6 pb-5 text-center">
          {/* Welcome */}
          <h2 className="text-[17px] font-bold text-[var(--color-app-text)]">
            স্বাগতম, অতিথি ✨
          </h2>

          {/* Message */}
          <p className="mt-1.5 text-[12.5px] text-[var(--color-app-muted)]">
            সকল ফিচার ও সুবিধা পেতে লগ ইন করুন
          </p>

          {/* Error */}
          {error && <p className="mt-2 text-[11px] text-red-500">{error}</p>}

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loggingIn}
            className="
              mt-4
              w-full
              flex items-center justify-center gap-2.5
              rounded-xl
              py-2.5 px-4
              bg-white
              border border-gray-200
              text-gray-700
              text-[13px]
              font-semibold
              shadow-sm
              hover:bg-gray-50
              transition
              disabled:opacity-60
            "
          >
            {loggingIn ? (
              <>
                <span
                  className="
                    w-4 h-4
                    rounded-full
                    border-2 border-gray-400
                    border-t-transparent
                    animate-spin
                  "
                />
                লগ ইন হচ্ছে...
              </>
            ) : (
              <>
                {/* Google Logo */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M21.35 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h5.24a4.48 4.48 0 01-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 21.8c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.28v2.53A9.74 9.74 0 0012 21.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M6.53 13.88A5.86 5.86 0 016.22 12c0-.65.11-1.28.31-1.88V7.59H3.28A9.75 9.75 0 002.25 12c0 1.57.38 3.05 1.03 4.41l3.25-2.53z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 6.09c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.84 3.18 14.63 2.2 12 2.2a9.74 9.74 0 00-8.72 5.39l3.25 2.53C7.3 7.81 9.46 6.09 12 6.09z"
                  />
                </svg>
                Google দিয়ে লগ ইন করুন
              </>
            )}
          </button>

          {/* Later */}
          <button
            onClick={onClose}
            className="
              mt-2
              text-[11.5px]
              text-[var(--color-app-muted)]
              hover:text-[var(--color-app-text)]
              transition
            "
          >
            এখন নয়
          </button>
        </div>
      </div>
    </div>
  );
}
