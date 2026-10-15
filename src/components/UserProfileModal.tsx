import React, { useState } from 'react';
import { X, User, Phone, Mail, Edit3, Trash2, CheckCircle2, PauseCircle, PlayCircle, Tag, ShoppingBag, Eye, ExternalLink, LogOut, ShieldCheck } from 'lucide-react';
import { UserProfile, AdItem, AdStatus } from '../types';
import { updateProfile, setCurrentUser } from '../services/supabase';
import { formatPrice, formatRelativeTime } from '../services/storage';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  ads: AdItem[];
  onUpdateUser: (updated: UserProfile) => void;
  onDeleteAd: (id: string) => void;
  onToggleAdStatus: (id: string, newStatus: AdStatus) => void;
  onEditAd: (ad: AdItem) => void;
  onLogout: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  ads,
  onUpdateUser,
  onDeleteAd,
  onToggleAdStatus,
  onEditAd,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'my_ads' | 'edit_profile'>('my_ads');
  
  // Profile edit state
  const [fullName, setFullName] = useState(user.full_name);
  const [phoneNumber, setPhoneNumber] = useState(user.phone_number);
  const [email, setEmail] = useState(user.email || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  // Filter ads belonging to this user
  const userAds = ads.filter((a) => a.user_id === user.id || a.whatsapp === user.phone_number);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = updateProfile(user.id, {
      full_name: fullName.trim(),
      phone_number: phoneNumber.trim(),
      email: email.trim() || undefined,
      avatar_url: avatarUrl.trim() || user.avatar_url
    });
    if (updated) {
      onUpdateUser(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-right">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-teal-800 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 overflow-hidden flex items-center justify-center">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">{user.full_name}</h2>
                {user.role === 'admin' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    أدمن
                  </span>
                )}
              </div>
              <p className="text-xs text-teal-200" dir="ltr">{user.phone_number}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-lg bg-rose-700/80 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="تسجيل الخروج"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">خروج</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-teal-200 hover:text-white hover:bg-teal-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 pt-2 bg-slate-50 gap-4">
          <button
            onClick={() => setActiveTab('my_ads')}
            className={`py-3 px-2 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'my_ads'
                ? 'border-teal-700 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>إعلاناتي ({userAds.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('edit_profile')}
            className={`py-3 px-2 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'edit_profile'
                ? 'border-teal-700 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>تعديل البيانات الشخصية</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* TAB 1: MY ADS */}
          {activeTab === 'my_ads' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>قائمة الإعلانات التي قمت بنشرها على بازار حمام التركمان:</span>
                <span className="font-semibold text-teal-800">{userAds.length} إعلان</span>
              </div>

              {userAds.length === 0 ? (
                <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6">
                  <ShoppingBag className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="text-sm font-bold text-slate-600 mb-1">لم تقم بنشر أي إعلانات بعد</p>
                  <p className="text-xs text-slate-400">يمكنك إضافة إعلانك الأول بالضغط على زر "+ أضف إعلانك" في أعلى الصفحة.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userAds.map((ad) => (
                    <div
                      key={ad.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      {/* Ad Details */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {ad.images && ad.images.length > 0 ? (
                          <img
                            src={ad.images[0]}
                            alt={ad.title}
                            className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                            <Tag className="w-6 h-6" />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-slate-900 text-sm truncate">{ad.title}</h4>
                            
                            {/* Status Badge */}
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                ad.status === 'active'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ad.status === 'sold'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {ad.status === 'active' ? 'نشط' : ad.status === 'sold' ? 'تم البيع' : 'متوقف'}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                            <span className="font-bold text-teal-800 font-mono">{formatPrice(ad.price)}</span>
                            <span>·</span>
                            <span>{ad.location}</span>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5 text-slate-400" />
                              <span>{ad.viewsCount} مشاهدة</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Controls: Edit, Status toggle, Delete */}
                      <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                        
                        {/* Status Toggle Button (إيقاف / تنشيط الإعلان) */}
                        <button
                          onClick={() => {
                            const newSt = ad.status === 'active' ? 'sold' : 'active';
                            onToggleAdStatus(ad.id, newSt);
                          }}
                          className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
                            ad.status === 'active'
                              ? 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          }`}
                          title={ad.status === 'active' ? 'تحديد كـ "تم البيع / متوقف"' : 'إعادة تفعيل الإعلان'}
                        >
                          {ad.status === 'active' ? (
                            <>
                              <PauseCircle className="w-4 h-4 text-amber-600" />
                              <span className="hidden md:inline">إيقاف</span>
                            </>
                          ) : (
                            <>
                              <PlayCircle className="w-4 h-4 text-emerald-600" />
                              <span className="hidden md:inline">تنشيط</span>
                            </>
                          )}
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => onEditAd(ad)}
                          className="p-2 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="تعديل الإعلان"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span className="hidden md:inline">تعديل</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => {
                            if (confirm(`هل أنت متأكد من حذف إعلان: "${ad.title}"؟`)) {
                              onDeleteAd(ad.id);
                            }
                          }}
                          className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="حذف الإعلان"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EDIT PROFILE */}
          {activeTab === 'edit_profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg mx-auto">
              
              {saveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>تم حفظ وتحديث بياناتك الشخصية بنجاح!</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  الاسم الكامل <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pr-10 pl-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-slate-900 text-sm font-medium"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  رقم الجوال (المستخدم للتواصل المباشر عبر واتساب) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pr-10 pl-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-slate-900 text-sm font-mono"
                    dir="ltr"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">يُربط هذا الرقم مباشرة بأزرار المحادثة الفورية على إعلاناتك.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pr-10 pl-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-slate-900 text-sm"
                    dir="ltr"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  رابط الصورة الشخصية (اختياري)
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-slate-900 text-xs font-mono"
                  dir="ltr"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
                >
                  حفظ التعديلات
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
