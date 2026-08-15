'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { PLATFORM_NAV } from '@/lib/navigation';

export function Sidebar({
  operatorName,
  platformRole,
}: {
  operatorName: string;
  platformRole: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-line bg-panel">
      <div className="border-b border-line px-5 py-5">
        <p className="font-display text-2xl tracking-tight text-ink">My Gi</p>
        <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-bronze">
          Command Center
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {PLATFORM_NAV.map((section) => (
          <div key={section.title} className="mb-5">
            <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-mute">
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== '/overview' && pathname.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block rounded-lg px-3 py-2 text-sm transition ${
                        active
                          ? 'bg-ivory-2 font-semibold text-ink'
                          : 'text-ink-soft hover:bg-ivory'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-line px-5 py-4">
        <p className="truncate text-sm font-medium text-ink">{operatorName}</p>
        <p className="mt-0.5 text-xs capitalize text-mute">{platformRole}</p>
      </div>
    </aside>
  );
}
