-- Pruebas de la migración. Cada bloque lanza una excepción si algo no cuadra.
\set ON_ERROR_STOP on

-- 1. Al registrarse se crea el perfil con los datos de Google.
insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-0000-0000-00000000000a', 'ana@example.com', '{"full_name":"Ana","avatar_url":"https://x/a.png","marketing_opt_in":"true"}'),
  ('00000000-0000-0000-0000-00000000000b', 'beto@example.com', '{"name":"Beto"}');

do $$ declare r record; begin
  select * into r from public.profiles where id = '00000000-0000-0000-0000-00000000000a';
  if r.full_name <> 'Ana' or r.plan <> 'free' or r.marketing_opt_in is not true then
    raise exception 'perfil A mal creado: %', row_to_json(r);
  end if;
  select * into r from public.profiles where id = '00000000-0000-0000-0000-00000000000b';
  if r.full_name <> 'Beto' or r.marketing_opt_in is not false then
    raise exception 'perfil B mal creado: %', row_to_json(r);
  end if;
  raise notice 'OK 1: perfiles creados por trigger';
end $$;

-- 2. Cambio de email en Auth se copia al perfil.
update auth.users set email = 'ana.nueva@example.com' where id = '00000000-0000-0000-0000-00000000000a';
do $$ begin
  if (select email from public.profiles where id = '00000000-0000-0000-0000-00000000000a') <> 'ana.nueva@example.com' then
    raise exception 'email no sincronizado';
  end if;
  raise notice 'OK 2: email sincronizado';
end $$;

-- 3. Cuota diaria: con límite 2, la tercera llamada se rechaza; refund devuelve una.
do $$ declare r record; begin
  select * into r from public.consume_quota('00000000-0000-0000-0000-00000000000a', 'revision', 2);
  if not r.allowed or r.used <> 1 then raise exception 'consumo 1: %', row_to_json(r); end if;
  select * into r from public.consume_quota('00000000-0000-0000-0000-00000000000a', 'revision', 2);
  if not r.allowed or r.used <> 2 then raise exception 'consumo 2: %', row_to_json(r); end if;
  select * into r from public.consume_quota('00000000-0000-0000-0000-00000000000a', 'revision', 2);
  if r.allowed or r.used <> 2 then raise exception 'consumo 3 debía fallar: %', row_to_json(r); end if;
  perform public.refund_quota('00000000-0000-0000-0000-00000000000a', 'revision');
  select * into r from public.consume_quota('00000000-0000-0000-0000-00000000000a', 'revision', 2);
  if not r.allowed or r.used <> 2 then raise exception 'consumo tras refund: %', row_to_json(r); end if;
  select * into r from public.consume_quota('00000000-0000-0000-0000-00000000000a', 'coherencia', 0);
  if r.allowed or r.used <> 0 then raise exception 'límite 0 debía fallar: %', row_to_json(r); end if;
  raise notice 'OK 3: cuota diaria';
end $$;

-- 4. Plan: una suscripción activa da Pro; cancelada lo quita; pro_until manual también cuenta.
insert into public.subscriptions (id, user_id, status) values ('sub_1', '00000000-0000-0000-0000-00000000000a', 'active');
do $$ begin
  if public.sync_profile_plan('00000000-0000-0000-0000-00000000000a') <> 'pro' then raise exception 'debía ser pro'; end if;
  if not public.is_pro('00000000-0000-0000-0000-00000000000a') then raise exception 'is_pro falso'; end if;
  update public.subscriptions set status = 'canceled' where id = 'sub_1';
  if public.sync_profile_plan('00000000-0000-0000-0000-00000000000a') <> 'free' then raise exception 'debía ser free'; end if;
  update public.profiles set pro_until = now() + interval '3 days' where id = '00000000-0000-0000-0000-00000000000a';
  if not public.is_pro('00000000-0000-0000-0000-00000000000a') then raise exception 'pro_until no cuenta'; end if;
  raise notice 'OK 4: plan y pro_until';
end $$;

