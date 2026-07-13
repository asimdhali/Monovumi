import Link from 'next/link';
import { Search } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-[#FBF9F4]/90 backdrop-blur-sm border-b border-[#E3DDD0] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between h-16 items-center gap-6">
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-[#3B6255] tracking-wide">
              MonoVumi
            </Link>
          </div>

          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="খুঁজুন..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-[#E3DDD0] bg-white text-sm text-[#23291F] placeholder-[#9c9686] focus:outline-none focus:ring-2 focus:ring-[#3B6255]/30 focus:border-[#3B6255]/40 transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9c9686]" />
            </div>
          </div>

          <div className="flex space-x-8 flex-shrink-0">
            <Link href="/" className="relative text-sm font-medium text-[#5b5647] hover:text-[#3B6255] transition-colors group py-1">
              Home
              <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-[#3B6255] transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link href="/about" className="relative text-sm font-medium text-[#5b5647] hover:text-[#3B6255] transition-colors group py-1">
              About
              <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-[#3B6255] transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link href="/about" className="relative text-sm font-medium text-[#5b5647] hover:text-[#3B6255] transition-colors group py-1">
              Profile
              <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-[#3B6255] transition-all duration-300 group-hover:w-full" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}