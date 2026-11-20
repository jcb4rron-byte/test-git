-- BARRONVISUAL Check · esquema inicial
-- Ejecutar en el SQL Editor de Supabase (o con `supabase db push`).
-- Idempotente en lo posible: se puede volver a lanzar sin romper datos.

-- ─────────────────────────────────────────────────────────────
-- Utilidades
-- ─────────────────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Día "de uso" en hora de Madrid: el límite diario se reinicia a medianoche peninsular.
create or replace function public.today_madrid()
returns date
language sql
stable
set search_path = ''
as $$
  select (now() at time zone 'Europe/Madrid')::date;
$$;

-- ─────────────────────────────────────────────────────────────
-- Afiliados (va antes de profiles porque profiles la referencia)
-- ─────────────────────────────────────────────────────────────

create table if not exists public.affiliates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  code text not null unique check (code ~ '^[a-z0-9-]{3,24}$'),
  status text not null default 'pending' check (status in ('pending', 'active', 'paused', 'rejected')),
  -- Comisión sobre la base imponible de cada factura pagada (0,300 = 30 %).
  commission_rate numeric(4, 3) not null default 0.300 check (commission_rate >= 0 and commission_rate <= 1),
  -- Durante cuántos meses desde la conversión se paga comisión.
  commission_months int not null default 12 check (commission_months between 1 and 120),
  website text,
  audience text,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists affiliates_updated_at on public.affiliates;
create trigger affiliates_updated_at before update on public.affiliates
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────
-- Perfiles
-- ─────────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  store_name text,
  store_type text check (store_type in ('moda', 'calzado', 'joyeria', 'decoracion', 'belleza', 'gourmet', 'otro')),
  city text,
  role text not null default 'user' check (role in ('user', 'admin')),
  -- Plan que dice Stripe. El plan efectivo también mira pro_until (ver is_pro()).
  plan text not null default 'free' check (plan in ('free', 'pro')),
  -- Pro concedido a mano desde /admin (cortesía, prueba, premio a afiliados).
  pro_until timestamptz,
  stripe_customer_id text unique,
  referred_by uuid references public.affiliates (id) on delete set null,
  marketing_opt_in boolean not null default false,
  unsubscribe_token uuid not null default gen_random_uuid(),
  onboarded_at timestamptz,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_created_at_idx on public.profiles (created_at desc);
create index if not exists profiles_plan_idx on public.profiles (plan);

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- Crea el perfil al registrarse (email o Google).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, marketing_opt_in)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture'),
    coalesce(new.raw_user_meta_data ->> 'marketing_opt_in', 'false') = 'true'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Mantiene el email del perfil igual que el de Auth.
create or replace function public.handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.email is distinct from old.email then
    update public.profiles set email = coalesce(new.email, '') where id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_email_changed on auth.users;
create trigger on_auth_user_email_changed after update of email on auth.users
  for each row execute function public.handle_user_email_change();

-- ¿Tiene Pro ahora mismo? (Stripe o concesión manual vigente)
create or replace function public.is_pro(p_user uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (select p.plan = 'pro' or (p.pro_until is not null and p.pro_until > now())
       from public.profiles p where p.id = p_user),
    false
  );
$$;

-- ─────────────────────────────────────────────────────────────
-- Suscripciones (espejo de Stripe, lo escribe el webhook)
-- ─────────────────────────────────────────────────────────────

