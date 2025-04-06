# CalDo - Task Management Application

A modern task management application built with Next.js, Supabase, and Tailwind CSS.

🌐 **[View Live Demo](https://learn2shares.github.io/CalDo/)**

## Features

- ✅ Create, edit, delete, and mark tasks as completed
- 📝 Tasks include title, description, due date, priority flag
- 📋 Add subtasks and categorize tasks (Personal, Work, etc.)
- 📅 Calendar view to manage and visualize tasks
- 📊 Statistics dashboard with task completion metrics
- 🔔 Multiple reminder options:
  - Push notifications
  - Email notifications
  - WhatsApp notifications (via Twilio)
- 🎨 Clean, modern UI with dark mode support
- 📱 Responsive design for both mobile and web

## Deployment
This application is deployed on Vercel. You can access it at:
[CalDo App](https://cal-do.vercel.app)

## Tech Stack

- Frontend:
  - React Native / Expo
  - TypeScript
  - TailwindCSS (via NativeWind)
  - Expo Notifications
- Backend:
  - Supabase (Authentication, Database, Storage)
  - Supabase Edge Functions (for notifications)
- Deployment:
  - GitHub Pages (Web)
  - Expo (Mobile)

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Supabase account
- (Optional) Twilio account for WhatsApp notifications

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/learn2shares/CalDo.git
cd CalDo
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up Supabase:
   - Create a new Supabase project
   - Run the database migrations (SQL files provided in `/supabase/migrations`)
   - Set up authentication providers as needed

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Database Schema

```sql
-- Tasks table
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

-- Subtasks table
create table public.subtasks (
  id uuid default uuid_generate_v4() primary key,
  task_id uuid references public.tasks on delete cascade,
  title text not null,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Reminders table
create table public.reminders (
  id uuid default uuid_generate_v4() primary key,
  task_id uuid references public.tasks on delete cascade,
  remind_at timestamp with time zone not null,
  type text check (type in ('email', 'push', 'whatsapp')),
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Expo](https://expo.dev/)
- [Supabase](https://supabase.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [React Native](https://reactnative.dev/) 