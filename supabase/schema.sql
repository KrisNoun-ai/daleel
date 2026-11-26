-- Daleel (دليل) Production PostgreSQL / Supabase Schema
-- Run in Supabase SQL Editor when connecting a cloud Postgres instance.

create table if not exists cohorts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  join_code text unique not null,
  active_blueprint_json jsonb not null,
  created_at timestamptz default now()
);

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid references cohorts(id) on delete cascade,
  name text not null,
  role text check (role in ('student', 'teacher', 'parent')) not null,
  pod_name text,
  linked_student_id uuid references profiles(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists claim_artifacts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references profiles(id) on delete cascade,
  blueprint_id text not null,
  level_number int not null,
  claim_text text not null,
  created_at timestamptz default now()
);

create table if not exists mentor_messages (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references profiles(id) on delete cascade,
  level_number int not null,
  persona text not null,
  sender text check (sender in ('user', 'assistant')) not null,
  text text not null,
  is_teacher_hint boolean default false,
  created_at timestamptz default now()
);

create table if not exists help_requests (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid references cohorts(id) on delete cascade,
  student_id uuid references profiles(id) on delete cascade,
  level_number int not null,
  message text not null,
  priority text default 'normal',
  status text check (status in ('pending', 'resolved')) default 'pending',
  created_at timestamptz default now()
);

create table if not exists viva_submissions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references profiles(id) on delete cascade,
  level_number int not null,
  transcript text not null,
  duration_seconds int not null,
  evaluation_json jsonb not null,
  created_at timestamptz default now()
);

create table if not exists discussion_posts (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid references cohorts(id) on delete cascade,
  author_id uuid references profiles(id) on delete cascade,
  topic text not null,
  badge text not null,
  content text not null,
  likes int default 0,
  created_at timestamptz default now()
);

-- Enable Realtime on help_requests and discussion_posts:
-- alter publication supabase_realtime add table help_requests, discussion_posts;
