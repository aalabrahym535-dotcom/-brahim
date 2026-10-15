/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  PlusCircle, ShoppingBag, CheckCircle, Search, Sparkles, Filter, X, Heart, Shield,
  RefreshCw, ShieldCheck, LogIn, User, ExternalLink
} from 'lucide-react';
import { AdItem, FilterCategory, SupabaseConfig, UserProfile, SiteSettings, AdStatus } from './types';
import {
  fetchAllAds,
  insertAd,
  updateAd,
  deleteAd,
  incrementViews,
  getFavoriteIds,
  toggleFavoriteId,
  getMyAdIds,
  HERO_IMAGE
} from './services/storage';
import {
  getCurrentUser,
  setCurrentUser,
  getAllProfiles,
  saveProfiles,
  updateProfile,
  getSiteSettings,
  saveSiteSettings
} from './services/supabase';
import { Navbar } from './components/Navbar';
import { FeatureStrip } from './components/FeatureStrip';
import { SearchAndFilters } from './components/SearchAndFilters';
import { AdCard } from './components/AdCard';
import { AdDetailModal } from './components/AdDetailModal';
import { CreateAdModal } from './components/CreateAdModal';
import { EditAdModal } from './components/EditAdModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { SupabaseModal } from './components/SupabaseModal';
import { Footer } from './components/Footer';

