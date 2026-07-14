import Link from 'next/link';
import { books } from '../data';

export default function BooksPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-6 pt-6 pb-10">
      <div className="mb-6">
        <h1 className="font-[family-name:var(--font-bengali-serif)] text-2xl text-[var(--color-app-text)]">
          পাঠ্যবই সমূহ
        </h1>
        <p className="text-sm mt-1 text-[var(--color-app-muted)]">
          অধ্যায় অনুযায়ী নোট, প্রশ্নোত্তর ও এমসিকিউ — সব একসাথে
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {books.map((book) => (
          <Link
            key={book.id}
            href={`/books/${book.id}`}
            className="text-left rounded-2xl border p-4 bg-[var(--color-app-surface)] border-[var(--color-app-border)] hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-2">{book.cover}</div>
            <p className="font-semibold text-sm text-[var(--color-app-text)]">{book.title}</p>
            <p className="text-xs mt-1 text-[var(--color-app-muted)]">
              {book.chapters.length}টি অধ্যায় · {book.subject}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}