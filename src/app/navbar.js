"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useId } from "react";
import { useAuth } from "./AuthContext";
import SearchOverlay from "./SearchOverlay";
import { useLoginPrompt } from "./LoginPromptContext";

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

const drawerLinks = [
  {
    href: "/books",
    label: "বই বিস্তারিত",
    icon: "M12 6.25C10.5 5 8.5 4.5 6 4.5c-1 0-2 .1-3 .4v13.5c1-.3 2-.4 3-.4 2.5 0 4.5.5 6 1.75m0-13.5c1.5-1.25 3.5-1.75 6-1.75 1 0 2 .1 3 .4v13.5c-1-.3-2-.4-3-.4-2.5 0-4.5.5-6 1.75m0-13.5v13.5",
  },
];

function GuestProfileIcon({ size = 80, className = "" }) {
  const rawId = useId();
  const gradientId = `guest-profile-gradient-${rawId.replace(/:/g, "")}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4F8CFF" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>

      <circle cx="40" cy="40" r="40" fill={`url(#${gradientId})`} />

      <circle cx="40" cy="29" r="12" fill="#FFFFFF" />

      <path d="M18 66c2-13 11-20 22-20s20 7 22 20" fill="#FFFFFF" />
    </svg>
  );
}

/* =========================
   Theme Icons
========================= */

function SunIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="4" strokeWidth="2" />

      <path
        strokeLinecap="round"
        strokeWidth="2"
        d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
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
        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
      />
    </svg>
  );
}

/* =========================
   Profile Menu
========================= */

