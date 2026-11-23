-- B-04: minimal private row for verifying signed-in writes and cross-account isolation.
-- This table is deliberately separate from the later attempts/progress schema.
create table public.private_spike_rows (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  note text not null check (char_length(note) between 1 and 200),
  created_at timestamptz not null default now()
);

create index private_spike_rows_owner_created_idx
  on public.private_spike_rows (owner_id, created_at desc);

alter table public.private_spike_rows enable row level security;

create policy "Owner can read private spike rows"
  on public.private_spike_rows for select to authenticated
  using ((select auth.uid()) = owner_id);

create policy "Owner can insert private spike rows"
  on public.private_spike_rows for insert to authenticated
  with check ((select auth.uid()) = owner_id);

revoke all on public.private_spike_rows from anon;
grant select, insert on public.private_spike_rows to authenticated;
