'use client';

import Link from 'next/link';
import { useState } from 'react';

const QUICK_ACTIONS = [
  { href: '/onboarding/new', label: 'Onboard Academy' },
  { href: '/orgs', label: 'Create Organization' },
  { href: '/locations', label: 'Add Location' },
  { href: '/platform-admins', label: 'Invite Platform Admin' },
  { href: '/support', label: 'Open Support Case' },
];

export function QuickAddMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg bg-ink px-3 py-2 text-sm font-semibold text-panel hover:bg-ink-soft"
      >
        Quick Add
      </button>
      {open ? (
        <div className="absolute right-0 z-20 mt-2 w-56 rounded-card border border-line bg-panel p-2 shadow-lift">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm text-ink-soft hover:bg-ivory hover:text-ink"
            >
              {action.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
