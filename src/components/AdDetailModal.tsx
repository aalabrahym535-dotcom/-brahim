import React, { useState } from 'react';
import { X, MessageCircle, Phone, Share2, Heart, MapPin, Clock, Eye, Trash2, Shield, Check, ShoppingBag, ShoppingCart, Wrench, AlertTriangle } from 'lucide-react';
import { AdItem, AdCategory } from '../types';
import { formatPrice, formatRelativeTime, generateWhatsAppLink } from '../services/storage';

interface AdDetailModalProps {
  ad: AdItem | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  isMyAd: boolean;
  onDeleteAd: (id: string) => void;
}

const CATEGORY_NAMES: Record<AdCategory, { label: string; icon: React.ReactNode }> = {
  for_sale: { label: 'للبيع', icon: <ShoppingBag className="w-4 h-4" /> },
  to_buy: { label: 'للشراء', icon: <ShoppingCart className="w-4 h-4" /> },
  services: { label: 'خدمات', icon: <Wrench className="w-4 h-4" /> },
  lost_found: { label: 'مفقودات', icon: <AlertTriangle className="w-4 h-4" /> },
};

export const AdDetailModal: React.FC<AdDetailModalProps> = ({
  ad,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  isMyAd,
  onDeleteAd
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !ad) return null;

  const images = ad.images && ad.images.length > 0 ? ad.images : [];
  const currentImage = images[activeImageIndex] || null;
  const cat = CATEGORY_NAMES[ad.category] || CATEGORY_NAMES.for_sale;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: ad.title,
        text: `إعلان في بازار حمام التركمان: ${ad.title}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${window.location.href} - إعلان: ${ad.title}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsApp = () => {
    const url = generateWhatsAppLink(ad.whatsapp, ad.title, ad.price);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCall = () => {
    window.location.href = `tel:${ad.whatsapp}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-100 text-teal-800 text-xs font-bold border border-teal-200">
              {cat.icon}
              <span>{cat.label}</span>
            </span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              رقم الإعلان: #{ad.id.replace('ad-', '')}
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Share button */}
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-slate-600 hover:text-teal-700 hover:bg-slate-100 transition-colors"
              title="مشاركة الإعلان"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5" />}
            </button>

            {/* Favorite button */}
            <button
              onClick={() => onToggleFavorite(ad.id)}
              className="p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-slate-100 transition-colors"
              title={isFavorite ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            {/* Delete button (only if user created this ad) */}
            {isMyAd && (
              <button
                onClick={() => {
                  if (confirm('هل أنت متأكد من حذف هذا الإعلان من جهازك؟')) {
                    onDeleteAd(ad.id);
                    onClose();
                  }
                }}
                className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                title="حذف إعلاني"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-right">
          
          {/* Image Gallery */}
          {images.length > 0 ? (
            <div className="space-y-3">
              <div className="relative aspect-16/9 sm:aspect-16/10 rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                <img
                  src={currentImage!}
                  alt={ad.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Thumbnails if multiple images */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIndex(i)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                        activeImageIndex === i ? 'border-teal-700 ring-2 ring-teal-500/30' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`مصغر ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-16/9 rounded-xl bg-slate-100 flex flex-col items-center justify-center text-slate-400 p-6">
              <div className="p-4 rounded-full bg-slate-200/60 mb-2">
                {cat.icon}
              </div>
              <p className="text-sm font-semibold">إعلان بدون صور مرفقة</p>
            </div>
          )}

          {/* Pricing & Title */}
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-teal-800 font-mono">
                {formatPrice(ad.price)}
              </span>
              {ad.isNegotiable && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                  السعر قابل للتفاوض
                </span>
              )}
            </div>
            
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {ad.title}
            </h1>
          </div>

          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-teal-600" />
              <span className="font-semibold text-slate-800">{ad.location}</span>
            </span>
            <span className="text-slate-300">·</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>نُشر {formatRelativeTime(ad.createdAt)}</span>
            </span>
            <span className="text-slate-300">·</span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-slate-400" />
              <span>{ad.viewsCount} مشاهدة</span>
            </span>
            {ad.contactName && (
              <>
                <span className="text-slate-300">·</span>
                <span>المعلن: <strong className="text-slate-800">{ad.contactName}</strong></span>
              </>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-800">تفاصيل الإعلان</h3>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
              {ad.description}
            </div>
          </div>

          {/* Primary Action Buttons: WhatsApp & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleWhatsApp}
              className="py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>تواصل واتساب فوري الآن</span>
            </button>

            <button
              onClick={handleCall}
              className="py-3.5 px-4 rounded-xl bg-teal-800 hover:bg-teal-900 active:scale-[0.98] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Phone className="w-5 h-5" />
              <span dir="ltr">{ad.whatsapp}</span>
            </button>
          </div>

          {/* Local Safety Notice */}
          <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200 text-teal-900 text-xs flex items-start gap-2.5">
            <Shield className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold mb-0.5">نصيحة أمان للتعاملات في حمام التركمان:</strong>
              <span>احرص على فحص السلعة ومعاينتها شخصياً وجهاً لوجه في مكان معروف قبل دفع أي مبالغ مالية. لا تقم بأي تحويلات إلكترونية مسبقة.</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
