begin;

alter table public.nutrition_stats enable row level security;
alter table public.workouts enable row level security;
alter table public.nutrition_goals enable row level security;

-- Required by the Python chatbot's Supabase-backed vector store.
create extension if not exists vector with schema extensions;

drop policy if exists "Users can read own nutrition stats"
on public.nutrition_stats;

create policy "Users can read own nutrition stats"
on public.nutrition_stats
for select
to authenticated
using ((auth.jwt() ->> 'sub') = user_id::text);

drop policy if exists "Users can insert own nutrition stats"
on public.nutrition_stats;

create policy "Users can insert own nutrition stats"
on public.nutrition_stats
for insert
to authenticated
with check ((auth.jwt() ->> 'sub') = user_id::text);

drop policy if exists "Users can update own nutrition stats"
on public.nutrition_stats;

create policy "Users can update own nutrition stats"
on public.nutrition_stats
for update
to authenticated
using ((auth.jwt() ->> 'sub') = user_id::text)
with check ((auth.jwt() ->> 'sub') = user_id::text);

drop policy if exists "Users can read own workouts"
on public.workouts;

create policy "Users can read own workouts"
on public.workouts
for select
to authenticated
using ((auth.jwt() ->> 'sub') = user_id::text);

drop policy if exists "Users can insert own workouts"
on public.workouts;

create policy "Users can insert own workouts"
on public.workouts
for insert
to authenticated
with check ((auth.jwt() ->> 'sub') = user_id::text);

drop policy if exists "Users can read own nutrition goals"
on public.nutrition_goals;

create policy "Users can read own nutrition goals"
on public.nutrition_goals
for select
to authenticated
using ((auth.jwt() ->> 'sub') = user_id::text);

commit;