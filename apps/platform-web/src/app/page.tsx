import { redirect } from 'next/navigation';

import { getPlatformSession } from '@/lib/auth/session';

export default async function HomePage() {
  const session = await getPlatformSession();
  redirect(session ? '/overview' : '/login');
}