create table if not exists public.subscriptions (
  id text primary key, -- id de la suscripción en Stripe (sub_...)
  user_id uuid not null references public.profiles (id) on delete cascade,
  status text not null, -- active, trialing, past_due, canceled, unpaid, incomplete, incomplete_expired, paused
  price_id text,
  billing_interval text check (billing_interval in ('month', 'year')),
  unit_amount_cents int,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  canceled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_user_idx on public.subscriptions (user_id);
create index if not exists subscriptions_status_idx on public.subscriptions (status);

drop trigger if exists subscriptions_updated_at on public.subscriptions;
create trigger subscriptions_updated_at before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- Recalcula profiles.plan a partir de sus suscripciones.
-- past_due conserva Pro mientras Stripe reintenta el cobro.
create or replace function public.sync_profile_plan(p_user uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_plan text;
begin
  select case when exists (
    select 1 from public.subscriptions s
    where s.user_id = p_user and s.status in ('active', 'trialing', 'past_due')
  ) then 'pro' else 'free' end into v_plan;

  update public.profiles set plan = v_plan where id = p_user and plan is distinct from v_plan;
  return v_plan;
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- Informes generados (revisión con foto, coherencia tienda-web, idea de escaparate)
-- ─────────────────────────────────────────────────────────────

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null check (kind in ('revision', 'coherencia', 'idea')),
  space_type text check (space_type in ('escaparate', 'mesa', 'lineal', 'probador', 'fachada', 'interior', 'web')),
  title text not null,
  input jsonb not null default '{}'::jsonb,
  image_paths text[] not null default '{}',
  score int check (score between 0 and 100),
  result jsonb not null,
  model text not null,
  input_tokens int,
  output_tokens int,
  duration_ms int,
  images_deleted_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists reports_user_created_idx on public.reports (user_id, created_at desc);
create index if not exists reports_created_idx on public.reports (created_at desc);

-- ─────────────────────────────────────────────────────────────
-- Uso diario (límites del plan)
-- ─────────────────────────────────────────────────────────────

create table if not exists public.usage_daily (
  user_id uuid not null references public.profiles (id) on delete cascade,
  day date not null,
  feature text not null check (feature in ('revision', 'coherencia', 'idea')),
  count int not null default 0 check (count >= 0),
  primary key (user_id, day, feature)
);

create index if not exists usage_daily_day_idx on public.usage_daily (day);

-- Suma 1 al uso de hoy si no supera el límite. Atómico: dos peticiones a la vez
-- no pueden pasar del límite. Solo la llama el servidor (service role).
create or replace function public.consume_quota(p_user uuid, p_feature text, p_limit int)
returns table (allowed boolean, used int)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_day date := public.today_madrid();
  v_count int;
begin
  if p_limit <= 0 then
    select coalesce((select u.count from public.usage_daily u
      where u.user_id = p_user and u.day = v_day and u.feature = p_feature), 0) into v_count;
    return query select false, v_count;
    return;
  end if;

  insert into public.usage_daily as u (user_id, day, feature, count)
  values (p_user, v_day, p_feature, 1)
  on conflict (user_id, day, feature)
    do update set count = u.count + 1
    where u.count < p_limit
  returning u.count into v_count;

  if v_count is null then
    select u.count into v_count from public.usage_daily u
      where u.user_id = p_user and u.day = v_day and u.feature = p_feature;
    return query select false, v_count;
  else
    return query select true, v_count;
  end if;
end;
$$;

-- Devuelve el uso si la generación falla (no se cobra un intento fallido).
create or replace function public.refund_quota(p_user uuid, p_feature text)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.usage_daily
     set count = greatest(count - 1, 0)
   where user_id = p_user and day = public.today_madrid() and feature = p_feature;
$$;

-- ─────────────────────────────────────────────────────────────
-- Analítica de producto (primera parte, sin cookies de terceros)
-- ─────────────────────────────────────────────────────────────

create table if not exists public.events (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles (id) on delete set null,
  name text not null check (char_length(name) <= 64),
  props jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists events_name_created_idx on public.events (name, created_at desc);
create index if not exists events_created_idx on public.events (created_at desc);

-- ─────────────────────────────────────────────────────────────
-- Referidos y comisiones
-- ─────────────────────────────────────────────────────────────

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references public.affiliates (id) on delete cascade,
  referred_user_id uuid not null unique references public.profiles (id) on delete cascade,
  status text not null default 'registered' check (status in ('registered', 'converted', 'canceled')),
  created_at timestamptz not null default now(),
  converted_at timestamptz
);

create index if not exists referrals_affiliate_idx on public.referrals (affiliate_id);

create table if not exists public.commissions (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references public.affiliates (id) on delete cascade,
  referral_id uuid not null references public.referrals (id) on delete cascade,
  stripe_invoice_id text not null unique,
  base_cents int not null check (base_cents >= 0), -- base imponible de la factura (sin IVA)
  amount_cents int not null check (amount_cents >= 0),
  currency text not null default 'eur',
  status text not null default 'pending' check (status in ('pending', 'approved', 'paid', 'void')),
  -- No se puede pagar antes de esta fecha (margen para devoluciones).
  available_at timestamptz not null,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists commissions_affiliate_idx on public.commissions (affiliate_id, status);

-- ─────────────────────────────────────────────────────────────
-- Correo e idempotencia de webhooks
-- ─────────────────────────────────────────────────────────────

create table if not exists public.email_log (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles (id) on delete cascade,
  template text not null,
  dedupe_key text unique,
  status text not null default 'sent' check (status in ('sent', 'skipped', 'failed')),
  error text,
  created_at timestamptz not null default now()
);

create table if not exists public.stripe_events (
  id text primary key,
  type text not null,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- Seguridad por filas (RLS)
-- El servidor usa la service role para escribir; el navegador solo lee lo suyo.
-- ─────────────────────────────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.reports enable row level security;
alter table public.usage_daily enable row level security;
alter table public.events enable row level security;
alter table public.affiliates enable row level security;
alter table public.referrals enable row level security;
alter table public.commissions enable row level security;
alter table public.email_log enable row level security;
alter table public.stripe_events enable row level security;

drop policy if exists "profiles: leer el mío" on public.profiles;
create policy "profiles: leer el mío" on public.profiles
  for select to authenticated using (id = (select auth.uid()));

drop policy if exists "profiles: editar el mío" on public.profiles;
create policy "profiles: editar el mío" on public.profiles
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- Solo estas columnas las puede cambiar la propia persona. plan, role, pro_until,
-- stripe_customer_id y referred_by solo los cambia el servidor.
revoke update on public.profiles from anon, authenticated;
grant update (full_name, store_name, store_type, city, marketing_opt_in, onboarded_at)
  on public.profiles to authenticated;

drop policy if exists "subscriptions: leer las mías" on public.subscriptions;
create policy "subscriptions: leer las mías" on public.subscriptions
  for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists "reports: leer los míos" on public.reports;
create policy "reports: leer los míos" on public.reports
  for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists "reports: borrar los míos" on public.reports;
create policy "reports: borrar los míos" on public.reports
  for delete to authenticated using (user_id = (select auth.uid()));

drop policy if exists "usage: leer el mío" on public.usage_daily;
create policy "usage: leer el mío" on public.usage_daily
  for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists "affiliates: leer el mío" on public.affiliates;
create policy "affiliates: leer el mío" on public.affiliates
  for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists "referrals: leer los de mi código" on public.referrals;
create policy "referrals: leer los de mi código" on public.referrals
  for select to authenticated using (
    exists (select 1 from public.affiliates a where a.id = affiliate_id and a.user_id = (select auth.uid()))
  );

drop policy if exists "commissions: leer las mías" on public.commissions;
create policy "commissions: leer las mías" on public.commissions
  for select to authenticated using (
    exists (select 1 from public.affiliates a where a.id = affiliate_id and a.user_id = (select auth.uid()))
  );

-- events, email_log y stripe_events: sin políticas (solo service role).

-- Las funciones de cuota y de plan no se pueden llamar desde el navegador.
revoke execute on function public.consume_quota(uuid, text, int) from public, anon, authenticated;
revoke execute on function public.refund_quota(uuid, text) from public, anon, authenticated;
revoke execute on function public.sync_profile_plan(uuid) from public, anon, authenticated;
revoke execute on function public.is_pro(uuid) from public, anon, authenticated;
grant execute on function public.consume_quota(uuid, text, int) to service_role;
grant execute on function public.refund_quota(uuid, text) to service_role;
grant execute on function public.sync_profile_plan(uuid) to service_role;
grant execute on function public.is_pro(uuid) to service_role;

-- ─────────────────────────────────────────────────────────────
-- Panel de administración: series diarias
-- ─────────────────────────────────────────────────────────────

create or replace function public.admin_daily_stats(p_days int default 30)
returns table (day date, signups int, active_users int, reports int, upgrades int, cancellations int)
language sql
stable
security definer
set search_path = ''
as $$
  with days as (
    select generate_series(
      public.today_madrid() - (greatest(p_days, 1) - 1),
      public.today_madrid(),
      interval '1 day'
    )::date as day
  )
  select
    d.day,
    (select count(*) from public.profiles p
      where (p.created_at at time zone 'Europe/Madrid')::date = d.day)::int,
    (select count(distinct u.user_id) from public.usage_daily u where u.day = d.day)::int,
    (select count(*) from public.reports r
      where (r.created_at at time zone 'Europe/Madrid')::date = d.day)::int,
    (select count(*) from public.events e
      where e.name = 'subscription_started' and (e.created_at at time zone 'Europe/Madrid')::date = d.day)::int,
    (select count(*) from public.events e
      where e.name = 'subscription_canceled' and (e.created_at at time zone 'Europe/Madrid')::date = d.day)::int
  from days d
  order by d.day;
$$;

revoke execute on function public.admin_daily_stats(int) from public, anon, authenticated;
grant execute on function public.admin_daily_stats(int) to service_role;

-- ─────────────────────────────────────────────────────────────
-- Almacenamiento de fotos (privado; el servidor sube y firma URLs)
-- ─────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('report-images', 'report-images', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;
