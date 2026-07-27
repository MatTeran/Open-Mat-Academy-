import { AppSidebar } from '@/components/layout/AppSidebar';
import { requireCoachSession } from '@/lib/auth/session';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireCoachSession();

  return (
    <div className="flex min-h-screen bg-ink">
      <AppSidebar
        academyName={session.academyName}
        coachName={session.user.fullName ?? 'Coach'}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 px-4 pb-10 pt-16 lg:px-8 lg:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
