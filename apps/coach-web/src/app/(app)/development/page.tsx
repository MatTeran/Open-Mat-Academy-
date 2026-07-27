import Link from 'next/link';

import { WebBeltBadge } from '@/components/development/WebBeltBadge';
import { getCoachWebData } from '@/lib/data';

export default async function DevelopmentIndexPage() {
  const data = getCoachWebData();
  const members = await data.members.list();
  const bundles = await Promise.all(
    members.map((member) => data.development.getByMemberId(member.id)),
  );

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-gold">Academy record</p>
        <h1 className="font-display text-3xl text-white">Member Development</h1>
        <p className="text-sm text-mute">
          Official belts and stripes — Journey XP is separate and never drives promotions.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {members.map((member, index) => {
          const bundle = bundles[index];
          if (!bundle) {
            return null;
          }
          return (
            <article
              key={member.id}
              className="rounded-2xl border border-line bg-surface p-5 shadow-card"
            >
              <h2 className="text-lg text-white">{member.fullName}</h2>
              <div className="mt-3">
                <WebBeltBadge
                  belt={bundle.development.belt}
                  stripes={bundle.development.stripes}
                />
              </div>
              <p className="mt-3 text-xs text-mute">
                {bundle.summary.timeAtCurrentBeltLabel} at belt ·{' '}
                {bundle.summary.classesAttended} classes
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/members/${member.id}?tab=development`}
                  className="text-sm text-gold"
                >
                  Open profile
                </Link>
                <Link
                  href={`/members/${member.id}/add-stripe`}
                  className="text-sm text-gold"
                >
                  Add stripe
                </Link>
                <Link
                  href={`/members/${member.id}/promote-belt`}
                  className="text-sm text-gold"
                >
                  Promote
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
