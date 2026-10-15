import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, MessageCircle, ShoppingBag, ShoppingCart, Wrench, AlertTriangle } from 'lucide-react';
import { AdItem, AdCategory, AdStatus } from '../types';
import { formatPrice } from '../services/storage';

interface EditAdModalProps {
  ad: AdItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<AdItem>) => Promise<void>;
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

export const EditAdModal: React.FC<EditAdModalProps> = ({
  ad,
  isOpen,
  onClose,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<AdCategory>('for_sale');
  const [price, setPrice] = useState<string>('');
  const [whatsapp, setWhatsapp] = useState('');
  const [location, setLocation] = useState(TOWNS[0]);
  const [status, setStatus] = useState<AdStatus>('active');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (ad) {
      setTitle(ad.title);
      setDescription(ad.description);
      setCategory(ad.category);
      setPrice(ad.price ? ad.price.toString() : '');
      setWhatsapp(ad.whatsapp);
      setLocation(ad.location);
      setStatus(ad.status);
    }
  }, [ad]);

  if (!isOpen || !ad) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(ad.id, {
        title: title.trim(),
        description: description.trim(),
        category,
        price: price ? parseFloat(price) : null,
        whatsapp: whatsapp.trim(),
        location,
        status,
      });
      onClose();
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء حفظ التعديل');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-right">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-teal-800 text-white">
          <h2 className="text-base sm:text-lg font-bold">تعديل الإعلان #{ad.id.replace('ad-', '')}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-teal-200 hover:text-white hover:bg-teal-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">عنوان الإعلان</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-slate-900 text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">الفئة</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORY_OPTIONS.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`py-2 px-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    category === cat.id
                      ? 'bg-teal-700 border-teal-700 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-800">الوصف</label>
              <span className="text-xs text-slate-400">{description.length} / 600</span>
            </div>
            <textarea
              required
              rows={3}
              maxLength={600}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-slate-900 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">السعر (ل.س)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-slate-900 text-sm font-mono"
              />
              {price && (
                <span className="text-[11px] text-teal-700 font-semibold">{formatPrice(parseFloat(price))}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">حالة الإعلان</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AdStatus)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-slate-800 text-xs font-bold"
              >
                <option value="active">نشط ومتاح للجميع</option>
                <option value="sold">تم البيع / مكتمل</option>
                <option value="pending">قيد المراجعة / متوقف مؤقتاً</option>
                <option value="rejected">مرفوض</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">رقم الواتساب</label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-slate-900 text-sm font-mono"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">المنطقة</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-slate-800 text-xs font-medium"
              >
                {TOWNS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>حفظ التعديلات</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
