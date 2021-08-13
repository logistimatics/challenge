begin;

-- Misc extensions
create extension if not exists citext;
create extension if not exists pgcrypto;

-- Schemas
create schema if not exists logistimatics;
create schema if not exists logistimatics_private;

-- Roles (postgraphql, anonymous, user)
do $$
begin
  create role logistimatics_postgraphql with login password 'plogistimatics' noinherit;
  exception when DUPLICATE_OBJECT then
  raise notice 'logistimatics_postgraphql already exists';
end $$;

do $$
begin
  create role logistimatics_anonymous;
  exception when DUPLICATE_OBJECT then
  raise notice 'logistimatics_anonymous already exists';
end $$;
grant logistimatics_anonymous to logistimatics_postgraphql;

do $$
begin
  create role logistimatics_user;
  exception when DUPLICATE_OBJECT then
  raise notice 'logistimatics_user already exists';
end $$;
grant logistimatics_user to logistimatics_postgraphql;

-- Access control on logistimatics schema
grant usage on schema logistimatics to logistimatics_postgraphql, logistimatics_anonymous, logistimatics_user;
grant usage on schema logistimatics_private to logistimatics_postgraphql;

create type logistimatics.jwt_token as (
  role    text,
  user_id integer,
  exp     integer
);

create table logistimatics.user (
  id      serial primary key,
  name    text not null check (char_length(name) < 80),
  email   citext not null unique check (email ~* '^.+@.+\..+$')
);

create table logistimatics_private.user_account (
  id              integer primary key references logistimatics.user (id) on delete cascade,
  password_hash   text
);

grant select on table logistimatics_private.user_account to logistimatics_postgraphql;

grant select on table logistimatics.user to logistimatics_postgraphql, logistimatics_user;
grant update (name, email) on table logistimatics.user to logistimatics_user;

alter table logistimatics.user enable row level security;

create policy user_select_policy on logistimatics.user for select to logistimatics_user
  using (id = current_setting('jwt.claims.user_id', true)::integer);

create policy user_select_policy_login on logistimatics.user for select to logistimatics_postgraphql
  using (true);

create policy user_update_policy on logistimatics.user for update to logistimatics_user
  using (id = current_setting('jwt.claims.user_id', true)::integer);

create function logistimatics.me()
  returns logistimatics.user as
$$
  select *
  from logistimatics.user u
  where id = current_setting('jwt.claims.user_id', true)::integer
$$ language sql stable;

grant execute on function logistimatics.me() to logistimatics_user;

create table logistimatics.device (
  id       serial primary key,
  user_id  int references logistimatics.user (id) on delete set null,
  name     text,
  battery_percentage float default 100
);

create table logistimatics.position (
  id          serial primary key,
  device_id   integer references logistimatics.device (id) on delete cascade,
  position_at timestamptz not null,
  latitude    float,
  longitude   float,
  address     text
);

create function logistimatics.positions_by_date_range(lower timestamp, upper timestamp) returns setof logistimatics.position as $$
  select *
  from logistimatics.position as position
  where position.position_at between lower and upper
$$ language sql stable;

grant select on table logistimatics.device to logistimatics_user;
grant update (name) on table logistimatics.device to logistimatics_user;

alter table logistimatics.device enable row level security;

create policy device_all_policy on logistimatics.device for all to logistimatics_user
  using (user_id = current_setting('jwt.claims.user_id', true)::integer)
  with check (user_id = current_setting('jwt.claims.user_id', true)::integer);

grant select on table logistimatics.position to logistimatics_user;

alter table logistimatics.position enable row level security;

create policy position_select_policy on logistimatics.position for select to logistimatics_user
  using (device_id in (select id from logistimatics.device where user_id = current_setting('jwt.claims.user_id', true)::integer));

commit;
