import Link from 'next/link';
import { books } from '../../data';

export default async function BookDetailPage({ params }) {
  const { id } = await params;
  const bookId = parseInt(id);
  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return (
      <div className="max-w-3xl mx-auto px-4 lg:px-6 pt-6">
        <p className="text-[var(--color-app-muted)]">বইটি খুঁজে পাওয়া যায়নি।</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 pt-6 pb-10">
      <div className="flex items-center gap-2 mb-4">
        <Link
          href="/books"
          className="p-1.5 -ml-1.5 rounded-full hover:bg-[var(--color-app-primary-soft)] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="var(--color-app-text)" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="font-[family-name:var(--font-bengali-serif)] text-lg text-[var(--color-app-text)]">
            {book.cover} {book.title}
          </h1>
          <p className="text-xs text-[var(--color-app-muted)]">সূচিপত্র থেকে যেকোনো অধ্যায়ে যাও</p>
        </div>
      </div>

      <div className="space-y-2">
        {book.chapters.map((chapter, index) => (
          <Link
            key={chapter.id}
            href={`/books/${book.id}/${chapter.id}`}
            className="flex items-center justify-between rounded-xl border p-4 bg-[var(--color-app-surface)] border-[var(--color-app-border)] hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold bg-[var(--color-app-primary-soft)] text-[var(--color-app-primary)]">
                {index + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-[var(--color-app-text)]">{chapter.title}</p>
                <p className="text-xs text-[var(--color-app-muted)]">
                  {chapter.notes.length} নোট · {chapter.qa.length} প্রশ্নোত্তর · {chapter.mcqs.length} এমসিকিউ
                </p>
              </div>
            </div>
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="var(--color-app-muted)" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}