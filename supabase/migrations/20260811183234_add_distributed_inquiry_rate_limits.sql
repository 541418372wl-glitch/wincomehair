-- Atomic distributed rate limiting for the inquiry API.
-- Raw IP addresses, email addresses, and inquiry text never enter this table;
-- the server sends only keyed SHA-256 hashes.

create schema if not exists private;

revoke all on schema private from public, anon, authenticated;
grant usage on schema private to service_role;

create table private.inquiry_rate_limits (
  key_hash text not null check (key_hash ~ '^[a-f0-9]{64}$'),
  bucket_start timestamptz not null,
  window_seconds integer not null check (window_seconds between 1 and 86400),
  hits integer not null default 1 check (hits > 0),
  max_requests integer not null check (max_requests between 1 and 1000),
  expires_at timestamptz not null,
  primary key (key_hash, bucket_start, window_seconds)
);

create index inquiry_rate_limits_expires_at_idx
  on private.inquiry_rate_limits (expires_at);

alter table private.inquiry_rate_limits enable row level security;

revoke all on table private.inquiry_rate_limits from public, anon, authenticated;
grant select, insert, update, delete on table private.inquiry_rate_limits to service_role;

create or replace function public.consume_inquiry_rate_limits(
  p_key_hashes text[],
  p_limits integer[],
  p_window_seconds integer[],
  p_now timestamptz default now()
)
returns table (
  key_hash text,
  current_count integer,
  max_requests integer,
  allowed boolean,
  retry_after_seconds integer
)
language plpgsql
volatile
security invoker
set search_path = ''
as $$
declare
  item_count integer := cardinality(p_key_hashes);
begin
  if item_count is null
     or item_count < 1
     or item_count > 8
     or cardinality(p_limits) <> item_count
     or cardinality(p_window_seconds) <> item_count then
    raise exception 'Invalid rate limit rule arrays' using errcode = '22023';
  end if;

  if exists (
    select 1
    from unnest(p_key_hashes, p_limits, p_window_seconds) as input(hash, max_count, seconds)
    where input.hash is null
       or input.hash !~ '^[a-f0-9]{64}$'
       or input.max_count is null
       or input.max_count not between 1 and 1000
       or input.seconds is null
       or input.seconds not between 1 and 86400
  ) then
    raise exception 'Invalid rate limit rule value' using errcode = '22023';
  end if;

  -- The expiry index keeps this bounded without pg_cron or pg_net.
  delete from private.inquiry_rate_limits
  where expires_at < p_now - interval '1 hour';

  return query
  with input as (
    select
      rules.hash as input_hash,
      rules.max_count,
      rules.seconds,
      rules.ordinality,
      to_timestamp(
        floor(extract(epoch from p_now) / rules.seconds) * rules.seconds
      ) as input_bucket_start
    from unnest(p_key_hashes, p_limits, p_window_seconds)
      with ordinality as rules(hash, max_count, seconds, ordinality)
  ), upserted as (
    insert into private.inquiry_rate_limits as limits (
      key_hash,
      bucket_start,
      window_seconds,
      hits,
      max_requests,
      expires_at
    )
    select
      input.input_hash,
      input.input_bucket_start,
      input.seconds,
      1,
      input.max_count,
      input.input_bucket_start + make_interval(secs => input.seconds)
    from input
    on conflict on constraint inquiry_rate_limits_pkey
    do update set
      hits = limits.hits + 1,
      max_requests = excluded.max_requests,
      expires_at = excluded.expires_at
    returning
      limits.key_hash,
      limits.bucket_start,
      limits.window_seconds,
      limits.hits,
      limits.max_requests,
      limits.expires_at
  )
  select
    upserted.key_hash,
    upserted.hits,
    upserted.max_requests,
    upserted.hits <= upserted.max_requests,
    greatest(1, ceil(extract(epoch from (upserted.expires_at - p_now)))::integer)
  from upserted
  join input
    on input.input_hash = upserted.key_hash
   and input.input_bucket_start = upserted.bucket_start
   and input.seconds = upserted.window_seconds
  order by input.ordinality;
end;
$$;

revoke all on function public.consume_inquiry_rate_limits(text[], integer[], integer[], timestamptz)
  from public, anon, authenticated;
grant execute on function public.consume_inquiry_rate_limits(text[], integer[], integer[], timestamptz)
  to service_role;

comment on table private.inquiry_rate_limits is
  'Ephemeral fixed-window counters keyed only by server-side HMAC hashes.';
comment on function public.consume_inquiry_rate_limits(text[], integer[], integer[], timestamptz) is
  'Atomically consumes up to eight inquiry rate-limit rules for the service_role API.';
