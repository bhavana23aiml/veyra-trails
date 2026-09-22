begin;
create table public.destinations (
 id uuid primary key default gen_random_uuid(), name text not null unique,
 slug text not null unique, created_at timestamptz not null default now()
);
create table public.treks (
 id uuid primary key default gen_random_uuid(), slug text not null unique,
 name text not null, destination_id uuid references public.destinations(id),
 state text not null, short_description text not null, description text not null,
 difficulty text not null check (difficulty in ('Easy','Moderate','Challenging')),
 duration_days integer not null check (duration_days > 0), distance_km numeric not null check (distance_km >= 0),
 max_altitude_m integer not null check (max_altitude_m >= 0), price numeric(12,2) not null check (price >= 0),
 image text not null, best_season text[] not null default '{}', featured boolean not null default false,
 is_sample boolean not null default true, beginner_friendly boolean not null default false,
 status text not null default 'draft' check (status in ('draft','published','archived')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.profiles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 full_name text not null default '', phone text, created_at timestamptz not null default now()
);
create table public.wishlists (
 user_id uuid not null references auth.users(id) on delete cascade,
 trek_id uuid not null references public.treks(id) on delete cascade,
 created_at timestamptz not null default now(), primary key(user_id,trek_id)
);
create table public.admins (user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.destinations enable row level security;
alter table public.treks enable row level security;
alter table public.profiles enable row level security;
alter table public.wishlists enable row level security;
alter table public.admins enable row level security;
create policy "Public destinations" on public.destinations for select using (true);
create policy "Published catalog" on public.treks for select using (status = 'published');
create policy "Own profile read" on public.profiles for select to authenticated using (auth.uid()=user_id);
create policy "Own profile insert" on public.profiles for insert to authenticated with check (auth.uid()=user_id);
create policy "Own profile update" on public.profiles for update to authenticated using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "Own wishlist read" on public.wishlists for select to authenticated using (auth.uid()=user_id);
create policy "Own wishlist insert" on public.wishlists for insert to authenticated with check (auth.uid()=user_id and exists(select 1 from public.treks where id=trek_id and status='published'));
create policy "Own wishlist update" on public.wishlists for update to authenticated using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "Own wishlist delete" on public.wishlists for delete to authenticated using (auth.uid()=user_id);
create policy "Read own admin membership" on public.admins for select to authenticated using (auth.uid()=user_id);
create policy "Admins manage treks" on public.treks for all to authenticated using (exists(select 1 from public.admins where user_id=auth.uid())) with check (exists(select 1 from public.admins where user_id=auth.uid()));
create policy "Admins manage destinations" on public.destinations for all to authenticated using (exists(select 1 from public.admins where user_id=auth.uid())) with check (exists(select 1 from public.admins where user_id=auth.uid()));
create index treks_destination_idx on public.treks(destination_id);
create index treks_difficulty_idx on public.treks(difficulty);
create index treks_status_idx on public.treks(status);
create or replace function public.create_profile() returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into public.profiles(user_id,full_name) values (new.id,coalesce(new.raw_user_meta_data->>'full_name','')) on conflict(user_id) do nothing;
 return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.create_profile();
revoke all on function public.create_profile() from public;
commit;
