import Link from 'next/link';

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-bronze">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-1 font-display text-3xl tracking-tight text-ink md:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-mute">{description}</p>
        ) : null}
      </div>
      {actions}
    </div>
  );
}

export function KpiCard({
  label,
  value,
  href,
  hint,
  unavailable,
}: {
  label: string;
  value: string | number;
  href?: string;
  hint?: string;
  unavailable?: boolean;
}) {
  const body = (
    <div
      className={`rounded-card border border-line bg-panel p-5 shadow-soft transition ${
        href ? 'hover:border-bronze/40' : ''
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-mute">
        {label}
      </p>
      <p
        className={`mt-3 font-display text-3xl tracking-tight ${
          unavailable ? 'text-mute' : 'text-ink'
        }`}
      >
        {unavailable ? '—' : value}
      </p>
      {hint ? <p className="mt-2 text-xs text-mute">{hint}</p> : null}
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

export function StatusBadge({
  status,
}: {
  status: string;
}) {
  const tone =
    status === 'active' || status === 'healthy' || status === 'live'
      ? 'bg-success/10 text-success'
      : status === 'trial' || status === 'watch' || status === 'draft'
        ? 'bg-warning/10 text-warning'
        : status === 'suspended' || status === 'at_risk' || status === 'stalled'
          ? 'bg-danger/10 text-danger'
          : 'bg-ivory-2 text-mute';

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${tone}`}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-card border border-dashed border-line bg-panel px-6 py-12 text-center">
      <h2 className="font-display text-xl text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-mute">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function UnavailableMetric({
  title,
  reason,
}: {
  title: string;
  reason: string;
}) {
  return (
    <div className="rounded-card border border-line bg-panel p-5">
      <p className="text-sm font-semibold text-ink">{title}</p>
      <p className="mt-2 text-sm leading-6 text-mute">{reason}</p>
    </div>
  );
}

export function SectionCard({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-card border border-line bg-panel shadow-soft">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <h2 className="font-display text-xl text-ink">{title}</h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}
