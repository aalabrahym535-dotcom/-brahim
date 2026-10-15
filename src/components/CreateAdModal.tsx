import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2, Sparkles, MessageCircle, AlertCircle, CheckCircle2, Image as ImageIcon, ShoppingBag, ShoppingCart, Wrench, AlertTriangle } from 'lucide-react';
import { AdCategory, AdItem, UserProfile } from '../types';
import { formatPrice } from '../services/storage';

interface CreateAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ad: AdItem) => Promise<void>;
  currentUser?: UserProfile | null;
  requireAdminApproval?: boolean;
}

const CATEGORY_OPTIONS: { id: AdCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'for_sale', label: 'للبيع', icon: <ShoppingBag className="w-4 h-4" /> },
  { id: 'to_buy', label: 'للشراء', icon: <ShoppingCart className="w-4 h-4" /> },
  { id: 'services', label: 'خدمات', icon: <Wrench className="w-4 h-4" /> },
  { id: 'lost_found', label: 'مفقودات', icon: <AlertTriangle className="w-4 h-4" /> },
];

const TOWNS = [
  'حمام التركمان الشمالي',
  'حمام التركمان الجنوبي',
  'حمام التركمان - السوق الرئيسي',
  'تل أبيض والريف',
  'ريف البليخ ومشروع الري',
  'قرى الجلاب',
  'الريف المجاور'
];

