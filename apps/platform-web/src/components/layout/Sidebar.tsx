'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { PLATFORM_NAV } from '@/lib/navigation';

export function Sidebar({
  operatorName,
  platformRole,
}: {
  operatorName: string;
  platformRole: string;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`flex h-screen shrink-0 flex-col border-r border-line bg-surface transition-[width] ${
        collapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      <div className="flex items-start justify-between border-b border-line px-4 py-5">
        <div className={collapsed ? 'sr-only' : ''}>
          <p className="font-display text-2xl tracking-tight text-ink">My Gi</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-bronze">
            Command Center
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="rounded-md border border-line px-2 py-1 text-xs text-mute hover:text-ink"
          aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? '»' : '«'}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        {PLATFORM_NAV.map((section) => (
          <div key={section.title} className="mb-4">
            {!collapsed ? (
              <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-mute">
                {section.title}
              </p>
            ) : null}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== '/overview' && pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      title={item.label}
                      className={`block rounded-lg px-3 py-2 text-sm transition ${
                        active
                          ? 'bg-ivory font-semibold text-bronze'
                          : 'text-ink-soft hover:bg-ivory'
                      } ${collapsed ? 'text-center' : ''}`}
                    >
                      {collapsed ? item.label.slice(0, 1) : item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className={`border-t border-line px-4 py-4 ${collapsed ? 'sr-only' : ''}`}>
        <p className="truncate text-sm font-medium text-ink">{operatorName}</p>
        <p className="mt-0.5 text-xs capitalize text-mute">{platformRole}</p>
      </div>
    </aside>
  );
}
