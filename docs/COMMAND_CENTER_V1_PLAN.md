# Command Center V1 Plan — My Gi Operations OS

Status: audit complete; implementation in progress on `apps/platform-web`.  
Audience: My Gi platform administrators (not academy owners/coaches).

---

## CURRENT STATE

| Item | Detail |
| --- | --- |
| App | `@openmat/platform-web` (Next.js 15 App Router, React 19, Tailwind, port **3001**) |
| Auth | Demo cookie **or** live Supabase SSR + `platform_admins` allowlist |
| Privilege | Separate from academy roles (`superadmin` / `ops` / `support`) |
| Data | Memory fixtures in demo; live Supabase tenant directory when configured |
| Routes today | `/login`, `/orgs`, `/orgs/[orgId]`, `/academies/[academyId]` |
| UI | Minimal header shell; pine/moss theme (pre-redesign) |

Coach Web `/command-center` remains **academy mission control** and must not be confused with this app.

---

## WHAT ALREADY EXISTS

### Application
- Platform login (demo + live email/password)
- Organization list + create
- Organization detail (academies list + create academy)
- Academy detail (locations read, memberships read, assign owner by UUID)
- Server actions gated by `canMutateTenants` (ops+)
- Shared helpers: `@openmat/shared/auth/platform`
- Unit tests for platform helpers + memory directory

### Database (shared with Member / Coach)
- `organizations`, `academies`, `locations`, `academy_memberships`
- Membership-scoped RLS (Phase 2)
- `platform_admins` + `is_platform_admin()` + platform overlay policies
- Coach-scoped `audit_logs`, `media_albums` / `media_items` (not wired to Command Center)

### Not present
- Storage buckets for academy branding/media
- Plans / subscriptions / feature entitlements
- Onboarding pipeline + milestones
- Academy branding config
- Platform audit log / support notes / notifications
- Analytics event instrumentation for WAU/MAU
- Left-nav IA, Overview KPIs, Data dashboards, Branding Studio, etc.

---

## MISSING FUNCTIONALITY (mapped to product goals)

| Owner question | Gap |
| --- | --- |
| How many academies / practitioners / coaches? | Need Overview aggregations (membership role counts) |
| Healthy vs needs attention? | Need health-score service + signals |
| Onboarding stuck where? | Need onboarding status + milestones |
| Engagement / WAU / MAU? | No activity events yet → mark **unavailable** + interface stubs |
| Plans / subscriptions? | Schema + UI foundation; no fake Stripe charges |
| Branding per academy? | Branding tables + Branding Studio + storage |
| Onboard without touching Supabase? | Wizard + transactional `provision_academy` RPC |
| Platform healthy? | System health page (connectivity checks, no secrets) |

---

## DATABASE CHANGES REQUIRED (additive)

1. **Plans & subscriptions** — `platform_plans`, `academy_subscriptions`
2. **Feature entitlements** — `platform_features`, `plan_feature_defaults`, `academy_feature_overrides`
3. **Onboarding** — `academy_onboarding`, `academy_onboarding_milestones`
4. **Branding** — `academy_branding` (draft/preview/published)
5. **Media assets** — `media_assets` metadata + storage buckets/policies
6. **Platform audit** — `platform_audit_logs` (distinct from coach `audit_logs`)
7. **Support** — `academy_support_cases`, `academy_support_notes`
8. **Ops notifications** — `platform_notifications`
9. **Provisioning RPC** — `provision_academy(...)` security definer, `is_platform_admin()` gated
10. Indexes on status / created_at / academy_id / organization_id as needed

---

## SECURITY CONSIDERATIONS

- Platform roles stay on `platform_admins` — never reuse academy `owner`/`admin`
- No service-role in browser / `NEXT_PUBLIC_*` / `EXPO_PUBLIC_*`
- Provisioning via authenticated platform JWT + SECURITY DEFINER RPC (or multi-step RLS writes)
- Tighten RLS later so `support` cannot write tenant rows (app already blocks; SQL should match)
- Media: academy-scoped storage paths + RLS on `media_assets`
- Do not surface private coach notes / practitioner journals in Command Center
- All sensitive mutations → `platform_audit_logs`
- Confirm dialogs for suspend / dangerous ops

---

## IMPLEMENTATION ORDER (this delivery)

1. Audit → this document  
2. Design tokens + left-nav IA + route scaffolds  
3. Additive migration (plans, onboarding, branding, media, features, audit, support, notifications, provision RPC)  
4. Server services/repositories  
5. Overview dashboard (real counts; unavailable metrics labeled)  
6. Organizations / Academies / Locations enhanced management  
7. Onboarding wizard + provisioning  
8. Branding Studio + media upload foundation  
9. Users / Coaches / Platform Admins views  
10. Data dashboards (Executive / Health / Engagement / Funnel) with honest unavailable states  
11. Subscriptions + Features UI foundations  
12. Support + Audit + System Health + Global search  
13. Tests + documentation pack  
14. Final report  

---

## SUCCESS CRITERIA FOR V1 SLICE

An ops user can:

1. Open Overview and see real org/academy/location/member/coach counts  
2. Browse/search organizations and academies  
3. Run **Onboard Academy** wizard end-to-end in demo (and live when migration applied)  
4. See onboarding pipeline status for academies  
5. Open Branding Studio and save draft branding (uploads when storage configured)  
6. View Plans/Features as configuration surfaces (no invented MRR)  
7. View Audit / System Health / Support shells that do not break existing apps  

Existing Member, Coach Mobile, and Coach Web flows remain untouched except shared additive schema.
