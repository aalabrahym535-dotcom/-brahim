import React, { useState } from 'react';
import {
  X, ShieldCheck, Users, ShoppingBag, LayoutTemplate, Database, Check, CheckCircle2,
  AlertTriangle, Trash2, Edit3, Plus, ExternalLink, Eye, UserCheck, UserX, Copy, RefreshCw, Sparkles, MessageCircle, Sliders
} from 'lucide-react';
import { AdItem, UserProfile, SiteSettings, CustomButton, AdStatus } from '../types';
import { COMPLETE_SUPABASE_SQL } from '../services/supabase';
import { formatPrice, formatRelativeTime } from '../services/storage';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  ads: AdItem[];
  profiles: UserProfile[];
  siteSettings: SiteSettings;
  onApproveAd: (id: string) => void;
  onRejectAd: (id: string) => void;
  onDeleteAd: (id: string) => void;
  onEditAd: (ad: AdItem) => void;
  onUpdateUserRole: (id: string, role: 'admin' | 'user') => void;
  onToggleUserBlock: (id: string) => void;
  onSaveSiteSettings: (settings: SiteSettings) => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  ads,
  profiles,
  siteSettings,
  onApproveAd,
  onRejectAd,
  onDeleteAd,
  onEditAd,
  onUpdateUserRole,
  onToggleUserBlock,
  onSaveSiteSettings
}) => {
  const [activeTab, setActiveTab] = useState<'kpi' | 'ads' | 'users' | 'ui_settings' | 'sql_schema'>('kpi');
  const [adFilterStatus, setAdFilterStatus] = useState<string>('all');
  const [adSearch, setAdSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);

  // Settings form state
  const [platformTitle, setPlatformTitle] = useState(siteSettings.platform_title);
  const [platformSubtitle, setPlatformSubtitle] = useState(siteSettings.platform_subtitle);
  const [bannerText, setBannerText] = useState(siteSettings.banner_text);
  const [requireApproval, setRequireApproval] = useState(siteSettings.require_admin_approval);
  const [customButtons, setCustomButtons] = useState<CustomButton[]>(siteSettings.custom_buttons || []);
  const [newBtnLabel, setNewBtnLabel] = useState('');
  const [newBtnUrl, setNewBtnUrl] = useState('');
  const [newBtnColor, setNewBtnColor] = useState<'teal' | 'emerald' | 'blue' | 'amber' | 'rose' | 'slate'>('teal');
  const [savedSettingsNotice, setSavedSettingsNotice] = useState(false);

  if (!isOpen) return null;

  // Protect Dashboard: Admin role only!
  if (currentUser.role !== 'admin') {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">غير مصرح بالدخول</h3>
          <p className="text-xs text-slate-500">
            هذه اللوحة مخصصة للأدمن فقط (حسابات role = 'admin'). يرجى تسجيل الدخول بحساب الأدمن.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
          >
            إغلاق
          </button>
        </div>
      </div>
    );
  }

  // Filter ads
  const filteredAds = ads.filter((ad) => {
    const matchStatus = adFilterStatus === 'all' || ad.status === adFilterStatus;
    const matchSearch = !adSearch.trim() || ad.title.toLowerCase().includes(adSearch.toLowerCase()) || ad.location.toLowerCase().includes(adSearch.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Filter users
  const filteredProfiles = profiles.filter((u) => {
    if (!userSearch.trim()) return true;
    const q = userSearch.toLowerCase();
    return u.full_name.toLowerCase().includes(q) || (u.email && u.email.toLowerCase().includes(q)) || u.phone_number.includes(q);
  });

  // KPIs
  const totalViews = ads.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);
  const activeAdsCount = ads.filter((a) => a.status === 'active').length;
  const pendingAdsCount = ads.filter((a) => a.status === 'pending').length;
  const soldAdsCount = ads.filter((a) => a.status === 'sold').length;

  const handleCopySql = () => {
    navigator.clipboard.writeText(COMPLETE_SUPABASE_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SiteSettings = {
      ...siteSettings,
      platform_title: platformTitle.trim(),
      platform_subtitle: platformSubtitle.trim(),
      banner_text: bannerText.trim(),
      require_admin_approval: requireApproval,
      custom_buttons: customButtons
    };
    onSaveSiteSettings(updated);
    setSavedSettingsNotice(true);
    setTimeout(() => setSavedSettingsNotice(false), 2000);
  };

  const handleAddButton = () => {
    if (!newBtnLabel.trim() || !newBtnUrl.trim()) return;
    const newBtn: CustomButton = {
      id: `btn-${Date.now()}`,
      label: newBtnLabel.trim(),
      url: newBtnUrl.trim(),
      icon: 'external-link',
      color: newBtnColor,
      is_external: newBtnUrl.startsWith('http'),
      is_visible: true
    };
    setCustomButtons([...customButtons, newBtn]);
    setNewBtnLabel('');
    setNewBtnUrl('');
  };

  const handleRemoveButton = (id: string) => {
    setCustomButtons(customButtons.filter((b) => b.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-right">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">لوحة تحكم الأدمن (Admin Dashboard)</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                  صلاحيات كاملة
                </span>
              </div>
              <p className="text-xs text-slate-400">إدارة بازار حمام التركمان، الإعلانات، المستخدمين، وتخصيص الموقع</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50 overflow-x-auto gap-2 sm:gap-4 shrink-0">
          <button
            onClick={() => setActiveTab('kpi')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'kpi' ? 'border-teal-700 text-teal-800' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>المؤشرات والإحصائيات</span>
          </button>

          <button
            onClick={() => setActiveTab('ads')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'ads' ? 'border-teal-700 text-teal-800' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>إدارة الإعلانات ({ads.length})</span>
            {pendingAdsCount > 0 && (
              <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {pendingAdsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'users' ? 'border-teal-700 text-teal-800' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>إدارة المستخدمين ({profiles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ui_settings')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'ui_settings' ? 'border-teal-700 text-teal-800' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutTemplate className="w-4 h-4" />
            <span>تخصيص الواجهة والأزرار</span>
          </button>

          <button
            onClick={() => setActiveTab('sql_schema')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'sql_schema' ? 'border-teal-700 text-teal-800' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-600" />
            <span>سكيما Supabase SQL و RLS</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* TAB 1: KPI & OVERVIEW */}
          {activeTab === 'kpi' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-teal-50 border border-teal-200">
                  <span className="text-xs text-teal-700 font-bold block mb-1">إجمالي الإعلانات</span>
                  <span className="text-2xl font-extrabold text-teal-900 font-mono">{ads.length}</span>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-xs text-emerald-700 font-bold block mb-1">إعلانات نشطة ومتاحة</span>
                  <span className="text-2xl font-extrabold text-emerald-900 font-mono">{activeAdsCount}</span>
                </div>
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <span className="text-xs text-amber-700 font-bold block mb-1">قيد المراجعة / متوقف</span>
                  <span className="text-2xl font-extrabold text-amber-900 font-mono">{pendingAdsCount + soldAdsCount}</span>
                </div>
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                  <span className="text-xs text-blue-700 font-bold block mb-1">المستخدمين المسجلين</span>
                  <span className="text-2xl font-extrabold text-blue-900 font-mono">{profiles.length}</span>
                </div>
              </div>

              {/* Views and Highlights */}
              <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-teal-400 mb-1">حركة التفاعل في سوق حمام التركمان</h4>
                  <p className="text-xs text-slate-300">
                    تم تسجيل أكثر من <strong className="text-white font-mono text-base">{totalViews}</strong> مشاهدة واستفسار عبر تطبيق واتساب المباشر.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('ads')}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shrink-0"
                >
                  فحص الإعلانات الآن
                </button>
              </div>

              {/* Safety notice for admin */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-600 space-y-1">
                <strong className="block text-slate-800 font-bold">صلاحيات الأدمن النشطة:</strong>
                <p>• يمكنك تعديل وحذف أي إعلان يخالف معايير مجتمع بلدة حمام التركمان.</p>
                <p>• يمكنك إضافة أزرار مخصصة في واجهة المستخدم (مثل أسعار المحاصيل، قنوات التلغرام، طوارئ البلدة).</p>
                <p>• يمكنك ترقية أو حظر أي مستخدم مباشرة من تبويب "إدارة المستخدمين".</p>
              </div>
            </div>
          )}

          {/* TAB 2: ADS MANAGEMENT */}
          {activeTab === 'ads' && (
            <div className="space-y-4">
              
              {/* Search & Filter bar for ads */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <input
                  type="text"
                  value={adSearch}
                  onChange={(e) => setAdSearch(e.target.value)}
                  placeholder="ابحث بالاسم أو المنطقة..."
                  className="px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-teal-600"
                />

                <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                  {['all', 'active', 'pending', 'sold', 'rejected'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setAdFilterStatus(st)}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                        adFilterStatus === st
                          ? 'bg-teal-700 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st === 'all' ? 'الكل' : st === 'active' ? 'نشطة' : st === 'pending' ? 'قيد المراجعة' : st === 'sold' ? 'مباعة' : 'مرفوضة'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table / List of Ads */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                      <tr>
                        <th className="py-3 px-4">الإعلان</th>
                        <th className="py-3 px-4">الفئة</th>
                        <th className="py-3 px-4">السعر</th>
                        <th className="py-3 px-4">المنطقة</th>
                        <th className="py-3 px-4">الحالة</th>
                        <th className="py-3 px-4">المعلن / الهاتف</th>
                        <th className="py-3 px-4 text-center">الإجراءات الإدارية</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredAds.map((ad) => (
                        <tr key={ad.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-900 max-w-xs truncate">
                            {ad.title}
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {ad.category === 'for_sale' ? 'للبيع' : ad.category === 'to_buy' ? 'للشراء' : ad.category === 'services' ? 'خدمات' : 'مفقودات'}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-teal-800">
                            {formatPrice(ad.price)}
                          </td>
                          <td className="py-3 px-4 text-slate-500">
                            {ad.location}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              ad.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ad.status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : ad.status === 'sold'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {ad.status === 'active' ? 'نشط' : ad.status === 'pending' ? 'قيد المراجعة' : ad.status === 'sold' ? 'مباع' : 'مرفوض'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-700" dir="ltr">
                            {ad.whatsapp}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* Quick Approve button if pending */}
                              {ad.status !== 'active' && (
                                <button
                                  onClick={() => onApproveAd(ad.id)}
                                  className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                                  title="موافقة وتنشيط"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Reject button */}
                              {ad.status !== 'rejected' && (
                                <button
                                  onClick={() => onRejectAd(ad.id)}
                                  className="p-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                                  title="إيقاف / رفض"
                                >
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Edit button */}
                              <button
                                onClick={() => onEditAd(ad)}
                                className="p-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200"
                                title="تعديل الإعلان"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete button */}
                              <button
                                onClick={() => {
                                  if (confirm(`حذف إعلان "${ad.title}" نهائياً من المنصة؟`)) {
                                    onDeleteAd(ad.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                                title="حذف نهائي"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: USERS MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              
              <div className="flex items-center justify-between gap-3">
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="ابحث بالاسم أو البريد أو الهاتف..."
                  className="px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-teal-600 max-w-sm"
                />
                <span className="text-xs text-slate-500 font-semibold">{filteredProfiles.length} مستخدم مسجل</span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                      <tr>
                        <th className="py-3 px-4">المستخدم</th>
                        <th className="py-3 px-4">رقم الهاتف (واتساب)</th>
                        <th className="py-3 px-4">البريد الإلكتروني</th>
                        <th className="py-3 px-4">الرتبة</th>
                        <th className="py-3 px-4">الحالة</th>
                        <th className="py-3 px-4 text-center">إجراءات الحساب</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProfiles.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                              {user.avatar_url ? (
                                <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center font-bold text-slate-500">
                                  {user.full_name[0]}
                                </div>
                              )}
                            </div>
                            <span>{user.full_name}</span>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-700" dir="ltr">
                            {user.phone_number}
                          </td>
                          <td className="py-3 px-4 text-slate-500" dir="ltr">
                            {user.email || '—'}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              user.role === 'admin'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {user.role === 'admin' ? '👑 أدمن مدير' : '👤 مستخدم عادي'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              user.is_blocked
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {user.is_blocked ? 'محظور' : 'نشط'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* Toggle Role: Admin / User */}
                              <button
                                onClick={() => {
                                  const newRole = user.role === 'admin' ? 'user' : 'admin';
                                  onUpdateUserRole(user.id, newRole);
                                }}
                                className="px-2 py-1 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-[11px] font-bold"
                                title="تغيير الرتبة"
                              >
                                {user.role === 'admin' ? 'تخفيض لمستخدم' : 'ترقية لأدمن'}
                              </button>

                              {/* Toggle Block account */}
                              <button
                                onClick={() => onToggleUserBlock(user.id)}
                                className={`p-1.5 rounded-lg border text-xs font-semibold ${
                                  user.is_blocked
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                    : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                                }`}
                                title={user.is_blocked ? 'فك الحظر' : 'حظر الحساب'}
                              >
                                {user.is_blocked ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: DYNAMIC UI & CUSTOM BUTTONS */}
          {activeTab === 'ui_settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-6">
              
              {savedSettingsNotice && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>تم حفظ وتحديث عناصر الواجهة والأزرار بنجاح!</span>
                </div>
              )}

              {/* Text settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    اسم المنصة في الهيدر
                  </label>
                  <input
                    type="text"
                    value={platformTitle}
                    onChange={(e) => setPlatformTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    الشعار الفرعي (Subtitle)
                  </label>
                  <input
                    type="text"
                    value={platformSubtitle}
                    onChange={(e) => setPlatformSubtitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  نص الشريط الترويجي والتنبيهات (Banner Text)
                </label>
                <textarea
                  rows={2}
                  value={bannerText}
                  onChange={(e) => setBannerText(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs leading-relaxed"
                />
              </div>

              {/* Requirement toggle */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-slate-900">موافقة الأدمن المسبقة على الإعلانات</span>
                  <span className="text-[11px] text-slate-500">إذا تم التفعيل، لن يظهر الإعلان للعامة حتى يوافق عليه الأدمن.</span>
                </div>
                <input
                  type="checkbox"
                  checked={requireApproval}
                  onChange={(e) => setRequireApproval(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded"
                />
              </div>

              {/* Dynamic Custom Buttons Manager */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800">
                    الأزرار والروابط المخصصة في الهيدر والواجهة (Dynamic Custom Buttons)
                  </h4>
                  <span className="text-[11px] text-slate-500">{customButtons.length} أزرار نشطة</span>
                </div>

                {/* Existing buttons list */}
                <div className="space-y-2">
                  {customButtons.map((btn) => (
                    <div
                      key={btn.id}
                      className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          btn.color === 'amber' ? 'bg-amber-100 text-amber-800' :
                          btn.color === 'emerald' ? 'bg-emerald-100 text-emerald-800' :
                          btn.color === 'blue' ? 'bg-blue-100 text-blue-800' : 'bg-teal-100 text-teal-800'
                        }`}>
                          {btn.label}
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]" dir="ltr">{btn.url}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveButton(btn.id)}
                        className="p-1 rounded-md text-rose-600 hover:bg-rose-50"
                        title="حذف هذا الزر"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new custom button */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <span className="text-xs font-bold text-slate-700 block">+ إضافة زر جديد</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="عنوان الزر (مثلاً: أسعار الذهب)"
                      value={newBtnLabel}
                      onChange={(e) => setNewBtnLabel(e.target.value)}
                      className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                    <input
                      type="text"
                      placeholder="الرابط (مثلاً: https://t.me/...)"
                      value={newBtnUrl}
                      onChange={(e) => setNewBtnUrl(e.target.value)}
                      className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                      dir="ltr"
                    />
                    <div className="flex gap-2">
                      <select
                        value={newBtnColor}
                        onChange={(e) => setNewBtnColor(e.target.value as any)}
                        className="px-2 py-2 bg-white border border-slate-300 rounded-lg text-xs flex-1"
                      >
                        <option value="teal">لون زيتي (Teal)</option>
                        <option value="amber">لون كهرماني (Amber)</option>
                        <option value="emerald">لون أخضر (Emerald)</option>
                        <option value="blue">لون أزرق (Blue)</option>
                      </select>
                      <button
                        type="button"
                        onClick={handleAddButton}
                        className="px-3 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>إضافة</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Save Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>حفظ إعدادات وتخصيصات الموقع</span>
                </button>
              </div>

            </form>
          )}

          {/* TAB 5: SQL SCHEMA & RLS FOR SUPABASE */}
          {activeTab === 'sql_schema' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">هيكل قاعدة بيانات Supabase وسياسات الأمان RLS</h4>
                  <p className="text-xs text-slate-500">
                    كود SQL المحدث والجاهز للنسخ إلى صفحة <strong>SQL Editor</strong> في لوحة تحكم مشروعك على Supabase.
                  </p>
                </div>

                <button
                  onClick={handleCopySql}
                  className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>تم النسخ للحافظة!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>نسخ كود SQL بالكامل</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-200 p-4 font-mono text-xs leading-relaxed max-h-[500px] overflow-y-auto" dir="ltr">
                <pre>{COMPLETE_SUPABASE_SQL}</pre>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
