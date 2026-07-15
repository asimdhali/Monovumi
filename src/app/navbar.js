"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAuth, TEACHER_PASSWORD } from "./AuthContext";

const navLinks = [
  {
    href: "/",
    label: "হোম",
    icon: "M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 011-1h0a1 1 0 011 1v4a1 1 0 001 1h4a1 1 0 001-1V10",
  },
  {
    href: "/books",
    label: "বই",
    icon: "M12 6.25C10.5 5 8.5 4.5 6 4.5c-1 0-2 .1-3 .4v13.5c1-.3 2-.4 3-.4 2.5 0 4.5.5 6 1.75m0-13.5c1.5-1.25 3.5-1.75 6-1.75 1 0 2 .1 3 .4v13.5c-1-.3-2-.4-3-.4-2.5 0-4.5.5-6 1.75m0-13.5v13.5",
  },
  {
    href: "/competitions",
    label: "প্রতিযোগিতা",
    icon: "M8 21h8m-4-4v4M7 4h10v3a5 5 0 01-10 0V4zM7 5H4a2 2 0 002 2h1V5zm10 0h3a2 2 0 01-2 2h-1V5z",
  },
  {
    href: "/qa",
    label: "প্রশ্ন",
    icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
  },
  {
    href: "/profile",
    label: "প্রোফাইল",
    icon: "M12 12a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0",
  },
];

// সাইড ড্রয়ারের ভেতরের অতিরিক্ত অপশন
const drawerLinks = [
  {
    href: "/book-detailed",
    label: "বই বিস্তারিত",
    icon: "M12 6.25C10.5 5 8.5 4.5 6 4.5c-1 0-2 .1-3 .4v13.5c1-.3 2-.4 3-.4 2.5 0 4.5.5 6 1.75m0-13.5c1.5-1.25 3.5-1.75 6-1.75 1 0 2 .1 3 .4v13.5c-1-.3-2-.4-3-.4-2.5 0-4.5.5-6 1.75m0-13.5v13.5",
  },
];

function RoleSwitch() {
  const { role, setRole, setTeacherVerified } = useAuth();
  const [showBox, setShowBox] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleClick() {
    if (role === "teacher") {
      setRole("student");
    } else {
      setShowBox(true);
    }
  }

  function checkPassword() {
    if (password === TEACHER_PASSWORD) {
      setRole("teacher");
      setTeacherVerified(true);
      setShowBox(false);
      setPassword("");
      setError("");
    } else {
      setError("পাসওয়ার্ড সঠিক নয়");
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors"
        style={{
          borderColor: "var(--color-app-primary)",
          color: role === "teacher" ? "white" : "var(--color-app-primary)",
          background:
            role === "teacher" ? "var(--color-app-primary)" : "transparent",
        }}
      >
        {role === "teacher" ? "👑 শিক্ষক মোড" : "🎓 শিক্ষার্থী মোড"}
      </button>

      {showBox && (
        <div
          className="absolute right-0 mt-2 w-64 rounded-xl shadow-lg border p-4 z-[80]"
          style={{
            background: "var(--color-app-surface)",
            borderColor: "var(--color-app-border)",
          }}
        >
          <p className="text-xs mb-2 text-[var(--color-app-muted)]">
            শিক্ষক পাসওয়ার্ড দিন
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && checkPassword()}
            autoFocus
            className="w-full p-2 rounded-lg border text-sm bg-[var(--color-app-bg)] border-[var(--color-app-border)] text-[var(--color-app-text)]"
          />
          {error && <p className="text-xs mt-1.5 text-red-500">{error}</p>}
          <div className="flex gap-2 mt-3">
            <button
              onClick={checkPassword}
              className="flex-1 py-1.5 rounded-full text-xs font-semibold text-white"
              style={{ background: "var(--color-app-primary)" }}
            >
              যাচাই করুন
            </button>
            <button
              onClick={() => setShowBox(false)}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-[var(--color-app-muted)] border border-[var(--color-app-border)]"
            >
              বাতিল
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const touchStartX = useRef(null);

  // বাম কিনারা থেকে সোয়াইপ করলে ড্রয়ার খুলবে
  useEffect(() => {
    function handleTouchStart(e) {
      const x = e.touches[0].clientX;
      if (x < 24) touchStartX.current = x;
      else touchStartX.current = null;
    }
    function handleTouchMove(e) {
      if (touchStartX.current === null) return;
      const x = e.touches[0].clientX;
      if (x - touchStartX.current > 60) {
        setDrawerOpen(true);
        touchStartX.current = null;
      }
    }
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <>
      {/* ডেস্কটপ টপ নেভ */}
      <header className="hidden lg:block sticky top-0 z-50 bg-[var(--color-app-bg)]/90 backdrop-blur-md border-b border-[var(--color-app-border)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-2 -ml-2 rounded-full hover:bg-[var(--color-app-primary-soft)] transition-colors"
              aria-label="মেনু খুলুন"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="var(--color-app-text)"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <Link
              href="/"
              className="text-xl font-bold text-[var(--color-app-primary)] tracking-wide"
            >
              মনোভূমি
            </Link>
          </div>
          <div className="flex items-center gap-8">
            <nav className="flex gap-8">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors ${
                      active
                        ? "text-[var(--color-app-primary)]"
                        : "text-[var(--color-app-muted)] hover:text-[var(--color-app-primary)]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <RoleSwitch />
          </div>
        </div>
      </header>

      {/* মোবাইল টপ বার (শুধু হ্যামবার্গার + লোগো) */}
      <header className="lg:hidden sticky top-0 z-40 bg-[var(--color-app-bg)]/90 backdrop-blur-md border-b border-[var(--color-app-border)]">
        <div className="px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 -ml-2 rounded-full active:scale-90 transition-transform"
            aria-label="মেনু খুলুন"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="var(--color-app-text)"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <span className="text-lg font-bold text-[var(--color-app-primary)]">
            মনোভূমি
          </span>
          <div className="ml-auto">
            <RoleSwitch />
          </div>
        </div>
      </header>

      {/* মোবাইল বটম নেভ */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-[var(--color-app-surface)]/95 backdrop-blur-md border-t border-[var(--color-app-border)]">
        <div className="flex items-stretch h-16">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex-1 flex flex-col items-center justify-center gap-0.5"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke={
                    active
                      ? "var(--color-app-primary)"
                      : "var(--color-app-muted)"
                  }
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={link.icon}
                  />
                </svg>
                <span
                  className="text-[10px] font-medium"
                  style={{
                    color: active
                      ? "var(--color-app-primary)"
                      : "var(--color-app-muted)",
                  }}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="lg:hidden h-16" aria-hidden="true"></div>

      {/* সাইড ড্রয়ার */}
      <div
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 bg-black/40 z-[60] transition-opacity duration-300 ${
          drawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        className={`fixed top-0 left-0 bottom-0 z-[70] w-72 bg-[var(--color-app-surface)] shadow-2xl transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-[var(--color-app-border)] flex items-center justify-between">
          <span className="text-lg font-bold text-[var(--color-app-primary)]">
            মনোভূমি
          </span>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-1.5 rounded-full hover:bg-[var(--color-app-primary-soft)] transition-colors"
            aria-label="মেনু বন্ধ করুন"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="var(--color-app-text)"
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
        </div>
        <nav className="p-3">
          {drawerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-[var(--color-app-text)] hover:bg-[var(--color-app-primary-soft)] transition-colors"
            >
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="var(--color-app-primary)"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={link.icon}
                />
              </svg>
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
