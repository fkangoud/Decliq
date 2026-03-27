-- ============================================================
-- AUTOFLOW — Schéma Supabase complet
-- Copiez-collez ce fichier dans l'éditeur SQL de Supabase
-- ============================================================

-- Extension pour les UUIDs
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLE: users (profils enrichis)
-- ============================================================
create table if not exists public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  plan text not null default 'free' check (plan in ('free', 'pro', 'team')),
  stripe_customer_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS: chaque utilisateur ne voit que son profil
alter table public.users enable row level security;

create policy "users: lecture propre profil" on public.users
  for select using (auth.uid() = id);

create policy "users: modification propre profil" on public.users
  for update using (auth.uid() = id);

-- ============================================================
-- TABLE: workflows
-- ============================================================
create table if not exists public.workflows (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  description text,
  trigger text not null,
  trigger_config jsonb not null default '{}',
  actions jsonb not null default '[]',
  status text not null default 'active' check (status in ('active', 'paused', 'error')),
  run_count integer not null default 0,
  last_run_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.workflows enable row level security;

create policy "workflows: accès propriétaire" on public.workflows
  for all using (auth.uid() = user_id);

create index workflows_user_id_idx on public.workflows(user_id);

-- ============================================================
-- TABLE: executions
-- ============================================================
create table if not exists public.executions (
  id uuid default uuid_generate_v4() primary key,
  workflow_id uuid references public.workflows(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  status text not null default 'running' check (status in ('success', 'failed', 'running')),
  duration_ms integer,
  error_message text,
  logs jsonb not null default '[]',
  created_at timestamptz not null default now()
);

alter table public.executions enable row level security;

create policy "executions: accès propriétaire" on public.executions
  for all using (auth.uid() = user_id);

create index executions_workflow_id_idx on public.executions(workflow_id);
create index executions_user_id_idx on public.executions(user_id);
create index executions_created_at_idx on public.executions(created_at desc);

-- ============================================================
-- TABLE: subscriptions
-- ============================================================
create table if not exists public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null unique,
  stripe_subscription_id text unique,
  stripe_customer_id text,
  plan text not null,
  status text not null,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "subscriptions: lecture propre" on public.subscriptions
  for select using (auth.uid() = user_id);

-- ============================================================
-- TABLE: integrations
-- ============================================================
create table if not exists public.integrations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  provider text not null,
  access_token text not null,
  refresh_token text,
  expires_at timestamptz,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  unique(user_id, provider)
);

alter table public.integrations enable row level security;

create policy "integrations: accès propriétaire" on public.integrations
  for all using (auth.uid() = user_id);

-- ============================================================
-- FUNCTION: auto-créer le profil à l'inscription
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, email, full_name, plan)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'plan', 'free')
  );
  return new;
end;
$$;

-- Trigger sur auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- FUNCTION: updated_at automatique
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_workflows_updated_at before update on public.workflows
  for each row execute procedure public.set_updated_at();

create trigger set_users_updated_at before update on public.users
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- FUNCTION: incrémenter run_count à chaque exécution
-- ============================================================
create or replace function public.increment_workflow_run_count()
returns trigger language plpgsql security definer as $$
begin
  if new.status = 'success' or new.status = 'failed' then
    update public.workflows
    set
      run_count = run_count + 1,
      last_run_at = new.created_at,
      status = case when new.status = 'failed' then 'error' else status end
    where id = new.workflow_id;
  end if;
  return new;
end;
$$;

create trigger on_execution_completed
  after insert on public.executions
  for each row execute procedure public.increment_workflow_run_count();
