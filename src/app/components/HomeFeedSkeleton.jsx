import SkeletonCard from "./SkeletonCard";

export default function HomeFeedSkeleton({ count = 5 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-[var(--color-app-surface)] rounded-2xl border border-[var(--color-app-border)] p-4 animate-pulse"
        >
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <SkeletonCard key={item} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
