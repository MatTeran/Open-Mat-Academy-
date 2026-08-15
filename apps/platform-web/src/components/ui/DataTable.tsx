'use client';

import { useMemo, useState } from 'react';

export type DataTableColumn<T> = {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  sortValue?: (row: T) => string | number;
};

export function DataTable<T extends { id: string }>({
  rows,
  columns,
  searchKeys,
  emptyTitle = 'No results',
  emptyDescription = 'Try adjusting filters.',
}: {
  rows: T[];
  columns: DataTableColumn<T>[];
  searchKeys?: Array<(row: T) => string>;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [asc, setAsc] = useState(true);
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const filtered = useMemo(() => {
    let next = rows;
    if (query.trim() && searchKeys?.length) {
      const q = query.trim().toLowerCase();
      next = next.filter((row) =>
        searchKeys.some((fn) => fn(row).toLowerCase().includes(q)),
      );
    }
    if (sortKey) {
      const col = columns.find((c) => c.key === sortKey);
      if (col?.sortValue) {
        next = [...next].sort((a, b) => {
          const av = col.sortValue!(a);
          const bv = col.sortValue!(b);
          if (av < bv) return asc ? -1 : 1;
          if (av > bv) return asc ? 1 : -1;
          return 0;
        });
      }
    }
    return next;
  }, [rows, query, sortKey, asc, columns, searchKeys]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice(page * pageSize, page * pageSize + pageSize);

  return (
    <div className="space-y-3">
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPage(0);
        }}
        placeholder="Search…"
        className="w-full max-w-sm rounded-xl border border-line bg-panel px-3 py-2 text-sm"
      />
      <div className="overflow-hidden rounded-card border border-line bg-panel shadow-soft">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line bg-ivory text-[11px] uppercase tracking-[0.12em] text-mute">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 font-semibold">
                  {col.sortValue ? (
                    <button
                      type="button"
                      className="hover:text-ink"
                      onClick={() => {
                        if (sortKey === col.key) setAsc((v) => !v);
                        else {
                          setSortKey(col.key);
                          setAsc(true);
                        }
                      }}
                    >
                      {col.header}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {pageRows.map((row) => (
              <tr key={row.id} className="hover:bg-ivory/70">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-mute">
                  <p className="font-medium text-ink">{emptyTitle}</p>
                  <p className="mt-1 text-sm">{emptyDescription}</p>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between text-sm text-mute">
        <span>
          {filtered.length} result{filtered.length === 1 ? '' : 's'}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="rounded-lg border border-line px-3 py-1 disabled:opacity-40"
          >
            Prev
          </button>
          <span>
            {page + 1} / {pageCount}
          </span>
          <button
            type="button"
            disabled={page >= pageCount - 1}
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            className="rounded-lg border border-line px-3 py-1 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
