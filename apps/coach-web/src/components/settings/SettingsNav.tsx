'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ACADEMY_SETTINGS_NAV } from '@/lib/settings/nav';

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Academy settings" className="space-y-1">
      {ACADEMY_SETTINGS_NAV.map((item) => {
        const active =
          item.href === '/settings'
            ? pathname === '/settings'
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-xl px-3 py-2 text-sm transition ${
              active
                ? 'bg-gold/15 text-gold-bright'
                : 'text-mute hover:bg-elevated hover:text-white'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
