import SkeletonCard from "./SkeletonCard";

export default function HomeFeedSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((item) => (
        <SkeletonCard key={item} />
      ))}
    </div>
  );
}
