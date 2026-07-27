'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

export type MemberTableRow = {
  id: string;
  fullName: string;
  email: string;
  belt: string;
  stripes: number;
  membershipStatus: string;
  lastAttendance: string | null;
  classesAttended: number;
  streak: number;
  competitionTeam: string;
  waiverStatus: string;
  joinDate: string;
};

export function MembersTable({
  rows,
  query,
}: {
  rows: MemberTableRow[];
  query: string;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<keyof MemberTableRow>('fullName');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const left = String(a[sortKey] ?? '');
      const right = String(b[sortKey] ?? '');
      const cmp = left.localeCompare(right, undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [rows, sortDir, sortKey]);

  const pageRows = sorted.slice(page * pageSize, page * pageSize + pageSize);
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));

  function toggleSort(key: keyof MemberTableRow) {
    if (sortKey === key) {
      setSortDir((value) => (value === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(key);
    setSortDir('asc');
  }

  return (
    <div className="space-y-4 rounded-2xl border border-line bg-surface p-4 shadow-card">
      <form
        className="flex flex-col gap-3 lg:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          const q = String(form.get('q') ?? '');
          const belt = String(form.get('belt') ?? '');
          const status = String(form.get('status') ?? '');
          const params = new URLSearchParams();
          if (q) params.set('q', q);
          if (belt) params.set('belt', belt);
          if (status) params.set('status', status);
          router.push(`/members?${params.toString()}`);
        }}
      >
        <input
          name="q"
          defaultValue={query}
          placeholder="Search members"
          className="flex-1 rounded-xl border border-line bg-elevated px-3 py-2 text-sm text-white placeholder:text-mute"
        />
        <select
          name="belt"
          className="rounded-xl border border-line bg-elevated px-3 py-2 text-sm text-white"
          defaultValue=""
        >
          <option value="">All belts</option>
          <option value="white">White</option>
          <option value="blue">Blue</option>
          <option value="purple">Purple</option>
          <option value="brown">Brown</option>
          <option value="black">Black</option>
        </select>
        <select
          name="status"
          className="rounded-xl border border-line bg-elevated px-3 py-2 text-sm text-white"
          defaultValue=""
        >
          <option value="">All membership</option>
          <option value="active">Active</option>
          <option value="past_due">Past due</option>
          <option value="paused">Paused</option>
          <option value="canceled">Canceled</option>
        </select>
        <button
          type="submit"
          className="rounded-xl bg-gold px-4 py-2 text-sm font-semibold text-ink"
        >
          Filter
        </button>
        <button
          type="button"
          className="rounded-xl border border-line px-4 py-2 text-sm text-mute"
          onClick={() => {
            // CSV export placeholder
            window.alert('CSV export placeholder — wire when billing/export service lands.');
          }}
        >
          Export CSV
        </button>
      </form>

      {selected.length > 0 ? (
        <div className="flex items-center justify-between rounded-xl border border-line bg-elevated px-3 py-2 text-sm">
          <span>{selected.length} selected</span>
          <span className="text-mute">
            Bulk message placeholder · promotions are not bulkable
          </span>
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-mute">
            <tr>
              <th className="px-2 py-2">
                <input
                  type="checkbox"
                  aria-label="Select all on page"
                  onChange={(event) => {
                    setSelected(
                      event.target.checked ? pageRows.map((row) => row.id) : [],
                    );
                  }}
                />
              </th>
              {(
                [
                  ['fullName', 'Member'],
                  ['belt', 'Belt'],
                  ['stripes', 'Stripes'],
                  ['membershipStatus', 'Membership'],
                  ['lastAttendance', 'Last attended'],
                  ['classesAttended', 'Classes'],
                  ['streak', 'Streak'],
                  ['competitionTeam', 'Comp team'],
                  ['waiverStatus', 'Waiver'],
                  ['joinDate', 'Joined'],
                ] as Array<[keyof MemberTableRow, string]>
              ).map(([key, label]) => (
                <th key={key} className="px-2 py-2">
                  <button type="button" onClick={() => toggleSort(key)}>
                    {label}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => (
              <tr key={row.id} className="border-t border-line/80 hover:bg-elevated/60">
                <td className="px-2 py-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(row.id)}
                    onChange={(event) => {
                      setSelected((current) =>
                        event.target.checked
                          ? [...current, row.id]
                          : current.filter((id) => id !== row.id),
                      );
                    }}
                    aria-label={`Select ${row.fullName}`}
                  />
                </td>
                <td className="px-2 py-3">
                  <Link href={`/members/${row.id}`} className="text-white hover:text-gold">
                    {row.fullName}
                  </Link>
                  <p className="text-xs text-mute">{row.email}</p>
                </td>
                <td className="px-2 py-3 capitalize text-mute">{row.belt}</td>
                <td className="px-2 py-3 text-mute">{row.stripes}</td>
                <td className="px-2 py-3 text-mute">{row.membershipStatus}</td>
                <td className="px-2 py-3 text-mute">{row.lastAttendance ?? '—'}</td>
                <td className="px-2 py-3 text-mute">{row.classesAttended}</td>
                <td className="px-2 py-3 text-mute">{row.streak}</td>
                <td className="px-2 py-3 text-mute">{row.competitionTeam}</td>
                <td className="px-2 py-3 text-mute">{row.waiverStatus}</td>
                <td className="px-2 py-3 text-mute">{row.joinDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-mute">
        <span>
          Page {page + 1} of {pageCount}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-lg border border-line px-3 py-1 disabled:opacity-40"
            disabled={page === 0}
            onClick={() => setPage((value) => Math.max(0, value - 1))}
          >
            Prev
          </button>
          <button
            type="button"
            className="rounded-lg border border-line px-3 py-1 disabled:opacity-40"
            disabled={page >= pageCount - 1}
            onClick={() => setPage((value) => Math.min(pageCount - 1, value + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