function ProfileMenu() {
  const { user, profile, loading, logout } = useAuth();

  const { openLoginPrompt } = useLoginPrompt();

  const [open, setOpen] = useState(false);

  const [theme, setTheme] = useState("dark");

  const menuRef = useRef(null);

  /* =========================
     Load saved theme
  ========================= */

  useEffect(() => {
    const savedTheme = localStorage.getItem("monovumi-theme");

    if (savedTheme === "light") {
      setTheme("light");
      document.documentElement.classList.add("light");
    } else {
      setTheme("dark");
      document.documentElement.classList.remove("light");
    }
  }, []);

  /* =========================
     Theme Toggle
  ========================= */

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";

    setTheme(nextTheme);

    if (nextTheme === "light") {
      document.documentElement.classList.add("light");
      localStorage.setItem("monovumi-theme", "light");
    } else {
      document.documentElement.classList.remove("light");
      localStorage.setItem("monovumi-theme", "dark");
    }
  }

  /* =========================
     Outside Click
  ========================= */

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* =========================
     Logout
  ========================= */

  async function handleLogout() {
    try {
      setOpen(false);
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Button */}

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-9 h-9 rounded-full flex-shrink-0 overflow-hidden"
        style={{
          boxShadow: "0 0 0 1.5px var(--color-app-accent)",
        }}
        aria-label="প্রোফাইল মেনু"
        aria-expanded={open}
      >
        {loading ? (
          <div className="w-full h-full animate-pulse bg-[var(--color-app-border)]" />
        ) : user && profile?.photoURL ? (
          <img
            src={profile.photoURL}
            alt={profile.name || "প্রোফাইল"}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <GuestProfileIcon size={36} className="block w-full h-full" />
        )}
      </button>

      {/* =========================
          Small Profile Modal
      ========================= */}

      {open && (
        <div
          className="profile-menu-panel absolute right-0 mt-2 w-60 max-w-[calc(100vw-24px)] rounded-2xl shadow-xl border p-3 z-[80]"
          style={{
            background: "var(--color-app-surface)",
            borderColor: "var(--color-app-border)",
          }}
        >
          {/* =====================
              User Header
          ===================== */}

          <div className="flex items-center gap-3 px-1 pb-3">
            {loading ? (
              <div className="w-10 h-10 rounded-full animate-pulse bg-[var(--color-app-border)]" />
            ) : user && profile?.photoURL ? (
              <img
                src={profile.photoURL}
                alt={profile.name || "প্রোফাইল"}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <GuestProfileIcon size={40} className="block flex-shrink-0" />
            )}

            <div className="min-w-0">
              <p className="text-sm font-semibold truncate text-[var(--color-app-text)]">
                {!user
                  ? "স্বাগতম, অতিথি ✨"
                  : profile?.name || user?.displayName || "আপনি"}
              </p>

              {user ? (
                <p className="text-[11px] text-[var(--color-app-muted)] truncate">
                  {profile?.role === "teacher"
                    ? "👨‍🏫 শিক্ষক মোড"
                    : profile?.role === "admin"
                      ? "👑 Admin মোড"
                      : "🎓 শিক্ষার্থী মোড"}
                </p>
              ) : (
                <button
                  onClick={() => {
                    setOpen(false);
                    openLoginPrompt();
                  }}
                  className="text-[11px] font-medium text-blue-500 hover:text-blue-600 transition-colors"
                >
                  লগ ইন করুন
                </button>
              )}
            </div>
          </div>

          {/* Divider */}

          <div className="profile-menu-divider" />

          {/* =====================
              Day / Night Mode
          ===================== */}

          <button
            onClick={toggleTheme}
            className="profile-menu-item w-full flex items-center justify-between gap-3 px-3 py-2.5 mt-2 rounded-xl text-sm text-[var(--color-app-text)] hover:bg-[var(--color-app-primary-soft)]"
          >
            <div className="flex items-center gap-3">
              <span
                className="profile-mode-icon w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: "var(--color-app-primary-soft)",
                  color: "var(--color-app-primary)",
                }}
              >
                {theme === "dark" ? <SunIcon /> : <MoonIcon />}
              </span>

              <span>{theme === "dark" ? "ডে মোড" : "নাইট মোড"}</span>
            </div>

            {/* Small status indicator */}

            <span className="text-[10px] text-[var(--color-app-muted)]">
              {theme === "dark" ? "Night" : "Day"}
            </span>
          </button>

          {/* =====================
              Logout / Login
          ===================== */}

          {user ? (
            <button
              onClick={handleLogout}
              className="profile-menu-item w-full flex items-center gap-3 px-3 py-2.5 mt-1 rounded-xl text-sm text-red-500 hover:bg-red-500/10"
            >
              <span className="w-8 h-8 rounded-full flex items-center justify-center bg-red-500/10">
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
                    d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 17l5-5-5-5M15 12H3"
                  />
                </svg>
              </span>

              <span>লগ আউট</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setOpen(false);
                openLoginPrompt();
              }}
              className="profile-menu-item w-full flex items-center gap-3 px-3 py-2.5 mt-1 rounded-xl text-sm text-[var(--color-app-text)] hover:bg-[var(--color-app-primary-soft)]"
            >
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: "var(--color-app-primary-soft)",
                  color: "var(--color-app-primary)",
                }}
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
                    d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 17l5-5-5-5M15 12H3"
                  />
                </svg>
              </span>

              <span>লগ ইন করুন</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* =========================
   Navbar Icons
========================= */

function NavIcons({ onSearchClick }) {
  return (
    <div className="flex items-center gap-1">
      {/* Search */}

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

      {/* Notifications */}

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

      {/* Profile */}

      <ProfileMenu />
    </div>
  );
}

/* =========================
   Main Navbar
========================= */

export default function Navbar() {
  const pathname = usePathname();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);

  const touchStartX = useRef(null);

  /* =========================
     Left Edge Swipe
  ========================= */

  useEffect(() => {
    function handleTouchStart(e) {
      const x = e.touches[0].clientX;

      if (x < 24) {
        touchStartX.current = x;
      } else {
        touchStartX.current = null;
      }
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
      {/* =========================
          Desktop Top Navbar
      ========================= */}

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

      {/* =========================
          Mobile Top Navbar
      ========================= */}

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

      {/* =========================
          Mobile Bottom Navbar
      ========================= */}

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

      {/* =========================
          Drawer Overlay
      ========================= */}

      <div
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 bg-black/40 z-[60] transition-opacity duration-300 ${
          drawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* =========================
          Side Drawer
      ========================= */}

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

      {/* =========================
          Search Overlay
      ========================= */}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
