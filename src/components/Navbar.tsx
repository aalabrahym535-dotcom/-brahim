import React from 'react';
import { PlusCircle, Heart, Store, Database, MapPin, User, ShieldCheck, LogIn, ExternalLink, Settings } from 'lucide-react';
import { UserProfile, CustomButton } from '../types';

interface NavbarProps {
  onOpenCreateModal: () => void;
  favoritesCount: number;
  onToggleFavoritesOnly: () => void;
  showFavoritesOnly: boolean;
  onOpenSupabaseModal: () => void;
  isSupabaseConnected: boolean;
  currentUser: UserProfile | null;
  onOpenAuthModal: () => void;
  onOpenProfileModal: () => void;
  onOpenAdminModal: () => void;
  customButtons?: CustomButton[];
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCreateModal,
  favoritesCount,
  onToggleFavoritesOnly,
  showFavoritesOnly,
  onOpenSupabaseModal,
  isSupabaseConnected,
  currentUser,
  onOpenAuthModal,
  onOpenProfileModal,
  onOpenAdminModal,
  customButtons = []
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-3 sm:gap-4">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-teal-700 flex items-center justify-center text-white shadow-sm ring-2 ring-teal-600/20 shrink-0">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-['Cairo',sans-serif]">
                  بازار حمام التركمان
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
                  <MapPin className="w-3 h-3 text-teal-600" />
                  ريف الرقة الشمالي - تل أبيض
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                سوقكم المحلي الإلكتروني للبيع والشراء والخدمات والمفقودات
              </p>
            </div>
          </div>

          {/* Dynamic Custom Buttons in Header */}
          <div className="hidden lg:flex items-center gap-2">
            {customButtons.filter(b => b.is_visible).slice(0, 2).map((btn) => (
              <a
                key={btn.id}
                href={btn.url}
                target={btn.is_external ? '_blank' : '_self'}
                rel="noreferrer"
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  btn.color === 'amber' ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100' :
                  btn.color === 'emerald' ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100' :
                  'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100'
                }`}
              >
                <span>{btn.label}</span>
                {btn.is_external && <ExternalLink className="w-3 h-3" />}
              </a>
            ))}
          </div>

          {/* Actions: Admin, Auth / Profile, Supabase, Favorites, Add Ad CTA */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* ADMIN DASHBOARD BUTTON (Visible if role is admin) */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={onOpenAdminModal}
                className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-slate-950 font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                title="فتح لوحة تحكم الأدمن"
              >
                <ShieldCheck className="w-4 h-4 text-slate-950" />
                <span className="hidden sm:inline">لوحة التحكم</span>
              </button>
            )}

            {/* Supabase status / config button */}
            <button
              onClick={onOpenSupabaseModal}
              title="إعدادات وقاعدة بيانات Supabase"
              className={`p-2.5 rounded-xl border text-xs font-medium transition-colors flex items-center gap-1.5 ${
                isSupabaseConnected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Database className="w-4 h-4 text-emerald-600" />
              <span className="hidden xl:inline">
                {isSupabaseConnected ? 'سحابة Supabase' : 'Supabase'}
              </span>
            </button>

            {/* User Profile or Login Button */}
            {currentUser ? (
              <button
                onClick={onOpenProfileModal}
                className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                title="حسابي وإعلاناتي"
              >
                <div className="w-5 h-5 rounded-full overflow-hidden bg-teal-100 flex items-center justify-center shrink-0">
                  {currentUser.avatar_url ? (
                    <img src={currentUser.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-teal-700" />
                  )}
                </div>
                <span className="hidden md:inline truncate max-w-[100px]">{currentUser.full_name}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-3 py-2 rounded-xl border border-teal-600 text-teal-800 bg-teal-50/60 hover:bg-teal-100/80 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="تسجيل الدخول / إنشاء حساب"
              >
                <LogIn className="w-4 h-4 text-teal-700" />
                <span>دخول</span>
              </button>
            )}

            {/* Saved / Favorites Button */}
            <button
              onClick={onToggleFavoritesOnly}
              className={`relative p-2.5 sm:px-3 sm:py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                showFavoritesOnly
                  ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title="الإعلانات المفضلة"
            >
              <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-rose-500 text-rose-500' : 'text-slate-500'}`} />
              <span className="hidden sm:inline">المفضلة</span>
              {favoritesCount > 0 && (
                <span className="bg-rose-600 text-white text-[10px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Primary Action Button: + أضف إعلانك */}
            <button
              onClick={onOpenCreateModal}
              className="px-3.5 py-2.5 sm:px-5 sm:py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 active:scale-[0.98] text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 text-teal-200" />
              <span className="whitespace-nowrap">+ أضف إعلانك</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
