export default function SettingsPlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-2">
      <h2 className="font-display text-2xl text-white">{title}</h2>
      <p className="text-sm text-mute">{description}</p>
      <p className="mt-4 rounded-xl border border-line bg-elevated px-4 py-3 text-sm text-mute">
        Scaffolded for Phase 2 navigation. Deep management UI continues in subsequent slices —
        existing Coach Web tools remain the source of truth where already built.
      </p>
    </div>
  );
}
