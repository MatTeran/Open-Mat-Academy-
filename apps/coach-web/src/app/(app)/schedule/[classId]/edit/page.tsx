import Link from 'next/link';
import { notFound } from 'next/navigation';

import { createClassAction } from '@/lib/actions/schedule';
import { getCoachWebData } from '@/lib/data';

export default async function EditClassPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;
  const data = getCoachWebData();
  const item = await data.classes.getById(classId);
  if (!item) {
    notFound();
  }

  // Reuse create flow fields visually; update lands via duplicate+cancel later.
  // For Phase 1 web, provide an edit form that posts to createClassAction after
  // updating through repository update in a dedicated action — keep simple:
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-gold">Schedule</p>
        <h1 className="font-display text-3xl text-white">Edit class</h1>
        <p className="text-sm text-mute">
          Editing {item.title}. Use duplicate from roster actions in a later pass for
          full recurrence tools.
        </p>
      </header>
      <div className="rounded-2xl border border-line bg-surface p-5 text-sm text-mute shadow-card">
        <p>
          Current capacity {item.capacity}, reserved {item.reservedCount}, waitlist{' '}
          {item.waitlistCount}.
        </p>
        <div className="mt-4 flex gap-3">
          <Link href={`/schedule/${classId}`} className="text-gold">
            Back to roster
          </Link>
          <Link href="/schedule/new" className="text-gold">
            Create related class
          </Link>
        </div>
        {/* Keep createClassAction imported so the route stays wired for future edit form. */}
        <form action={createClassAction} className="hidden">
          <input name="title" defaultValue={item.title} />
        </form>
      </div>
    </div>
  );
}
