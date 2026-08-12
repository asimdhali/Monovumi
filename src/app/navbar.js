"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import SearchOverlay from "./SearchOverlay";

const taglines = [
  "শিক্ষা, জ্ঞান-বিজ্ঞান অর্জনের ফ্রি প্ল্যাটফর্ম",
  "বাণিজ্যমুক্ত শিক্ষা সরবরাহ",
  "যাচাইকৃত শিক্ষকদের হাত ধরে জ্ঞানার্জন",
  "নৈতিক শিক্ষা, দক্ষতা ও মূল্যবোধের ঠিকানা",
];

function RotatingTagline() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % taglines.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span
      key={index}
      className="tagline-animate text-[11px] text-[var(--color-app-muted)] whitespace-nowrap overflow-hidden text-ellipsis max-w-[220px]"
    >
      {taglines[index]}
    </span>
  );
}

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
    href: "/books",
    label: "বই বিস্তারিত",
    icon: "M12 6.25C10.5 5 8.5 4.5 6 4.5c-1 0-2 .1-3 .4v13.5c1-.3 2-.4 3-.4 2.5 0 4.5.5 6 1.75m0-13.5c1.5-1.25 3.5-1.75 6-1.75 1 0 2 .1 3 .4v13.5c-1-.3-2-.4-3-.4-2.5 0-4.5.5-6 1.75m0-13.5v13.5",
  },
];

function ProfileMenu() {
  const { user, profile, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-full flex-shrink-0 overflow-hidden"
        style={{ boxShadow: "0 0 0 1.5px var(--color-app-accent)" }}
        aria-label="প্রোফাইল মেনু"
      >
        <img
          src="https://i.pravatar.cc/150?img=13"
          alt="প্রোফাইল"
          className="w-full h-full object-cover"
        />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-64 rounded-xl shadow-lg border p-3 z-[80]"
          style={{
            background: "var(--color-app-surface)",
            borderColor: "var(--color-app-border)",
          }}
        >
          <div className="flex items-center gap-2.5 px-1 pb-3 mb-2 border-b border-[var(--color-app-border)]">
            <img
              src="https://i.pravatar.cc/150?img=13"
              alt="প্রোফাইল"
              className="w-9 h-9 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-[var(--color-app-text)]">
                আপনি
              </p>
              <p className="text-[11px] text-[var(--color-app-muted)]">
                {role === "teacher" ? "👑 শিক্ষক মোড" : "🎓 শিক্ষার্থী মোড"}
              </p>
            </div>
          </div>

          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-[var(--color-app-text)] hover:bg-[var(--color-app-primary-soft)] transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="var(--color-app-primary)"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 12a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0"
              />
            </svg>
            প্রোফাইল দেখুন
          </Link>
        </div>
      )}
    </div>
  );
}

function NavIcons({ onSearchClick }) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onSearchClick}
        className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[var(--color-app-primary-soft)] transition-colors flex-shrink-0"
        aria-label="খুঁজুন"
      >
        <svg
          className="w-[19px] h-[19px]"
          fill="none"
          stroke="var(--color-app-text)"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="7" strokeWidth="2" strokeLinecap="round" />
          <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      <Link
        href="/notifications"
        className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-[var(--color-app-primary-soft)] transition-colors flex-shrink-0"
        aria-label="নোটিফিকেশন"
      >
        <svg
          className="w-[19px] h-[19px]"
          fill="none"
          stroke="var(--color-app-text)"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        <span
          className="absolute top-1.5 right-1.5 w-[7px] h-[7px] rounded-full"
          style={{
            background: "var(--color-app-accent)",
            border: "2px solid var(--color-app-bg)",
          }}
        />
      </Link>
      <ProfileMenu />
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
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
      <header className="hidden lg:block sticky top-0 z-50 bg-[var(--color-app-bg)]/95 backdrop-blur-md border-b border-[var(--color-app-border)]">
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
            <div className="flex flex-col leading-tight">
              <Link
                href="/"
                className="font-[family-name:var(--font-bengali-serif)] text-xl font-bold text-[var(--color-app-primary)] tracking-wide"
              >
                মনোভূমি
              </Link>
              <RotatingTagline />
            </div>
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
            <NavIcons onSearchClick={() => setSearchOpen(true)} />
          </div>
        </div>
      </header>

      {/* মোবাইল টপ বার */}
      <header className="lg:hidden sticky top-0 z-40 bg-[var(--color-app-bg)]/95 backdrop-blur-md border-b border-[var(--color-app-border)]">
        <div className="px-4 h-14 flex items-center gap-2">
          <button
            onClick={() => setDrawerOpen(true)}
            className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center active:bg-[var(--color-app-primary-soft)] transition-colors flex-shrink-0"
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

          <span className="flex-1 font-[family-name:var(--font-bengali-serif)] text-[19px] font-bold text-[var(--color-app-primary)]">
            মনোভূমি
          </span>

          <NavIcons onSearchClick={() => setSearchOpen(true)} />
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
          <span className="font-[family-name:var(--font-bengali-serif)] text-lg font-bold text-[var(--color-app-primary)]">
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

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
