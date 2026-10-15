import React, { useState } from 'react';
import { X, Mail, Phone, Lock, User, ShieldCheck, CheckCircle, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';
import { getAllProfiles, saveProfiles, setCurrentUser, getSupabaseClient } from '../services/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regAvatar, setRegAvatar] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = getSupabaseClient();
      if (supabase && loginMethod === 'email') {
        const { data, error: supaErr } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password: loginPassword
        });
        if (supaErr) {
          console.warn('Supabase auth failed, checking local profiles:', supaErr.message);
        } else if (data?.user) {
          // Success from Supabase
          const profile: UserProfile = {
            id: data.user.id,
            full_name: data.user.user_metadata?.full_name || loginEmail.split('@')[0],
            email: data.user.email,
            phone_number: data.user.user_metadata?.phone_number || '',
            role: data.user.email?.includes('admin') ? 'admin' : 'user',
            created_at: data.user.created_at,
          };
          setCurrentUser(profile);
          onAuthSuccess(profile);
          onClose();
          return;
        }
      }

      // Check local profiles
      const profiles = getAllProfiles();
      let matched: UserProfile | undefined;

      if (loginMethod === 'email') {
        matched = profiles.find((p) => p.email?.toLowerCase() === loginEmail.toLowerCase());
      } else {
        const cleanP = loginPhone.replace(/[^0-9]/g, '');
        matched = profiles.find((p) => p.phone_number.includes(cleanP));
      }

      if (matched) {
        if (matched.is_blocked) {
          setError('تم حظر هذا الحساب من قِبل إدارة المنصة.');
          setLoading(false);
          return;
        }
        setCurrentUser(matched);
        onAuthSuccess(matched);
        onClose();
      } else {
        // Fallback login: create on the fly if user entered email or phone
        const newProfile: UserProfile = {
          id: `user-${Date.now()}`,
          full_name: loginMethod === 'email' ? loginEmail.split('@')[0] : `مستخدم ${loginPhone}`,
          email: loginMethod === 'email' ? loginEmail : undefined,
          phone_number: loginMethod === 'phone' ? loginPhone : '963944123456',
          role: loginEmail.toLowerCase().includes('admin') ? 'admin' : 'user',
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
          created_at: new Date().toISOString(),
          is_blocked: false,
        };
        saveProfiles([newProfile, ...profiles]);
        setCurrentUser(newProfile);
        onAuthSuccess(newProfile);
        onClose();
      }
    } catch (err: any) {
      setError(err?.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!regFullName.trim()) {
      setError('يرجى إدخال الاسم الكامل');
      return;
    }
    if (!regPhone.trim()) {
      setError('يرجى إدخال رقم الجوال المستخدم للتواصل عبر واتساب');
      return;
    }

    setLoading(true);

    try {
      const cleanPhone = regPhone.replace(/[^0-9]/g, '');
      const fullPhone = cleanPhone.startsWith('963') || cleanPhone.startsWith('90') ? cleanPhone : `963${cleanPhone.startsWith('0') ? cleanPhone.substring(1) : cleanPhone}`;

      // Check if user exists in local
      const profiles = getAllProfiles();
      const existing = profiles.find(
        (p) => (regEmail && p.email?.toLowerCase() === regEmail.toLowerCase()) || p.phone_number === fullPhone
      );

      if (existing) {
        setError('يوجد حساب مسجل مسبقاً بهذا البريد الإلكتروني أو رقم الجوال.');
        setLoading(false);
        return;
      }

      const newProfile: UserProfile = {
        id: `user-${Date.now()}`,
        full_name: regFullName.trim(),
        email: regEmail.trim() || undefined,
        phone_number: fullPhone,
        role: regEmail.toLowerCase().includes('admin') ? 'admin' : 'user',
        avatar_url: regAvatar.trim() || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(regFullName)}`,
        created_at: new Date().toISOString(),
        is_blocked: false,
      };

      saveProfiles([newProfile, ...profiles]);
      setCurrentUser(newProfile);
      onAuthSuccess(newProfile);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'فشل إنشاء الحساب، يرجى المحاولة ثانية.');
    } finally {
      setLoading(false);
    }
  };

  // Instant quick login for testing
  const handleQuickLogin = (role: 'admin' | 'user') => {
    const profiles = getAllProfiles();
    if (role === 'admin') {
      const admin = profiles.find((p) => p.role === 'admin') || profiles[0];
      setCurrentUser(admin);
      onAuthSuccess(admin);
    } else {
      const user = profiles.find((p) => p.role === 'user') || profiles[1];
      setCurrentUser(user);
      onAuthSuccess(user);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden text-right">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-teal-800 text-white">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-teal-300" />
            <h2 className="text-base sm:text-lg font-bold">
              {mode === 'login' ? 'تسجيل الدخول إلى بازار حمام التركمان' : 'إنشاء حساب جديد في البازار'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-teal-200 hover:text-white hover:bg-teal-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Switcher Bar */}
        <div className="px-6 py-2.5 bg-teal-50/70 border-b border-teal-100 flex items-center justify-between text-xs">
          <span className="text-teal-900 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>دخول تجريبي سريع:</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuickLogin('admin')}
              className="px-2.5 py-1 rounded-lg bg-teal-800 hover:bg-teal-900 text-white font-bold text-[11px] transition-colors shadow-xs"
            >
              👑 أدمن المنصة
            </button>
            <button
              onClick={() => handleQuickLogin('user')}
              className="px-2.5 py-1 rounded-lg bg-white border border-teal-300 text-teal-800 hover:bg-teal-100 font-bold text-[11px] transition-colors"
            >
              👤 مستخدم عادي
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          
          {/* Tabs: Login / Register */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-5">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                mode === 'login' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              تسجيل الدخول
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null); }}
              className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                mode === 'register' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              إنشاء حساب جديد
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* LOGIN MODE */}
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Method choice: Email vs Phone */}
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-700 mb-2">
                <span>طريقة الدخول:</span>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="loginMethod"
                    checked={loginMethod === 'email'}
                    onChange={() => setLoginMethod('email')}
                    className="text-teal-700 focus:ring-teal-600"
                  />
                  <span>البريد الإلكتروني</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="loginMethod"
                    checked={loginMethod === 'phone'}
                    onChange={() => setLoginMethod('phone')}
                    className="text-teal-700 focus:ring-teal-600"
                  />
                  <span>رقم الجوال</span>
                </label>
              </div>

              {loginMethod === 'email' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="admin@hamam-bazar.com"
                      className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-slate-900 text-sm"
                      dir="ltr"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    رقم الجوال
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                      placeholder="963944123456"
                      className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-slate-900 text-sm font-mono"
                      dir="ltr"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-slate-900 text-sm"
                    dir="ltr"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? 'جارٍ تسجيل الدخول...' : 'دخول'}
              </button>

            </form>
          ) : (
            /* REGISTER MODE */
            <form onSubmit={handleRegister} className="space-y-3.5">
              
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  الاسم الكامل <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="مثال: محمد خالد التركماني"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-slate-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  رقم الجوال (للتواصل عبر واتساب) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="مثال: 963944123456"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-slate-900 text-sm font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  البريد الإلكتروني (اختياري)
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-slate-900 text-sm"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  كلمة المرور <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-slate-900 text-sm"
                  dir="ltr"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? 'جارٍ إنشاء الحساب...' : 'إنشاء حساب جديد'}
              </button>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
