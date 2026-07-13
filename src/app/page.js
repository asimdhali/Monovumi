'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  MoreHorizontal,
  Heart,
  MessageCircle,
  Share2,
  LayoutGrid,
  GraduationCap,
  Baby,
  Flag,
  PenTool,
  Star,
  BookOpen,
} from 'lucide-react';

const tags = ['সব', 'রাগ', 'হতাশা', 'সমস্যা', 'শেখা', 'ধৈর্য'];

const categories = [
  { label: 'সব', icon: LayoutGrid },
  { label: 'শিক্ষক', icon: GraduationCap },
  { label: 'শিশু', icon: Baby },
  { label: 'দেশ', icon: Flag },
  { label: 'লেখক', icon: PenTool },
  { label: 'প্রতিভা', icon: Star },
  { label: 'গল্প', icon: BookOpen },
];

const posts = [
  {
    id: 1,
    name: 'রাকিব হাসান',
    date: '১২ জুলাই, ২০২৬',
    avatar: 'https://i.pravatar.cc/150?img=5',
    content:
      'জীবনে সমস্যা থাকবেই, কিন্তু ধৈর্য ধরে এগিয়ে গেলে সমাধান আসবেই। হাল ছেড়ে দেওয়া কখনো সমাধান নয়। প্রতিটি ব্যর্থতা আসলে একটি নতুন শেখার সুযোগ।',
    tags: ['সমস্যা', 'ধৈর্য', 'শেখা'],
    category: 'গল্প',
  },
  {
    id: 2,
    name: 'নুসরাত জাহান',
    date: '১১ জুলাই, ২০২৬',
    avatar: 'https://i.pravatar.cc/150?img=2',
    content:
      'নিজের কাজে মনোযোগ দিলে বাইরের সমালোচনা তেমন প্রভাব ফেলে না। মন স্থির রাখাই সবচেয়ে বড় শক্তি। ছোট ছোট অভ্যাসই বড় পরিবর্তন আনে।',
    tags: ['হতাশা', 'শেখা'],
    category: 'প্রতিভা',
  },
  {
    id: 3,
    name: 'আরিফুল ইসলাম',
    date: '১০ জুলাই, ২০২৬',
    avatar: 'https://i.pravatar.cc/150?img=4',
    content:
      'একা একা সব সমস্যা সমাধান করা যায় না, কারো না কারো সাহায্য দরকার হয়। তাই সাহায্য চাইতে দ্বিধা করা উচিত না। এটাই বাস্তবতা।',
    tags: ['সমস্যা', 'রাগ'],
    category: 'শিক্ষক',
  },
];