export default function App() {
  const [ads, setAds] = useState<AdItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');
  const [selectedLocation, setSelectedLocation] = useState('جميع المناطق');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');

  // User & Profiles state
  const [currentUser, setLocalCurrentUser] = useState<UserProfile | null>(null);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  
  // Site settings state
  const [siteSettings, setLocalSiteSettings] = useState<SiteSettings>(getSiteSettings());

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAdForDetail, setSelectedAdForDetail] = useState<AdItem | null>(null);
  const [editingAd, setEditingAd] = useState<AdItem | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  // Favorites & My Ads
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [myAdIds, setMyAdIds] = useState<string[]>([]);
  const [showMyAdsOnly, setShowMyAdsOnly] = useState(false);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Supabase connection state
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(() => {
    try {
      const saved = localStorage.getItem('bazar_hamam_supabase_cfg');
      return saved ? JSON.parse(saved) : { url: '', anonKey: '', bucketName: 'bazar-images', tableName: 'ads', isConnected: false };
    } catch {
      return { url: '', anonKey: '', bucketName: 'bazar-images', tableName: 'ads', isConnected: false };
    }
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Initial load
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const loadedAds = await fetchAllAds();
      setAds(loadedAds);
      setFavoriteIds(getFavoriteIds());
      setMyAdIds(getMyAdIds());
      setLocalCurrentUser(getCurrentUser());
      setProfiles(getAllProfiles());
      setLocalSiteSettings(getSiteSettings());
      setLoading(false);
    }
    loadData();
  }, []);

  // Auth handler
  const handleAuthSuccess = (user: UserProfile) => {
    setLocalCurrentUser(user);
    setProfiles(getAllProfiles());
    showToast(`مرحباً بك، ${user.full_name}! تم تسجيل الدخول بنجاح.`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLocalCurrentUser(null);
    setIsProfileModalOpen(false);
    setIsAdminModalOpen(false);
    showToast('تم تسجيل الخروج بنجاح.');
  };

  // Handle create ad
  const handleCreateAd = async (newAd: AdItem) => {
    await insertAd(newAd);
    setAds((prev) => [newAd, ...prev]);
    setMyAdIds((prev) => [newAd.id, ...prev]);
    if (newAd.status === 'pending') {
      showToast('تم إرسال إعلانك للمراجعة وسينشر فور موافقة الأدمن.');
    } else {
      showToast('تم نشر إعلانك بنجاح في بازار حمام التركمان!');
    }
  };

  // Handle edit ad
  const handleSaveEditAd = async (id: string, updates: Partial<AdItem>) => {
    await updateAd(id, updates);
    setAds((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    if (selectedAdForDetail && selectedAdForDetail.id === id) {
      setSelectedAdForDetail({ ...selectedAdForDetail, ...updates });
    }
    showToast('تم تحديث الإعلان بنجاح!');
  };

  // Handle delete ad
  const handleDeleteAd = async (id: string) => {
    await deleteAd(id);
    setAds((prev) => prev.filter((a) => a.id !== id));
    setMyAdIds((prev) => prev.filter((myId) => myId !== id));
    if (selectedAdForDetail?.id === id) {
      setSelectedAdForDetail(null);
    }
    showToast('تم حذف الإعلان بنجاح.');
  };

  // Handle toggle ad status (active / sold / pending)
  const handleToggleAdStatus = async (id: string, newStatus: AdStatus) => {
    await updateAd(id, { status: newStatus });
    setAds((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
    showToast(`تم تغيير حالة الإعلان إلى: ${newStatus === 'active' ? 'نشط' : newStatus === 'sold' ? 'تم البيع' : 'متوقف'}`);
  };

  // Admin: Approve ad
  const handleApproveAd = async (id: string) => {
    await updateAd(id, { status: 'active' });
    setAds((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'active' } : a)));
    showToast('تمت الموافقة على الإعلان ونشره للعامة.');
  };

  // Admin: Reject ad
  const handleRejectAd = async (id: string) => {
    await updateAd(id, { status: 'rejected' });
    setAds((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'rejected' } : a)));
    showToast('تم رفض / إيقاف الإعلان.');
  };

  // Admin: User role update
  const handleUpdateUserRole = (id: string, newRole: 'admin' | 'user') => {
    const updated = updateProfile(id, { role: newRole });
    if (updated) {
      setProfiles(getAllProfiles());
      if (currentUser?.id === id) {
        setLocalCurrentUser(updated);
      }
      showToast(`تم تحديث رتبة المستخدم إلى ${newRole === 'admin' ? 'أدمن' : 'مستخدم عادي'}.`);
    }
  };

  // Admin: User block toggle
  const handleToggleUserBlock = (id: string) => {
    const target = profiles.find((p) => p.id === id);
    if (!target) return;
    const updated = updateProfile(id, { is_blocked: !target.is_blocked });
    if (updated) {
      setProfiles(getAllProfiles());
      showToast(updated.is_blocked ? 'تم حظر المستخدم.' : 'تم فك حظر المستخدم.');
    }
  };

  // Admin: Save Site Settings
  const handleSaveSiteSettings = (newSettings: SiteSettings) => {
    saveSiteSettings(newSettings);
    setLocalSiteSettings(newSettings);
    showToast('تم حفظ إعدادات الموقع وتخصيصات الأزرار بنجاح!');
  };

  // Handle toggle favorite
  const handleToggleFavorite = (id: string) => {
    const isNowFav = toggleFavoriteId(id);
    setFavoriteIds(getFavoriteIds());
    showToast(isNowFav ? 'تمت إضافة الإعلان إلى المفضلة' : 'تمت إزالة الإعلان من المفضلة');
  };

  // Open detail view and increment views
  const handleOpenDetail = (ad: AdItem) => {
    setSelectedAdForDetail(ad);
    incrementViews(ad.id);
    setAds((prev) =>
      prev.map((item) =>
        item.id === ad.id ? { ...item, viewsCount: (item.viewsCount || 0) + 1 } : item
      )
    );
  };

  // Filter and sort ads for public marketplace view
  const filteredAds = useMemo(() => {
    let result = [...ads];

    // Status filter: Public visitors only see 'active' ads.
    // If currentUser is admin or owns the ad, they can see pending/sold
    result = result.filter((ad) => {
      if (currentUser?.role === 'admin') return true;
      if (currentUser && (ad.user_id === currentUser.id || ad.whatsapp === currentUser.phone_number)) return true;
      return ad.status === 'active';
    });

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((ad) => ad.category === selectedCategory);
    }

    // Location filter
    if (selectedLocation !== 'جميع المناطق') {
      result = result.filter((ad) => ad.location.includes(selectedLocation) || selectedLocation.includes(ad.location));
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (ad) =>
          ad.title.toLowerCase().includes(q) ||
          ad.description.toLowerCase().includes(q) ||
          ad.location.toLowerCase().includes(q) ||
          (ad.subCategory && ad.subCategory.toLowerCase().includes(q))
      );
    }

    // Filter by Favorites
    if (showFavoritesOnly) {
      result = result.filter((ad) => favoriteIds.includes(ad.id));
    }

    // Filter by My Ads
    if (showMyAdsOnly) {
      result = result.filter((ad) =>
        (currentUser && (ad.user_id === currentUser.id || ad.whatsapp === currentUser.phone_number)) ||
        myAdIds.includes(ad.id)
      );
    }

    // Sorting
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'price_asc') {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return result;
  }, [ads, selectedCategory, selectedLocation, searchQuery, showFavoritesOnly, showMyAdsOnly, sortBy, favoriteIds, myAdIds, currentUser]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-['Cairo',sans-serif]" dir="rtl">
      
      {/* 1. Header Navigation */}
      <Navbar
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        favoritesCount={favoriteIds.length}
        onToggleFavoritesOnly={() => {
          setShowFavoritesOnly((prev) => !prev);
          setShowMyAdsOnly(false);
        }}
        showFavoritesOnly={showFavoritesOnly}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        isSupabaseConnected={supabaseConfig.isConnected}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        customButtons={siteSettings.custom_buttons}
      />

      {/* 2. Top Feature Strip */}
      <FeatureStrip customBannerText={siteSettings.banner_text} />

      {/* 3. Hero Visual Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white border-b border-teal-950">
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_IMAGE}
            alt={siteSettings.platform_title}
            className="w-full h-full object-cover opacity-25 scale-105 filter blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-teal-950/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="max-w-2xl space-y-4">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>المنصة الرسمية المفتوحة لريف تل أبيض وحمام التركمان</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {siteSettings.platform_title} - سوقكم المحلي
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              {siteSettings.platform_subtitle}
            </p>

            {/* Quick CTAs and Admin notice */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-lg hover:shadow-teal-500/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <PlusCircle className="w-5 h-5" />
                <span>+ أضف إعلانك مجاناً الآن</span>
              </button>

              {currentUser ? (
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="px-4 py-3 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <User className="w-4 h-4 text-teal-300" />
                  <span>إعلاناتي وحسابي</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-4 py-3 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-teal-300" />
                  <span>تسجيل الدخول / إنشاء حساب</span>
                </button>
              )}

              {/* Dynamic Buttons in Hero */}
              {siteSettings.custom_buttons?.filter((b) => b.is_visible).map((b) => (
                <a
                  key={b.id}
                  href={b.url}
                  target={b.is_external ? '_blank' : '_self'}
                  rel="noreferrer"
                  className="px-3.5 py-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <span>{b.label}</span>
                  {b.is_external && <ExternalLink className="w-3 h-3 text-slate-400" />}
                </a>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 4. Main Marketplace Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Active Filter Notice if Favorites or My Ads is active */}
        {(showFavoritesOnly || showMyAdsOnly) && (
          <div className="mb-4 p-3.5 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-teal-900 text-xs sm:text-sm font-bold">
              {showFavoritesOnly ? (
                <>
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  <span>عرض الإعلانات المحفوظة في المفضلة ({filteredAds.length})</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-teal-700" />
                  <span>عرض إعلاناتك الخاصة ({filteredAds.length})</span>
                </>
              )}
            </div>
            <button
              onClick={() => {
                setShowFavoritesOnly(false);
                setShowMyAdsOnly(false);
              }}
              className="text-xs text-teal-800 hover:text-teal-950 font-bold flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-teal-300 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>إلغاء التصفية وعرض الكل</span>
            </button>
          </div>
        )}

        {/* Search & Category Filter Bar */}
        <SearchAndFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedLocation={selectedLocation}
          onSelectLocation={setSelectedLocation}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalResults={filteredAds.length}
        />

        {/* Loading State */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <RefreshCw className="w-8 h-8 text-teal-600 animate-spin mb-3" />
            <p className="text-sm font-bold text-slate-600">جارٍ تحميل إعلانات بازار حمام التركمان...</p>
          </div>
        ) : filteredAds.length > 0 ? (
          /* Ads Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredAds.map((ad) => (
              <AdCard
                key={ad.id}
                ad={ad}
                isFavorite={favoriteIds.includes(ad.id)}
                onToggleFavorite={handleToggleFavorite}
                onClick={handleOpenDetail}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center mx-auto mb-4 text-teal-700">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              لم نعثر على إعلانات تطابق بحثك
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              جرّب تغيير كلمات البحث أو اختيار فئة "الكل"، أو كن أول من يضيف إعلاناً في بلدة حمام التركمان!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedLocation('جميع المناطق');
                  setShowFavoritesOnly(false);
                  setShowMyAdsOnly(false);
                }}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                إعادة ضبط البحث
              </button>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                + أضف إعلانك الآن
              </button>
            </div>
          </div>
        )}

      </main>

      {/* 5. Footer */}
      <Footer />

      {/* Modals */}
      <CreateAdModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateAd}
        currentUser={currentUser}
        requireAdminApproval={siteSettings.require_admin_approval}
      />

      <EditAdModal
        ad={editingAd}
        isOpen={Boolean(editingAd)}
        onClose={() => setEditingAd(null)}
        onSave={handleSaveEditAd}
      />

      <AdDetailModal
        ad={selectedAdForDetail}
        isOpen={Boolean(selectedAdForDetail)}
        onClose={() => setSelectedAdForDetail(null)}
        isFavorite={selectedAdForDetail ? favoriteIds.includes(selectedAdForDetail.id) : false}
        onToggleFavorite={handleToggleFavorite}
        isMyAd={
          Boolean(selectedAdForDetail && (
            (currentUser && (selectedAdForDetail.user_id === currentUser.id || selectedAdForDetail.whatsapp === currentUser.phone_number)) ||
            myAdIds.includes(selectedAdForDetail.id)
          ))
        }
        onDeleteAd={handleDeleteAd}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {currentUser && (
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          user={currentUser}
          ads={ads}
          onUpdateUser={(updated) => {
            setLocalCurrentUser(updated);
            setProfiles(getAllProfiles());
            showToast('تم تحديث بياناتك الشخصية بنجاح.');
          }}
          onDeleteAd={handleDeleteAd}
          onToggleAdStatus={handleToggleAdStatus}
          onEditAd={(ad) => setEditingAd(ad)}
          onLogout={handleLogout}
        />
      )}

      {currentUser?.role === 'admin' && (
        <AdminDashboardModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          currentUser={currentUser}
          ads={ads}
          profiles={profiles}
          siteSettings={siteSettings}
          onApproveAd={handleApproveAd}
          onRejectAd={handleRejectAd}
          onDeleteAd={handleDeleteAd}
          onEditAd={(ad) => setEditingAd(ad)}
          onUpdateUserRole={handleUpdateUserRole}
          onToggleUserBlock={handleToggleUserBlock}
          onSaveSiteSettings={handleSaveSiteSettings}
        />
      )}

      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        config={supabaseConfig}
        onSaveConfig={(newCfg) => {
          setSupabaseConfig(newCfg);
          localStorage.setItem('bazar_hamam_supabase_cfg', JSON.stringify(newCfg));
          showToast('تم حفظ إعدادات Supabase بنجاح');
        }}
      />

      {/* Floating Action Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in slide-in-from-bottom duration-200 border border-slate-700">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
