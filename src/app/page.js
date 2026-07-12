import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 font-sans">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-600 mb-3">আমার প্রথম Next.js ওয়েবসাইট!</h1>
        <p className="text-gray-600 text-lg">আমি সফলভাবে এটি তৈরি ও রান করতে পেরেছি।</p>
      </header>

      <main className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">স্বাগতম  👋</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          এখানে আপনি আপনার নিজের মতো করে চমৎকার সব কন্টেন্ট, ছবি বা শিক্ষণীয় তথ্য যুক্ত করতে পারবেন।
        </p>
        <Link href="/about">
  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-xl transition-all shadow-md shadow-blue-200">
    আরও জানুন
  </button>
</Link>
      </main>

      <footer className="mt-16 text-gray-400 text-sm">
        © ২০২৬ আমার ওয়েবসাইট। সর্বস্বত্ব সংরক্ষিত।
      </footer>
    </div>
  );
}