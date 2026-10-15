export type AdCategory = 'for_sale' | 'to_buy' | 'services' | 'lost_found';

export type FilterCategory = 'all' | AdCategory;

export type AdStatus = 'active' | 'pending' | 'rejected' | 'sold';

export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  full_name: string;
  email?: string;
  phone_number: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  is_blocked?: boolean;
}

export interface AdItem {
  id: string;
  user_id?: string;
  title: string;
  description: string;
  category: AdCategory;
  price?: number | null;
  isNegotiable?: boolean;
  whatsapp: string;
  location: string;
  images: string[];
  status: AdStatus;
  createdAt: string; // ISO date string
  viewsCount: number;
  isFeatured?: boolean;
  subCategory?: string;
  contactName?: string;
}

export interface CustomButton {
  id: string;
  label: string;
  url: string;
  icon: string;
  color: 'teal' | 'emerald' | 'blue' | 'amber' | 'rose' | 'slate';
  is_external: boolean;
  is_visible: boolean;
}

export interface SiteSettings {
  id: string;
  platform_title: string;
  platform_subtitle: string;
  banner_text: string;
  custom_buttons: CustomButton[];
  require_admin_approval: boolean;
  custom_locations: string[];
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  bucketName: string;
  tableName: string;
  isConnected: boolean;
}
