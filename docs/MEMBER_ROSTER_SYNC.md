# Member roster sync (User app → Coach)

New accounts created in the **Member (My Gi)** app now appear in the **Coach** Members list, while **sample/mock members stay**.

## Behavior

| Source | Shown in Coach? |
| --- | --- |
| Sample data (`MOCK_MEMBERS` / web fixtures) | Always |
| Real Supabase signups (`public.profiles`) | Yes, appended (deduped by id/email) |

On signup, Supabase:

1. Creates `auth.users`
2. Trigger inserts `profiles` + `academy_memberships` + `member_development` for `academy-open-mat` (Open Mat · Tracy)
3. Client also calls `ensure_member_roster_profile` when a session exists (idempotent)

## Apply the migration

In the Supabase project used by Member + Coach:

```bash
# If using Supabase CLI linked to the project:
supabase db push
# or run the SQL file in the SQL editor:
# supabase/migrations/20260812190000_member_profiles_roster.sql
```

## Coach login requirements

Coaches see live profiles when:

- JWT `app_metadata.role` / `user_metadata.role` is `coach|manager|owner|admin|staff`, **or**
- They have an `academy_memberships` row for `academy-open-mat` with a staff role

Demo coach login (`coach@openmat.demo`) still uses local mocks when not hitting Supabase.

## Refresh

Coach mobile pulls the merged roster on launch and whenever Dashboard/Members refresh runs.
