import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile, SiteSettings, CustomButton } from '../types';

const CFG_KEY = 'bazar_hamam_supabase_cfg';
const AUTH_USER_KEY = 'bazar_hamam_auth_user';
const USERS_LIST_KEY = 'bazar_hamam_users_list';
const SITE_SETTINGS_KEY = 'bazar_hamam_site_settings';

// Default initial admin and demo user
export const INITIAL_PROFILES: UserProfile[] = [
  {
    id: 'user-admin-01',
    full_name: 'أدمن بازار حمام التركمان',
    email: 'admin@hamam-bazar.com',
    phone_number: '963944123456',
    role: 'admin',
    avatar_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=AdminHamam',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    is_blocked: false,
  },
  {
    id: 'user-02',
    full_name: 'أبو أحمد التركماني',
    email: 'abu.ahmad@example.com',
    phone_number: '963944654321',
    role: 'user',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AbuAhmad',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    is_blocked: false,
  },
  {
    id: 'user-03',
    full_name: 'الحاج مصطفى الزراعي',
    email: 'mustafa.agri@example.com',
    phone_number: '963988234567',
    role: 'user',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mustafa',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    is_blocked: false,
  }
];

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  id: 'default_settings',
  platform_title: 'بازار حمام التركمان',
  platform_subtitle: 'سوقكم المحلي الإلكتروني للبيع والشراء والخدمات والمفقودات',
  banner_text: 'أهلاً بكم في بازار حمام التركمان الإلكتروني - تواصل فوري ومباشر عبر واتساب بدون أي عمولة!',
  require_admin_approval: false,
  custom_buttons: [
    {
      id: 'btn-1',
      label: 'أسعار المحاصيل والصرف',
      url: 'https://t.me/',
      icon: 'dollar-sign',
      color: 'amber',
      is_external: true,
      is_visible: true,
    },
    {
      id: 'btn-2',
      label: 'قناة أخبار وتنبيهات البلدة',
      url: 'https://t.me/',
      icon: 'bell',
      color: 'teal',
      is_external: true,
      is_visible: true,
    },
    {
      id: 'btn-3',
      label: 'طوارئ وصيدليات المناوبة',
      url: '#emergency',
      icon: 'phone',
      color: 'emerald',
      is_external: false,
      is_visible: true,
    }
  ],
  custom_locations: [
    'جميع المناطق',
    'حمام التركمان الشمالي',
    'حمام التركمان الجنوبي',
    'حمام التركمان - السوق الرئيسي',
    'تل أبيض والريف',
    'ريف البليخ ومشروع الري',
    'قرى الجلاب'
  ]
};

// SQL Schema code with RLS for Supabase SQL Editor
export const COMPLETE_SUPABASE_SQL = `-- ========================================================
-- هيكل قاعدة بيانات بازار حمام التركمان على Supabase (SQL Schema)
-- يشتمل على: profiles, ads, site_settings مع سياسات الأمان RLS
-- ========================================================

-- 1. جدول ملفات المستخدمين (profiles)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  email text,
  phone_number text not null,
  role text default 'user' check (role in ('user', 'admin')),
  avatar_url text,
  is_blocked boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. جدول الإعلانات (ads)
create table if not exists public.ads (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  category text not null check (category in ('for_sale', 'to_buy', 'services', 'lost_found')),
  price numeric,
  is_negotiable boolean default true,
  whatsapp_phone text not null,
  images text[] default array[]::text[],
  location text not null,
  status text default 'active' check (status in ('active', 'pending', 'rejected', 'sold')),
  views_count integer default 0,
  contact_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. جدول إعدادات وتخصيص الموقع (site_settings)
create table if not exists public.site_settings (
  id text primary key default 'default_settings',
  platform_title text default 'بازار حمام التركمان',
  platform_subtitle text default 'سوقكم المحلي الإلكتروني',
  banner_text text not null,
  custom_buttons jsonb default '[]'::jsonb,
  categories_list jsonb default '[]'::jsonb,
  require_admin_approval boolean default false,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ========================================================
-- سياسات الأمان والحماية (Row Level Security - RLS)
-- ========================================================

-- تفعيل RLS للجداول
alter table public.profiles enable row level security;
alter table public.ads enable row level security;
alter table public.site_settings enable row level security;

-- سياسات profiles
create policy "الجميع يمكنهم قراءة الملفات الشخصية العامة"
  on public.profiles for select using (true);

create policy "المستخدم يمكنه تعديل ملفه الشخصي فقط"
  on public.profiles for update using (auth.uid() = id);

create policy "الأدمن يملك صلاحية كاملة على profiles"
  on public.profiles for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- سياسات ads
create policy "قراءة الإعلانات النشطة للجميع"
  on public.ads for select using (status = 'active' or auth.uid() = user_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "إضافة إعلان للمستخدمين المسجلين"
  on public.ads for insert with check (auth.uid() is not null);

create policy "المستخدم يمكنه تعديل وحذف إعلانه الخاص"
  on public.ads for update using (auth.uid() = user_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "المستخدم يمكنه حذف إعلانه الخاص"
  on public.ads for delete using (auth.uid() = user_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- سياسات site_settings
create policy "قراءة إعدادات الموقع للجميع"
  on public.site_settings for select using (true);

create policy "تعديل إعدادات الموقع للأدمن فقط"
  on public.site_settings for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ========================================================
-- تريجر لإنشاء profile تلقائياً عند تسجيل مستخدم جديد في Supabase Auth
-- ========================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, phone_number, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'مستخدم جديد'),
    new.email,
    coalesce(new.raw_user_meta_data->>'phone_number', ''),
    'user'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
`;

let clientInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (clientInstance) return clientInstance;
  try {
    const raw = localStorage.getItem(CFG_KEY);
    if (raw) {
      const cfg = JSON.parse(raw);
      if (cfg.url && cfg.anonKey) {
        clientInstance = createClient(cfg.url, cfg.anonKey);
        return clientInstance;
      }
    }
  } catch (err) {
    console.warn('Error reading Supabase client:', err);
  }
  return null;
}

// User profiles management
export function getAllProfiles(): UserProfile[] {
  try {
    const raw = localStorage.getItem(USERS_LIST_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  localStorage.setItem(USERS_LIST_KEY, JSON.stringify(INITIAL_PROFILES));
  return INITIAL_PROFILES;
}

export function saveProfiles(profiles: UserProfile[]): void {
  localStorage.setItem(USERS_LIST_KEY, JSON.stringify(profiles));
}

export function updateProfile(id: string, updates: Partial<UserProfile>): UserProfile | null {
  const list = getAllProfiles();
  const index = list.findIndex((u) => u.id === id);
  if (index === -1) return null;
  const updated = { ...list[index], ...updates };
  list[index] = updated;
  saveProfiles(list);

  // If currently active user, update active session
  const current = getCurrentUser();
  if (current && current.id === id) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updated));
  }
  return updated;
}

// Active session management
export function getCurrentUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: UserProfile | null): void {
  if (user) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_USER_KEY);
  }
}

// Site settings management
export function getSiteSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(SITE_SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(INITIAL_SITE_SETTINGS));
  return INITIAL_SITE_SETTINGS;
}

export function saveSiteSettings(settings: SiteSettings): void {
  localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(settings));
}
