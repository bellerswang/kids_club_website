create type public.app_role as enum ('parent', 'teacher', 'admin');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  role public.app_role not null default 'parent',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create schema if not exists private;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    nullif(new.raw_user_meta_data ->> 'full_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

revoke all on function public.handle_new_user() from public;

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

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

revoke all on function public.set_updated_at() from public;

alter table public.profiles enable row level security;

create policy "Users can read their own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "Admins can read all profiles"
on public.profiles
for select
to authenticated
using ((select private.is_admin()));

create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

revoke all on table public.profiles from anon, authenticated;
grant select on table public.profiles to authenticated;
grant update (full_name, phone) on table public.profiles to authenticated;

create or replace function public.set_user_role(
  target_user_id uuid,
  new_role public.app_role
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not (select private.is_admin()) then
    raise exception 'Only administrators can change user roles';
  end if;

  if target_user_id = (select auth.uid()) then
    raise exception 'Administrators cannot change their own role';
  end if;

  update public.profiles
  set role = new_role
  where id = target_user_id;

  if not found then
    raise exception 'User profile not found';
  end if;
end;
$$;

revoke all on function public.set_user_role(uuid, public.app_role) from public;
grant execute on function public.set_user_role(uuid, public.app_role) to authenticated;

-- After registering the first account, bootstrap exactly one administrator
-- from the Supabase SQL Editor:
-- update public.profiles set role = 'admin' where email = 'owner@example.com';
