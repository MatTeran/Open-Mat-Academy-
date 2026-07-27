'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { COACH_NAV } from '@/lib/navigation';
import { SignOutButton, BrandMark } from '@/components/auth/AuthActions';

interface SidebarProps {
  academyName: string;
  coachName: string;
}

export function AppSidebar({ academyName, coachName }: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="fixed left-4 top-4 z-40 rounded-lg border border-line bg-surface px-3 py-2 text-sm lg:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
      >
        Menu
      </button>

      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          aria-label="Close navigation overlay"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-line bg-surface transition-transform lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="border-b border-line px-5 py-6">
          <BrandMark href="/command-center" />
          <p className="mt-3 text-xs uppercase tracking-[0.16em] text-mute">
            Coach Dashboard
          </p>
          <button
            type="button"
            className="mt-4 w-full rounded-xl border border-line bg-elevated px-3 py-2 text-left text-sm text-white"
            title="Academy switcher placeholder"
          >
            {academyName}
            <span className="mt-0.5 block text-xs text-mute">Switch academy</span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Primary">
          <ul className="space-y-1">
            {COACH_NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.soon ? '#' : item.href}
                    onClick={() => setOpen(false)}
                    aria-disabled={item.soon}
                    className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${
                      active
                        ? 'bg-gold/15 text-gold-bright'
                        : 'text-mute hover:bg-elevated hover:text-white'
                    } ${item.soon ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    <span>{item.label}</span>
                    {item.soon ? (
                      <span className="text-[10px] uppercase tracking-wide">
                        Soon
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-line px-4 py-4">
          <button
            type="button"
            className="mb-3 w-full rounded-xl border border-dashed border-line px-3 py-2 text-left text-sm text-mute"
            title="Command palette placeholder"
          >
            Search / ⌘K
          </button>
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm text-white">{coachName}</p>
              <p className="text-xs text-mute">Notifications · 3</p>
            </div>
            <SignOutButton />
          </div>
        </div>
      </aside>
    </>
  );
}
