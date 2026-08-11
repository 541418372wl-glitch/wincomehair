-- WINCOME inquiry storage baseline.
--
-- Browser clients must never access this table directly. The only write path is
-- /api/notify-inquiry, which authenticates to Supabase with a server-side
-- service-role key after validation and anti-spam checks.

create table if not exists public.inquiries (
  id bigint generated always as identity primary key,
  name text not null,
  company text,
  email text not null,
  phone text,
  product_type text,
  quantity text,
  material text,
  logo_placement text,
  dimensions text,
  message text,
  created_at timestamptz not null default now(),
  target_market text,
  timeline text
);

alter table public.inquiries enable row level security;

-- RLS intentionally has no public policies. The service_role bypasses RLS,
-- while anon and authenticated receive no table or sequence privileges.
revoke all on table public.inquiries from public, anon, authenticated;
grant all on table public.inquiries to service_role;

revoke all on sequence public.inquiries_id_seq from public, anon, authenticated;
grant usage, select, update on sequence public.inquiries_id_seq to service_role;