-- 5. RLS: cada persona solo ve lo suyo y no puede tocar plan ni role.
insert into public.reports (user_id, kind, space_type, title, result, model, score)
values ('00000000-0000-0000-0000-00000000000a', 'revision', 'escaparate', 'Escaparate A', '{}', 'test', 70),
       ('00000000-0000-0000-0000-00000000000b', 'revision', 'mesa', 'Mesa B', '{}', 'test', 50);

set role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000b', false);

do $$ declare n int; begin
  select count(*) into n from public.reports;
  if n <> 1 then raise exception 'B ve % informes (debía ver 1)', n; end if;
  select count(*) into n from public.profiles;
  if n <> 1 then raise exception 'B ve % perfiles (debía ver 1)', n; end if;
  update public.profiles set store_name = 'Tienda B' where id = '00000000-0000-0000-0000-00000000000b';
  if (select store_name from public.profiles where id = '00000000-0000-0000-0000-00000000000b') <> 'Tienda B' then
    raise exception 'B no puede editar su tienda';
  end if;
  begin
    update public.profiles set plan = 'pro' where id = '00000000-0000-0000-0000-00000000000b';
    raise exception 'B ha podido cambiar su plan';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.profiles set role = 'admin' where id = '00000000-0000-0000-0000-00000000000b';
    raise exception 'B ha podido hacerse admin';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.refund_quota('00000000-0000-0000-0000-00000000000b', 'revision');
    raise exception 'B ha podido llamar a refund_quota';
  exception when insufficient_privilege then null;
  end;
  select count(*) into n from public.events;
  if n <> 0 then raise exception 'B ve eventos'; end if;
  raise notice 'OK 5: RLS y permisos de columna';
end $$;

reset role;

-- 6. Afiliados: comisión y referidos visibles solo para su dueño.
insert into public.affiliates (id, user_id, code, status) values
  ('00000000-0000-0000-0000-0000000000f1', '00000000-0000-0000-0000-00000000000a', 'ana-vm', 'active');
update public.profiles set referred_by = '00000000-0000-0000-0000-0000000000f1' where id = '00000000-0000-0000-0000-00000000000b';
insert into public.referrals (id, affiliate_id, referred_user_id) values
  ('00000000-0000-0000-0000-0000000000e1', '00000000-0000-0000-0000-0000000000f1', '00000000-0000-0000-0000-00000000000b');
insert into public.commissions (affiliate_id, referral_id, stripe_invoice_id, base_cents, amount_cents, available_at)
values ('00000000-0000-0000-0000-0000000000f1', '00000000-0000-0000-0000-0000000000e1', 'in_1', 826, 248, now());

do $$ begin
  begin
    insert into public.affiliates (user_id, code) values ('00000000-0000-0000-0000-00000000000b', 'NO VALE');
    raise exception 'código con mayúsculas y espacios aceptado';
  exception when check_violation then null;
  end;
  raise notice 'OK 6a: validación de código';
end $$;

set role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000a', false);
do $$ declare n int; begin
  select count(*) into n from public.commissions;
  if n <> 1 then raise exception 'A ve % comisiones', n; end if;
  select count(*) into n from public.referrals;
  if n <> 1 then raise exception 'A ve % referidos', n; end if;
end $$;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000b', false);
do $$ declare n int; begin
  select count(*) into n from public.commissions;
  if n <> 0 then raise exception 'B ve comisiones ajenas'; end if;
  raise notice 'OK 6b: comisiones privadas';
end $$;
reset role;

-- 7. Serie diaria del panel.
do $$ declare n int; begin
  select count(*) into n from public.admin_daily_stats(14);
  if n <> 14 then raise exception 'admin_daily_stats devuelve % filas', n; end if;
  if (select sum(signups) from public.admin_daily_stats(14)) <> 2 then raise exception 'signups mal contados'; end if;
  raise notice 'OK 7: estadísticas diarias';
end $$;

-- 8. Bucket privado creado.
do $$ begin
  if not exists (select 1 from storage.buckets where id = 'report-images' and public = false) then
    raise exception 'falta el bucket privado';
  end if;
  raise notice 'OK 8: bucket report-images';
end $$;
