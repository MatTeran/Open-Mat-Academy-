const STEPS = [
  'Organization',
  'Academy',
  'Location',
  'Owner',
  'Plan',
  'Features',
  'Branding',
  'Integrations',
  'Review',
  'Launch',
] as const;

/** Visual stepper — provisioning form covers steps 1–5; 6–10 are post-create / optional. */
export function OnboardingStepper({ activeIndex = 0 }: { activeIndex?: number }) {
  return (
    <ol className="mb-8 grid gap-2 sm:grid-cols-5 lg:grid-cols-10">
      {STEPS.map((label, index) => {
        const done = index < activeIndex;
        const current = index === activeIndex;
        return (
          <li
            key={label}
            className={`rounded-xl border px-2 py-2 text-center ${
              current
                ? 'border-bronze bg-bronze/10 text-bronze'
                : done
                  ? 'border-line bg-panel text-ink'
                  : 'border-line bg-ivory text-mute'
            }`}
          >
            <span className="block text-[10px] font-semibold uppercase tracking-wide">
              {index + 1}
            </span>
            <span className="mt-0.5 block text-[11px] leading-tight">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}
