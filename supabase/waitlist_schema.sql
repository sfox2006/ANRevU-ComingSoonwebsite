create extension if not exists pgcrypto;

create table if not exists public.anrevu_waitlist (
  id uuid primary key default gen_random_uuid(),
  name text default '',
  email text not null,
  is_anu_student boolean default false,
  source text default 'coming-soon',
  created_at timestamptz default timezone('utc', now()),
  constraint anrevu_waitlist_email_not_empty check (length(trim(email)) > 0)
);

create unique index if not exists anrevu_waitlist_email_unique_idx
  on public.anrevu_waitlist (lower(email));

alter table public.anrevu_waitlist enable row level security;

drop policy if exists "Allow public waitlist inserts" on public.anrevu_waitlist;

create policy "Allow public waitlist inserts"
  on public.anrevu_waitlist
  for insert
  to anon
  with check (
    length(trim(email)) > 0
    and coalesce(source, 'coming-soon') = 'coming-soon'
  );
