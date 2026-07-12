import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <main className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center border border-gray-100">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">আমাদের সম্পর্কে</h1>
        <p className="text-gray-600 mb-6 leading-relaxed">
          এটি আমাদের ওয়েবসাইটের 'About' পেজ। Next.js অ্যাপ রাউটার ব্যবহার করে খুব সহজেই এই পেজটি তৈরি করা হয়েছে।
        </p>
        
        {/* হোমপেজে ফিরে যাওয়ার লিংক */}
        <Link href="/" className="text-blue-500 hover:underline font-medium">
          ➔ হোমপেজে ফিরে যান
        </Link>
      </main>
    </div>
  );
}