import { redirect } from 'next/navigation';

import { getCoachSession } from '@/lib/auth/session';

export default async function HomePage() {
  const session = await getCoachSession();
  redirect(session ? '/command-center' : '/login');
}
