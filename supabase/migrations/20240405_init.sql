-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create tasks table
create table public.tasks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  due_date timestamp with time zone not null,
  priority text check (priority in ('low', 'medium', 'high')),
  completed boolean default false,
  category text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create subtasks table
create table public.subtasks (
  id uuid default uuid_generate_v4() primary key,
  task_id uuid references public.tasks on delete cascade,
  title text not null,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create reminders table
create table public.reminders (
  id uuid default uuid_generate_v4() primary key,
  task_id uuid references public.tasks on delete cascade,
  remind_at timestamp with time zone not null,
  type text check (type in ('email', 'push', 'whatsapp')),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create indexes
create index tasks_user_id_idx on public.tasks(user_id);
create index tasks_due_date_idx on public.tasks(due_date);
create index subtasks_task_id_idx on public.subtasks(task_id);
create index reminders_task_id_idx on public.reminders(task_id);
create index reminders_remind_at_idx on public.reminders(remind_at);

-- Set up Row Level Security (RLS)
alter table public.tasks enable row level security;
alter table public.subtasks enable row level security;
alter table public.reminders enable row level security;

-- Create policies
create policy "Users can view their own tasks"
  on public.tasks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own tasks"
  on public.tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
  on public.tasks for update
  using (auth.uid() = user_id);

create policy "Users can delete their own tasks"
  on public.tasks for delete
  using (auth.uid() = user_id);

create policy "Users can view their own subtasks"
  on public.subtasks for select
  using (
    exists (
      select 1
      from public.tasks
      where tasks.id = subtasks.task_id
      and tasks.user_id = auth.uid()
    )
  );

create policy "Users can insert subtasks for their tasks"
  on public.subtasks for insert
  with check (
    exists (
      select 1
      from public.tasks
      where tasks.id = subtasks.task_id
      and tasks.user_id = auth.uid()
    )
  );

create policy "Users can update their own subtasks"
  on public.subtasks for update
  using (
    exists (
      select 1
      from public.tasks
      where tasks.id = subtasks.task_id
      and tasks.user_id = auth.uid()
    )
  );

create policy "Users can delete their own subtasks"
  on public.subtasks for delete
  using (
    exists (
      select 1
      from public.tasks
      where tasks.id = subtasks.task_id
      and tasks.user_id = auth.uid()
    )
  );

create policy "Users can view their own reminders"
  on public.reminders for select
  using (
    exists (
      select 1
      from public.tasks
      where tasks.id = reminders.task_id
      and tasks.user_id = auth.uid()
    )
  );

create policy "Users can insert reminders for their tasks"
  on public.reminders for insert
  with check (
    exists (
      select 1
      from public.tasks
      where tasks.id = reminders.task_id
      and tasks.user_id = auth.uid()
    )
  );

create policy "Users can update their own reminders"
  on public.reminders for update
  using (
    exists (
      select 1
      from public.tasks
      where tasks.id = reminders.task_id
      and tasks.user_id = auth.uid()
    )
  );

create policy "Users can delete their own reminders"
  on public.reminders for delete
  using (
    exists (
      select 1
      from public.tasks
      where tasks.id = reminders.task_id
      and tasks.user_id = auth.uid()
    )
  );

-- Create function to handle updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create trigger for updating timestamps
create trigger handle_tasks_updated_at
  before update on public.tasks
  for each row
  execute function public.handle_updated_at();

create trigger handle_subtasks_updated_at
  before update on public.subtasks
  for each row
  execute function public.handle_updated_at(); 