function PostCard({ post }) {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [liked, setLiked] = useState(false);
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
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-xl border border-[#E3DDD0] p-5 hover:shadow-md hover:shadow-[#23291F]/5 transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-[#EDE8DB] flex-shrink-0 ring-1 ring-[#E3DDD0]">
            <Image
              src={post.avatar}
              alt={post.name}
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <p className="font-semibold text-[#23291F] text-sm">{post.name}</p>
            <p className="text-xs text-[#9c9686]">{post.date}</p>
          </div>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-full hover:bg-[#F1EEE4] transition-colors"
            aria-label="আরও অপশন"
          >
            <MoreHorizontal className="w-5 h-5 text-[#9c9686]" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-[#E3DDD0] py-1 z-10">
              <button className="w-full text-left px-4 py-2 text-sm text-[#5b5647] hover:bg-[#F7F5F0]">
                রিপোর্ট করুন
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-[#5b5647] hover:bg-[#F7F5F0]">
                সংরক্ষণ করুন
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-[#5b5647] hover:bg-[#F7F5F0]">
                কপি লিংক
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-[#F7F5F0]">
                লুকিয়ে রাখুন
              </button>
            </div>
          )}
        </div>
      </div>

      <p
        ref={textRef}
        className={`text-[#5b5647] text-sm leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}
      >
        {post.content}
      </p>

      {isOverflowing && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-1 text-xs font-medium text-[#3B6255] hover:underline"
        >
          {expanded ? 'কম দেখুন' : 'আরও দেখুন'}
        </button>
      )}

      <div className="flex flex-wrap items-center gap-2 mt-3">
        <span className="text-xs bg-[#FDF4DD] text-[#8a6d16] px-2.5 py-1 rounded-full font-medium">
          {post.category}
        </span>
        {post.tags?.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-[#EDF2EE] text-[#3B6255] px-2.5 py-1 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#EFEBE0]">
        <button
          onClick={() => setLiked(!liked)}
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
            liked ? 'text-red-500' : 'text-[#9c9686] hover:text-red-500'
          }`}
        >
          <Heart className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} />
          লাইক
        </button>
        <button className="flex items-center gap-1.5 text-sm font-medium text-[#9c9686] hover:text-[#3B6255] transition-colors">
          <MessageCircle className="w-4 h-4" />
          মন্তব্য
        </button>
        <button className="flex items-center gap-1.5 text-sm font-medium text-[#9c9686] hover:text-[#C9A227] transition-colors">
          <Share2 className="w-4 h-4" />
          শেয়ার
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeTag, setActiveTag] = useState('সব');
  const [activeCategory, setActiveCategory] = useState('সব');

  const filteredPosts = posts.filter((post) => {
    const tagMatch = activeTag === 'সব' || post.tags?.includes(activeTag);
    const categoryMatch = activeCategory === 'সব' || post.category === activeCategory;
    return tagMatch && categoryMatch;
  });

  const tagCounts = tags.slice(1).map((tag) => ({
    tag,
    count: posts.filter((p) => p.tags?.includes(tag)).length,
  }));

  return (
    <div className="min-h-screen font-[family-name:var(--font-bengali-sans)] px-6 pb-16">
      {/* হিরো সেকশন */}
      <section className="max-w-3xl mx-auto text-center pt-14 pb-10">
        <p className="text-xs tracking-[0.3em] uppercase text-[#3B6255]/70 mb-3">
          মনোভূমি — এক টুকরো চিন্তার জায়গা
        </p>
        <h1 className="font-[family-name:var(--font-bengali-serif)] text-3xl md:text-4xl text-[#23291F] leading-snug">
          আজকের চিন্তা, আগামীর পথ
        </h1>
        <svg className="mx-auto mt-2" width="120" height="10" viewBox="0 0 120 10" fill="none">
          <path
            d="M2 7C20 2 40 2 60 5C80 8 100 8 118 3"
            stroke="#C9A227"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <p className="mt-4 text-sm md:text-base text-[#5b5647] max-w-xl mx-auto">
          ছোট ছোট উপলব্ধি, বাস্তব সমস্যার গল্প, আর মানুষের অভিজ্ঞতা — একসাথে, একখানে।
        </p>
      </section>

      {/* মূল কনটেন্ট: বাম সাইডবার + ফিড + ডান সাইডবার */}
      <div className="max-w-6xl mx-auto lg:grid lg:grid-cols-[200px_1fr_280px] lg:gap-6 lg:items-start">
        {/* বাম সাইডবার — বিভাগ */}
        <aside className="hidden lg:block sticky top-24">
          <div className="bg-white rounded-xl border border-[#E3DDD0] p-4">
            <h3 className="font-[family-name:var(--font-bengali-serif)] text-base text-[#23291F] mb-3 px-1">
              বিভাগ
            </h3>
            <nav className="space-y-1">
              {categories.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => setActiveCategory(label)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === label
                      ? 'bg-[#3B6255] text-white'
                      : 'text-[#5b5647] hover:bg-[#F1EEE4]'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* মূল ফিড */}
        <div className="max-w-xl mx-auto lg:mx-0 w-full">
          {/* ট্যাগ ফিল্টার */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  activeTag === tag
                    ? 'bg-[#3B6255] text-white border-[#3B6255]'
                    : 'bg-white text-[#5b5647] border-[#E3DDD0] hover:border-[#3B6255]/40 hover:text-[#3B6255]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* উক্তি সেকশন */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <blockquote className="relative bg-white rounded-xl border-l-[3px] border-[#C9A227] border-t border-r border-b border-[#E3DDD0] p-6 text-center">
              <span className="font-[family-name:var(--font-bengali-serif)] absolute top-2 left-4 text-4xl text-[#C9A227]/30 select-none">
                “
              </span>
              <p className="font-[family-name:var(--font-bengali-serif)] text-sm md:text-base text-[#3a382f] leading-relaxed relative z-10">
                একটি সৎ লোক ও অসৎ লোকের মধ্যে পার্থক্য তার চিন্তায়, অর্থাৎ সে কিভাবে চিন্তা করে তাতে।
              </p>
              <footer className="mt-3 text-xs font-medium text-[#3B6255]">— মনীষি</footer>
            </blockquote>

            <blockquote className="relative bg-white rounded-xl border-l-[3px] border-[#C9A227] border-t border-r border-b border-[#E3DDD0] p-6 text-center">
              <span className="font-[family-name:var(--font-bengali-serif)] absolute top-2 left-4 text-4xl text-[#C9A227]/30 select-none">
                “
              </span>
              <p className="font-[family-name:var(--font-bengali-serif)] text-sm md:text-base text-[#3a382f] leading-relaxed relative z-10">
                আমরা যা শিখি তা আমাদের শরীর শেখে না, শেখে আমাদের মন।
              </p>
              <footer className="mt-3 text-xs font-medium text-[#3B6255]">— নজরুল</footer>
            </blockquote>
          </div>

          {/* পোস্ট তালিকা */}
          <div className="space-y-5">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <p className="text-center text-[#9c9686] text-sm py-8">
                এই ফিল্টারে কোনো পোস্ট পাওয়া যায়নি।
              </p>
            )}
          </div>
        </div>

        {/* ডান সাইডবার */}
        <aside className="hidden lg:block sticky top-24 space-y-5">
          <div className="bg-white rounded-xl border border-[#E3DDD0] p-5">
            <h3 className="font-[family-name:var(--font-bengali-serif)] text-lg text-[#23291F] mb-3">
              জনপ্রিয় ট্যাগ
            </h3>
            <div className="flex flex-wrap gap-2">
              {tagCounts.map(({ tag, count }) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className="text-xs bg-[#EDF2EE] text-[#3B6255] px-2.5 py-1 rounded-full hover:bg-[#3B6255] hover:text-white transition-colors"
                >
                  #{tag} <span className="opacity-60">({count})</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#3B6255] rounded-xl p-5 text-white">
            <h3 className="font-[family-name:var(--font-bengali-serif)] text-lg mb-2">
              মনোভূমি সম্পর্কে
            </h3>
            <p className="text-sm text-white/80 leading-relaxed">
              একটি ছোট্ট কমিউনিটি, যেখানে মানুষ তাদের চিন্তা, সমস্যা আর শেখার গল্প ভাগ করে নেয় — নিরাপদে, নির্দ্বিধায়।
            </p>
          </div>
        </aside>
      </div>

      <footer className="mt-16 text-center text-[#9c9686] text-sm">
        © ২০২৬ মনোভূমি। সর্বস্বত্ব সংরক্ষিত।
      </footer>
    </div>
  );
}