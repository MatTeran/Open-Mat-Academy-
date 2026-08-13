import { AppShell } from '@/components/layout/AppShell';
import { requirePlatformSession } from '@/lib/auth/session';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requirePlatformSession();
  return <AppShell session={session}>{children}</AppShell>;
}
