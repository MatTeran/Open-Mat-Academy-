'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-6 shadow-card">
      <h2 className="font-display text-xl text-white">Something went wrong</h2>
      <p className="mt-2 text-sm text-mute">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded-xl bg-gold px-4 py-2 text-sm font-semibold text-ink"
      >
        Try again
      </button>
    </div>
  );
}
