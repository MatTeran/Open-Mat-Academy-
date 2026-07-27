export default function Loading() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading">
      <div className="h-8 w-64 animate-pulse rounded-lg bg-elevated" />
      <div className="h-4 w-96 animate-pulse rounded bg-elevated" />
      <div className="grid gap-3 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-2xl bg-surface" />
        ))}
      </div>
    </div>
  );
}
