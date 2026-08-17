"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, loginWithGoogle } = useAuth();

  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState("");

  // ইতিমধ্যে লগইন করা থাকলে Home-এ পাঠাবে
  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  async function handleGoogleLogin() {
    try {
      setError("");
      setLoginLoading(true);

      await loginWithGoogle();

      router.replace("/");
    } catch (error) {
      console.error("Google login error:", error);

      if (error?.code === "auth/popup-closed-by-user") {
        setError("লগইন উইন্ডো বন্ধ করা হয়েছে।");
      } else if (error?.code === "auth/popup-blocked") {
        setError("ব্রাউজার লগইন পপআপ বন্ধ করে দিয়েছে। আবার চেষ্টা করুন।");
      } else {
        setError("লগইন করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।");
      }
    } finally {
      setLoginLoading(false);
    }
  }

  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-app-bg)]">
        <div className="text-sm text-[var(--color-app-muted)]">
          অপেক্ষা করুন...
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-app-bg)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div
            className="mx-auto mb-4 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-lg"
            style={{
              background: "var(--color-app-primary)",
            }}
          >
            ম
          </div>

          <h1 className="text-2xl font-bold text-[var(--color-app-text)]">
            মনোভূমিতে লগইন করুন
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-[var(--color-app-muted)]">
            শিক্ষা, জ্ঞান ও সৃজনশীলতার যাত্রায়
            <br />
            আমাদের সঙ্গে যুক্ত থাকুন।
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[var(--color-app-surface)] border border-[var(--color-app-border)] rounded-3xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[var(--color-app-text)] mb-2">
            পোস্ট করতে লগইন করুন
          </h2>

          <p className="text-sm leading-relaxed text-[var(--color-app-muted)] mb-6">
            মনোভূমিতে পোস্ট, মন্তব্য ও অন্যান্য ফিচার ব্যবহার করতে আপনার
            অ্যাকাউন্টে লগইন করুন।
          </p>

          {error && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loginLoading}
            className="w-full flex items-center justify-center gap-3 rounded-xl px-4 py-3.5 font-semibold text-sm border border-[var(--color-app-border)] bg-[var(--color-app-bg)] text-[var(--color-app-text)] hover:bg-[var(--color-app-primary-soft)] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loginLoading ? (
              <>
                <div className="w-5 h-5 rounded-full border-2 border-[var(--color-app-muted)] border-t-transparent animate-spin" />
                লগইন হচ্ছে...
              </>
            ) : (
              <>
                {/* Google Icon */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="#4285F4"
                    d="M21.35 12.23c0-.79-.07-1.55-.23-2.27H12v4.3h5.23a4.47 4.47 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.92-4.18 2.92-7.42Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 21.6c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.6Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M6.54 13.69a5.86 5.86 0 0 1 0-3.38V7.78H3.3a9.7 9.7 0 0 0 0 8.44l3.24-2.53Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 6.28c1.43 0 2.72.49 3.73 1.46l2.8-2.8C16.84 3.31 14.63 2.4 12 2.4a9.74 9.74 0 0 0-8.7 5.38l3.24 2.53C7.31 8 9.46 6.28 12 6.28Z"
                  />
                </svg>
                Google দিয়ে লগইন করুন
              </>
            )}
          </button>

          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-[var(--color-app-border)]" />
            <span className="text-[11px] text-[var(--color-app-muted)]">
              নিরাপদ লগইন
            </span>
            <div className="h-px flex-1 bg-[var(--color-app-border)]" />
          </div>

          <p className="text-center text-[11px] leading-relaxed text-[var(--color-app-muted)]">
            Google অ্যাকাউন্ট ব্যবহার করে লগইন করলে আপনার
            <br />
            নাম, ইমেইল ও প্রোফাইল ছবি সংরক্ষিত হতে পারে।
          </p>
        </div>

        {/* Back */}
        <button
          onClick={() => router.push("/")}
          className="w-full mt-5 text-sm text-[var(--color-app-muted)] hover:text-[var(--color-app-text)] transition"
        >
          ← হোম পেজে ফিরে যান
        </button>
      </div>
    </main>
  );
}
