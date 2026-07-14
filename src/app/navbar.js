'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'হোম', icon: 'M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 011-1h0a1 1 0 011 1v4a1 1 0 001 1h4a1 1 0 001-1V10' },
  { href: '/books', label: 'বই', icon: 'M12 6.25C10.5 5 8.5 4.5 6 4.5c-1 0-2 .1-3 .4v13.5c1-.3 2-.4 3-.4 2.5 0 4.5.5 6 1.75m0-13.5c1.5-1.25 3.5-1.75 6-1.75 1 0 2 .1 3 .4v13.5c-1-.3-2-.4-3-.4-2.5 0-4.5.5-6 1.75m0-13.5v13.5' },
  { href: '/competitions', label: 'প্রতিযোগিতা', icon: 'M8 21h8m-4-4v4M7 4h10v3a5 5 0 01-10 0V4zM7 5H4a2 2 0 002 2h1V5zm10 0h3a2 2 0 01-2 2h-1V5z' },
  { href: '/qa', label: 'প্রশ্ন', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
  { href: '/profile', label: 'প্রোফাইল', icon: 'M12 12a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* ডেস্কটপ টপ নেভ */}
      <header className="hidden lg:block sticky top-0 z-50 bg-[var(--color-app-bg)]/90 backdrop-blur-md border-b border-[var(--color-app-border)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[var(--color-app-primary)] tracking-wide">
            মনোভূমি
          </Link>
          <nav className="flex gap-8">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    active
                      ? 'text-[var(--color-app-primary)]'
                      : 'text-[var(--color-app-muted)] hover:text-[var(--color-app-primary)]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
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
                  stroke={active ? 'var(--color-app-primary)' : 'var(--color-app-muted)'}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} />
                </svg>
                <span
                  className="text-[10px] font-medium"
                  style={{ color: active ? 'var(--color-app-primary)' : 'var(--color-app-muted)' }}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* মোবাইলে নিচের নেভের জন্য জায়গা রাখতে placeholder */}
      <div className="lg:hidden h-16" aria-hidden="true"></div>
    </>
  );
}