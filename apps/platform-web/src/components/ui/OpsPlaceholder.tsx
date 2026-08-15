import Link from 'next/link';

import { EmptyState, PageHeader, UnavailableMetric } from '@/components/ui/Primitives';

export function OpsPlaceholderPage({
  eyebrow,
  title,
  description,
  reasons,
}: {
  eyebrow: string;
  title: string;
  description: string;
  reasons: string[];
}) {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <EmptyState
        title={`${title} is scaffolded`}
        description="This area is part of the Command Center IA. Core directory and onboarding ship first; this module uses real services when its data plane is ready."
        action={
          <Link href="/overview" className="text-sm font-semibold text-bronze">
            Back to overview →
          </Link>
        }
      />
      <div className="grid gap-4 md:grid-cols-2">
        {reasons.map((reason) => (
          <UnavailableMetric key={reason} title="Dependency" reason={reason} />
        ))}
      </div>
    </div>
  );
}
