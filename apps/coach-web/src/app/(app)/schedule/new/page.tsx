import { createClassAction } from '@/lib/actions/schedule';
import { requireCoachSession } from '@/lib/auth/session';

export default async function NewClassPage() {
  const session = await requireCoachSession();

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-gold">Schedule</p>
        <h1 className="font-display text-3xl text-white">Create class</h1>
      </header>
      <form
        action={createClassAction}
        className="space-y-4 rounded-2xl border border-line bg-surface p-5 shadow-card"
      >
        <Field name="title" label="Title" required />
        <Field name="description" label="Description" />
        <Field
          name="date"
          label="Date"
          type="date"
          required
          defaultValue={new Date().toISOString().slice(0, 10)}
        />
        <div className="grid grid-cols-2 gap-3">
          <Field name="startTime" label="Start" defaultValue="18:00" required />
          <Field name="endTime" label="End" defaultValue="19:00" required />
        </div>
        <Field
          name="instructorName"
          label="Instructor"
          defaultValue={session.user.fullName ?? 'Coach'}
          required
        />
        <label className="block text-sm">
          <span className="text-mute">Gi / No-Gi</span>
          <select
            name="giType"
            className="mt-1 w-full rounded-xl border border-line bg-elevated px-3 py-2 text-white"
            defaultValue="gi"
          >
            <option value="gi">Gi</option>
            <option value="no_gi">No-Gi</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-mute">Level</span>
          <select
            name="level"
            className="mt-1 w-full rounded-xl border border-line bg-elevated px-3 py-2 text-white"
            defaultValue="fundamentals"
          >
            <option value="fundamentals">Fundamentals</option>
            <option value="advanced">Advanced</option>
            <option value="competition">Competition</option>
            <option value="kids">Kids</option>
            <option value="open_mat">Open Mat</option>
            <option value="seminar">Seminar</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-mute">Audience</span>
          <select
            name="audience"
            className="mt-1 w-full rounded-xl border border-line bg-elevated px-3 py-2 text-white"
            defaultValue="adults"
          >
            <option value="adults">Adults</option>
            <option value="kids">Kids</option>
            <option value="all">All</option>
          </select>
        </label>
        <Field name="capacity" label="Capacity" type="number" defaultValue="20" />
        <label className="block text-sm">
          <span className="text-mute">Recurrence</span>
          <select
            name="recurrence"
            className="mt-1 w-full rounded-xl border border-line bg-elevated px-3 py-2 text-white"
            defaultValue="weekly"
          >
            <option value="none">None</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="biweekly">Biweekly</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-mute">
          <input type="checkbox" name="isOpenMat" /> Open mat
        </label>
        <button
          type="submit"
          className="rounded-xl bg-gold px-4 py-3 text-sm font-semibold text-ink"
        >
          Save class
        </button>
      </form>
    </div>
  );
}

function Field({
  name,
  label,
  type = 'text',
  required,
  defaultValue,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="text-mute">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-xl border border-line bg-elevated px-3 py-2 text-white"
      />
    </label>
  );
}
