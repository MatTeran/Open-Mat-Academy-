import Link from 'next/link';

import { MembersTable } from '@/components/members/MembersTable';
import { getCoachWebData } from '@/lib/data';

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; belt?: string; status?: string }>;
}) {
  const params = await searchParams;
  const data = getCoachWebData();
  const members = await data.members.list(params.q);
  const profiles = await Promise.all(
    members.map(async (item) => data.members.getById(item.id)),
  );
  const competition = await Promise.all(
    members.map(async (item) => {
      const bundle = await data.development.getByMemberId(item.id);
      return {
        memberId: item.id,
        team: bundle?.competition?.teamStatus ?? 'inactive',
      };
    }),
  );

  const rows = members
    .map((item, index) => {
      const profile = profiles[index];
      if (!profile) {
        return null;
      }
      return {
        id: item.id,
        fullName: item.fullName,
        email: item.email,
        belt: item.belt,
        stripes: item.stripes,
        membershipStatus: item.membershipStatus,
        lastAttendance: item.lastAttendedAt,
        classesAttended: profile.journey.totalClasses,
        streak: profile.trainingStats.currentStreakDays,
        competitionTeam:
          competition.find((entry) => entry.memberId === item.id)?.team ??
          'inactive',
        waiverStatus: profile.waivers.some((w) => w.status !== 'valid')
          ? 'attention'
          : 'valid',
        joinDate: profile.journey.memberSince,
      };
    })
    .filter((row): row is NonNullable<typeof row> => Boolean(row))
    .filter((row) => (params.belt ? row.belt === params.belt : true))
    .filter((row) =>
      params.status ? row.membershipStatus === params.status : true,
    );

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Roster</p>
          <h1 className="font-display text-3xl text-white">Members</h1>
          <p className="text-sm text-mute">
            Searchable desktop table — promotions are never bulk actions.
          </p>
        </div>
        <Link
          href="/development"
          className="rounded-xl border border-gold/40 px-4 py-2 text-sm text-gold-bright"
        >
          Member Development
        </Link>
      </header>
      <MembersTable rows={rows} query={params.q ?? ''} />
    </div>
  );
}
