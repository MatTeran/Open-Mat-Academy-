-- Phase 2 Command Center: integrations foundation + academy profile fields
-- Additive. No live Zendesk connection in this migration.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Academy profile fields (self-service)
-- ---------------------------------------------------------------------------
alter table public.academies
  add column if not exists description text,
  add column if not exists website text,
  add column if not exists phone text,
  add column if not exists email text,
  add column if not exists tagline text,
  add column if not exists social_links jsonb not null default '{}'::jsonb;

alter table public.locations
  add column if not exists phone text,
  add column if not exists email text,
  add column if not exists hero_asset_id uuid;

-- ---------------------------------------------------------------------------
-- Integration providers (platform catalog)
-- ---------------------------------------------------------------------------
create table if not exists public.integration_providers (
  id text primary key,
  name text not null,
  category text not null check (
    category in ('support', 'payments', 'crm', 'calendar', 'email', 'automation', 'custom')
  ),
  availability text not null default 'coming_soon' check (
    availability in ('active', 'beta', 'internal', 'coming_soon', 'disabled')
  ),
  description text,
  docs_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.integration_providers enable row level security;

insert into public.integration_providers (id, name, category, availability, description)
values
  ('zendesk', 'Zendesk', 'support', 'beta', 'Customer support tickets with academy context. Live OAuth/token connect requires Phase 2 checkpoint approval.'),
  ('stripe', 'Stripe', 'payments', 'coming_soon', 'Payments and subscription sync.'),
  ('mailchimp', 'Mailchimp', 'email', 'coming_soon', 'Email marketing audiences.'),
  ('hubspot', 'HubSpot', 'crm', 'coming_soon', 'CRM contact sync.'),
  ('google_calendar', 'Google Calendar', 'calendar', 'coming_soon', 'Class and event calendar sync.'),
  ('google_workspace', 'Google Workspace', 'email', 'coming_soon', 'Workspace identity and groups.'),
  ('zapier', 'Zapier', 'automation', 'coming_soon', 'No-code automation bridge.'),
  ('custom_webhook', 'Custom Webhook', 'custom', 'beta', 'Outbound signed My Gi events to your HTTPS endpoint.'),
  ('custom_api', 'My Gi API', 'custom', 'coming_soon', 'Academy-facing My Gi API clients (foundation).')
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  availability = excluded.availability,
  description = excluded.description,
  updated_at = timezone('utc', now());

-- ---------------------------------------------------------------------------
-- Academy integration connections
-- ---------------------------------------------------------------------------
create table if not exists public.integration_connections (
  id uuid primary key default gen_random_uuid(),
  provider_id text not null references public.integration_providers (id),
  organization_id text references public.organizations (id) on delete set null,
  academy_id text not null references public.academies (id) on delete cascade,
  location_id text references public.locations (id) on delete set null,
  status text not null default 'not_connected' check (
    status in (
      'not_connected',
      'connecting',
      'connected',
      'degraded',
      'error',
      'reauthorization_required',
      'disabled'
    )
  ),
  connection_method text check (
    connection_method in ('oauth', 'api_token', 'webhook', 'api_key', 'none')
  ),
  connected_by uuid references auth.users (id) on delete set null,
  connected_at timestamptz,
  last_success_at timestamptz,
  last_failure_at timestamptz,
  last_error_code text,
  last_error_summary text,
  configuration jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (academy_id, provider_id)
);

create index if not exists integration_connections_academy_idx
  on public.integration_connections (academy_id, status);
create index if not exists integration_connections_provider_idx
  on public.integration_connections (provider_id, status);

alter table public.integration_connections enable row level security;

-- ---------------------------------------------------------------------------
-- Encrypted credentials (never select ciphertext to anon without server mediation)
-- ---------------------------------------------------------------------------
create table if not exists public.integration_credentials (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid not null unique references public.integration_connections (id) on delete cascade,
  academy_id text not null references public.academies (id) on delete cascade,
  provider_id text not null references public.integration_providers (id),
  ciphertext text not null,
  iv text not null,
  key_version text not null default 'v1',
  masked_hint text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists integration_credentials_academy_idx
  on public.integration_credentials (academy_id);

alter table public.integration_credentials enable row level security;

-- ---------------------------------------------------------------------------
-- Integration activity logs (sanitized)
-- ---------------------------------------------------------------------------
create table if not exists public.integration_logs (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid references public.integration_connections (id) on delete set null,
  academy_id text not null references public.academies (id) on delete cascade,
  provider_id text not null,
  operation text not null,
  direction text not null check (direction in ('inbound', 'outbound', 'internal')),
  status text not null check (status in ('success', 'failure', 'skipped')),
  started_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz,
  duration_ms int,
  external_reference text,
  error_code text,
  error_summary text
);

create index if not exists integration_logs_academy_created_idx
  on public.integration_logs (academy_id, started_at desc);
create index if not exists integration_logs_connection_idx
  on public.integration_logs (connection_id, started_at desc);

alter table public.integration_logs enable row level security;

-- ---------------------------------------------------------------------------
-- Outbound webhook endpoints (foundation; delivery worker later)
-- ---------------------------------------------------------------------------
create table if not exists public.webhook_endpoints (
  id uuid primary key default gen_random_uuid(),
  academy_id text not null references public.academies (id) on delete cascade,
  destination_url text not null,
  status text not null default 'active' check (status in ('active', 'disabled')),
  event_types text[] not null default '{}',
  secret_ciphertext text,
  secret_iv text,
  secret_hint text,
  created_by uuid references auth.users (id) on delete set null,
  last_delivery_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists webhook_endpoints_academy_idx
  on public.webhook_endpoints (academy_id, status);

alter table public.webhook_endpoints enable row level security;

create table if not exists public.webhook_deliveries (
  id uuid primary key default gen_random_uuid(),
  endpoint_id uuid not null references public.webhook_endpoints (id) on delete cascade,
  academy_id text not null references public.academies (id) on delete cascade,
  event_id text not null,
  event_type text not null,
  attempt int not null default 1,
  http_status int,
  duration_ms int,
  result text not null check (result in ('success', 'failure', 'pending')),
  error_summary text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists webhook_deliveries_endpoint_idx
  on public.webhook_deliveries (endpoint_id, created_at desc);

alter table public.webhook_deliveries enable row level security;

-- ---------------------------------------------------------------------------
-- Future My Gi API clients (hash only; full key shown once in app)
-- ---------------------------------------------------------------------------
create table if not exists public.api_clients (
  id uuid primary key default gen_random_uuid(),
  academy_id text not null references public.academies (id) on delete cascade,
  name text not null,
  key_prefix text not null,
  key_hash text not null,
  scopes text[] not null default '{}',
  created_by uuid references auth.users (id) on delete set null,
  last_used_at timestamptz,
  expires_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists api_clients_academy_idx
  on public.api_clients (academy_id);

alter table public.api_clients enable row level security;

-- ---------------------------------------------------------------------------
-- RLS policies
-- ---------------------------------------------------------------------------
drop policy if exists "Platform admins manage integration providers" on public.integration_providers;
create policy "Platform admins manage integration providers"
  on public.integration_providers for all to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

drop policy if exists "Authenticated can read integration providers" on public.integration_providers;
create policy "Authenticated can read integration providers"
  on public.integration_providers for select to authenticated
  using (true);

drop policy if exists "Platform admins manage all integration connections" on public.integration_connections;
create policy "Platform admins manage all integration connections"
  on public.integration_connections for all to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

drop policy if exists "Academy managers manage own integration connections" on public.integration_connections;
create policy "Academy managers manage own integration connections"
  on public.integration_connections for all to authenticated
  using (public.can_manage_academy(academy_id))
  with check (public.can_manage_academy(academy_id));

drop policy if exists "Platform admins manage all integration credentials" on public.integration_credentials;
create policy "Platform admins manage all integration credentials"
  on public.integration_credentials for all to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

drop policy if exists "Academy managers manage own integration credentials" on public.integration_credentials;
create policy "Academy managers manage own integration credentials"
  on public.integration_credentials for all to authenticated
  using (public.can_manage_academy(academy_id))
  with check (public.can_manage_academy(academy_id));

drop policy if exists "Platform admins read all integration logs" on public.integration_logs;
create policy "Platform admins read all integration logs"
  on public.integration_logs for select to authenticated
  using (public.is_platform_admin());

drop policy if exists "Academy managers read own integration logs" on public.integration_logs;
create policy "Academy managers read own integration logs"
  on public.integration_logs for select to authenticated
  using (public.can_manage_academy(academy_id));

drop policy if exists "Platform admins insert integration logs" on public.integration_logs;
create policy "Platform admins insert integration logs"
  on public.integration_logs for insert to authenticated
  with check (public.is_platform_admin() or public.can_manage_academy(academy_id));

drop policy if exists "Platform admins manage all webhooks" on public.webhook_endpoints;
create policy "Platform admins manage all webhooks"
  on public.webhook_endpoints for all to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

drop policy if exists "Academy managers manage own webhooks" on public.webhook_endpoints;
create policy "Academy managers manage own webhooks"
  on public.webhook_endpoints for all to authenticated
  using (public.can_manage_academy(academy_id))
  with check (public.can_manage_academy(academy_id));

drop policy if exists "Platform admins read all webhook deliveries" on public.webhook_deliveries;
create policy "Platform admins read all webhook deliveries"
  on public.webhook_deliveries for select to authenticated
  using (public.is_platform_admin());

drop policy if exists "Academy managers read own webhook deliveries" on public.webhook_deliveries;
create policy "Academy managers read own webhook deliveries"
  on public.webhook_deliveries for select to authenticated
  using (public.can_manage_academy(academy_id));

drop policy if exists "Platform admins manage all api clients" on public.api_clients;
create policy "Platform admins manage all api clients"
  on public.api_clients for all to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

drop policy if exists "Academy managers manage own api clients" on public.api_clients;
create policy "Academy managers manage own api clients"
  on public.api_clients for all to authenticated
  using (public.can_manage_academy(academy_id))
  with check (public.can_manage_academy(academy_id));

-- Academy managers can update own academy profile / branding / locations
drop policy if exists "Managers can update academies" on public.academies;
create policy "Managers can update academies"
  on public.academies for update to authenticated
  using (public.is_platform_admin() or public.can_manage_academy(id))
  with check (public.is_platform_admin() or public.can_manage_academy(id));

drop policy if exists "Managers can manage academy branding" on public.academy_branding;
create policy "Managers can manage academy branding"
  on public.academy_branding for all to authenticated
  using (public.is_platform_admin() or public.can_manage_academy(academy_id))
  with check (public.is_platform_admin() or public.can_manage_academy(academy_id));

drop policy if exists "Managers can manage academy media assets" on public.media_assets;
create policy "Managers can manage academy media assets"
  on public.media_assets for all to authenticated
  using (public.is_platform_admin() or public.can_manage_academy(academy_id))
  with check (public.is_platform_admin() or public.can_manage_academy(academy_id));

grant select on public.integration_providers to authenticated;
grant select, insert, update, delete on public.integration_connections to authenticated;
grant select, insert, update, delete on public.integration_credentials to authenticated;
grant select, insert on public.integration_logs to authenticated;
grant select, insert, update, delete on public.webhook_endpoints to authenticated;
grant select on public.webhook_deliveries to authenticated;
grant select, insert, update, delete on public.api_clients to authenticated;

grant select, insert, update, delete on public.integration_providers to service_role;
grant select, insert, update, delete on public.integration_connections to service_role;
grant select, insert, update, delete on public.integration_credentials to service_role;
grant select, insert, update, delete on public.integration_logs to service_role;
grant select, insert, update, delete on public.webhook_endpoints to service_role;
grant select, insert, update, delete on public.webhook_deliveries to service_role;
grant select, insert, update, delete on public.api_clients to service_role;

comment on table public.integration_credentials is
  'Encrypted integration secrets only. Never return ciphertext or plaintext to clients.';
comment on table public.integration_connections is
  'Academy-scoped third-party connections. configuration must not contain secrets.';