export const CreateAdModal: React.FC<CreateAdModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentUser,
  requireAdminApproval = false
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<AdCategory>('for_sale');
  const [price, setPrice] = useState<string>('');
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [countryCode, setCountryCode] = useState('963');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phone_number || '');
  const [contactName, setContactName] = useState(currentUser?.full_name || '');
  const [location, setLocation] = useState(TOWNS[0]);
  const [images, setImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [smartDetected, setSmartDetected] = useState<string | null>(null);

  // Reset form or prefill on open/close
  useEffect(() => {
    if (isOpen) {
      if (currentUser) {
        setPhoneNumber(currentUser.phone_number);
        setContactName(currentUser.full_name);
      }
    } else {
      setTitle('');
      setDescription('');
      setCategory('for_sale');
      setPrice('');
      setIsNegotiable(true);
      setImages([]);
      setImageError(null);
      setSmartDetected(null);
    }
  }, [isOpen, currentUser]);

  // Smart Auto-Categorization based on title keywords
  useEffect(() => {
    const text = title.trim().toLowerCase();
    if (!text) {
      setSmartDetected(null);
      return;
    }

    if (text.includes('مفقود') || text.includes('ضائع') || text.includes('وجدت') || text.includes('لقيت') || text.includes('فقدان')) {
      if (category !== 'lost_found') {
        setCategory('lost_found');
        setSmartDetected('مفقودات');
      }
    } else if (text.includes('مطلوب') || text.includes('شراء') || text.includes('اريد شراء') || text.includes('ابحث عن') || text.includes('محتاج')) {
      if (category !== 'to_buy') {
        setCategory('to_buy');
        setSmartDetected('للشراء');
      }
    } else if (text.includes('صيانة') || text.includes('تصليح') || text.includes('حفر') || text.includes('ورشة') || text.includes('تركيب') || text.includes('نقل') || text.includes('خدمة') || text.includes('حدادة') || text.includes('خياطة')) {
      if (category !== 'services') {
        setCategory('services');
        setSmartDetected('خدمات');
      }
    } else if (text.includes('للبيع') || text.includes('بيع') || text.includes('مستعمل') || text.includes('جديد') || text.includes('طاقة') || text.includes('جرار') || text.includes('غسالة')) {
      if (category !== 'for_sale') {
        setCategory('for_sale');
        setSmartDetected('للبيع');
      }
    }
  }, [title]);

  if (!isOpen) return null;

  // Handle image files up to 5 images, max 10MB each
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 5) {
      setImageError('الحد الأقصى المسموح به هو 5 صور فقط لكل إعلان.');
      return;
    }

    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    const newImagePromises: Promise<string>[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > maxSizeBytes) {
        setImageError(`الصورة "${file.name}" تتجاوز الحد الأقصى المسموح (10 ميجابايت).`);
        return;
      }
      if (!file.type.startsWith('image/')) {
        setImageError(`الملف "${file.name}" ليس صورة صالحة.`);
        return;
      }

      newImagePromises.push(
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        })
      );
    }

    Promise.all(newImagePromises).then((results) => {
      setImages((prev) => [...prev, ...results]);
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('يرجى إدخال عنوان الإعلان');
      return;
    }
    if (!phoneNumber.trim()) {
      alert('يرجى إدخال رقم الواتساب للتواصل');
      return;
    }

    // Clean phone number
    const cleanDigits = phoneNumber.replace(/[^0-9]/g, '');
    let finalWhatsApp = `${countryCode}${cleanDigits.startsWith('0') ? cleanDigits.substring(1) : cleanDigits}`;
    if (cleanDigits.startsWith('963') || cleanDigits.startsWith('90')) {
      finalWhatsApp = cleanDigits;
    }

    setIsSubmitting(true);

    const newAd: AdItem = {
      id: `ad-${Date.now()}`,
      user_id: currentUser?.id || `user-local-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category,
      price: price ? parseFloat(price) : null,
      isNegotiable,
      whatsapp: finalWhatsApp,
      location,
      images,
      status: requireAdminApproval && currentUser?.role !== 'admin' ? 'pending' : 'active',
      createdAt: new Date().toISOString(),
      viewsCount: 1,
      contactName: contactName.trim() || currentUser?.full_name || 'معلن محلي'
    };

    try {
      await onSubmit(newAd);
      onClose();
    } catch (err) {
      console.error('Error submitting ad:', err);
      alert('حدث خطأ أثناء نشر الإعلان، يرجى المحاولة ثانية.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-teal-800 text-white">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold">إضافة إعلان جديد في بازار حمام التركمان</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-teal-200 hover:text-white hover:bg-teal-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-right">
          
          {/* 1. العنوان: حقل نصي لإدخال عنوان الإعلان */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <span>عنوان الإعلان</span>
                <span className="text-rose-500">*</span>
              </label>
              {smartDetected && (
                <span className="inline-flex items-center gap-1 text-[11px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 animate-pulse">
                  <Sparkles className="w-3 h-3 text-teal-600" />
                  تصنيف ذكي: {smartDetected}
                </span>
              )}
            </div>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: غسالة اتوماتيك مستعملة بحالة ممتازة، جرار زراعي، مطلوب شراء..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-slate-900 text-sm font-medium transition-all"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              اكتب عنواناً واضحاً وموجزاً يجذب المشتري مباشرة.
            </p>
          </div>

          {/* 2. الفئة: أزرار اختيار متعددة (للبيع، للشراء، خدمات، مفقودات) */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              الفئة والتصنيف <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORY_OPTIONS.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`py-2.5 px-3 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-700 border-teal-700 text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. الوصف: حقل نصي متعدد الأسطر مع عداد حروف (حتى 600 حرف) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <span>تفاصيل ووصف الإعلان</span>
                <span className="text-rose-500">*</span>
              </label>
              <span className={`text-xs font-semibold ${description.length > 550 ? 'text-amber-600' : 'text-slate-400'}`}>
                {description.length} / 600 حرف
              </span>
            </div>
            <textarea
              required
              rows={4}
              maxLength={600}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب مواصفات السلعة أو الخدمة بالتفصيل: الحالة، مدة الاستخدام، سبب البيع، تفاصيل التسليم والمعاينة في حمام التركمان..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-slate-900 text-sm leading-relaxed transition-all resize-y"
            ></textarea>
          </div>

          {/* 4. السعر: حقل أرقام اختياري (بالليرة السورية ل.س) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1.5">
                السعر (اختياري - بالليرة السورية)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="مثلاً: 2500000"
                  className="w-full pl-14 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-slate-900 text-sm font-mono font-medium"
                />
                <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-bold">
                  ل.س
                </span>
              </div>
              {price && (
                <p className="text-xs text-teal-700 font-medium mt-1">
                  المبلغ: {formatPrice(parseFloat(price))}
                </p>
              )}
            </div>

            {/* تفاوض السعر والمنطقة */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1.5">
                المنطقة / الحي
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-slate-800 text-sm font-medium"
              >
                {TOWNS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="negotiable"
                  checked={isNegotiable}
                  onChange={(e) => setIsNegotiable(e.target.checked)}
                  className="rounded text-teal-700 focus:ring-teal-600"
                />
                <label htmlFor="negotiable" className="text-xs text-slate-600 cursor-pointer">
                  السعر قابل للتفاوض / على السوم
                </label>
              </div>
            </div>
          </div>

          {/* 5. رقم الواتساب: حقل رقم الهاتف للتواصل المباشر مع رمز الدولة */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="text-sm font-bold text-slate-800 flex items-center gap-1 mb-1.5">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>رقم الواتساب للتواصل</span>
                <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-2" dir="ltr">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="bg-slate-100 border border-slate-300 rounded-xl px-2.5 py-2.5 text-xs font-bold text-slate-700"
                >
                  <option value="963">+963 (سوريا)</option>
                  <option value="90">+90 (تركيا)</option>
                  <option value="962">+962 (الأردن)</option>
                </select>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="944123456"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-slate-900 text-sm font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                سيتصل بك المشتري مباشرة بنقرة واحدة عبر تطبيق واتساب.
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1.5">
                اسم المعلن / كنية التواصل (اختياري)
              </label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="مثال: أبو أحمد، ورشة النور..."
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-slate-800 text-sm font-medium"
              />
            </div>
          </div>

          {/* 6. رفع الصور: حتى 5 صور كحد أقصى (بحجم أقصى 10 ميجابايت للصورة) */}
          <div className="pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-teal-600" />
                <span>صور الإعلان (حتى 5 صور، بحجم أقصى 10 ميجابايت للصورة)</span>
              </label>
              <span className="text-xs text-slate-500 font-medium">
                {images.length} من 5 صور
              </span>
            </div>

            {/* Error banner if any */}
            {imageError && (
              <div className="mb-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{imageError}</span>
              </div>
            )}

            {/* Images Grid & Dropzone */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              
              {/* Preview thumbnails */}
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-300 group shadow-xs">
                  <img
                    src={img}
                    alt={`صورة ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {idx === 0 && (
                    <span className="absolute bottom-1 right-1 bg-teal-800/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      الرئيسية
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 left-1 bg-rose-600 text-white p-1 rounded-md opacity-90 hover:opacity-100 transition-opacity"
                    title="حذف الصورة"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Upload trigger button if < 5 */}
              {images.length < 5 && (
                <label className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-teal-600 bg-slate-50 hover:bg-teal-50/50 flex flex-col items-center justify-center text-center p-2 cursor-pointer transition-colors">
                  <Upload className="w-5 h-5 text-teal-600 mb-1" />
                  <span className="text-[11px] font-bold text-slate-700">أضف صورة</span>
                  <span className="text-[9px] text-slate-400">حد أقصى 10MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}

            </div>
          </div>

          {/* Modal Footer / Buttons: زر "إلغاء" وزر "نشر" */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-100 transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 active:scale-[0.98] text-white font-bold text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>جارٍ النشر...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>نشر الإعلان الآن</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
