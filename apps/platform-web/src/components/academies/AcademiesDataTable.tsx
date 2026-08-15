'use client';

import Link from 'next/link';

import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/Primitives';

type Row = {
  id: string;
  name: string;
  organizationId: string;
  organizationName: string;
  status: string;
  slug: string | null;
};

export function AcademiesDataTable({ rows }: { rows: Row[] }) {
  return (
    <DataTable
      rows={rows}
      searchKeys={[(r) => r.name, (r) => r.organizationName, (r) => r.id]}
      emptyTitle="No academies"
      emptyDescription="Use the onboarding wizard to provision the first academy."
      columns={[
        {
          key: 'name',
          header: 'Academy',
          sortValue: (r) => r.name,
          render: (r) => (
            <Link href={`/academies/${r.id}`} className="font-medium text-ink hover:text-bronze">
              {r.name}
            </Link>
          ),
        },
        {
          key: 'org',
          header: 'Organization',
          sortValue: (r) => r.organizationName,
          render: (r) => (
            <Link href={`/orgs/${r.organizationId}`} className="text-mute hover:text-ink">
              {r.organizationName}
            </Link>
          ),
        },
        {
          key: 'status',
          header: 'Status',
          sortValue: (r) => r.status,
          render: (r) => <StatusBadge status={r.status} />,
        },
        {
          key: 'id',
          header: 'ID',
          sortValue: (r) => r.id,
          render: (r) => <span className="font-mono text-xs text-mute">{r.id}</span>,
        },
      ]}
    />
  );
}
