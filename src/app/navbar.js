import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between h-16 items-center">
          {/* লোগো বা সাইটের নাম */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-blue-600 tracking-wide">
              Soyongkrio
            </Link>
          </div>

          {/* নেভিগেশন লিংকসমূহ */}
          <div className="flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              About
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}