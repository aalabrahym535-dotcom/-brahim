import React from 'react';
import { MessageCircle, MapPin, Clock, Heart, Eye, ShoppingBag, ShoppingCart, Wrench, AlertTriangle } from 'lucide-react';
import { AdItem, AdCategory } from '../types';
import { formatPrice, formatRelativeTime, generateWhatsAppLink } from '../services/storage';

interface AdCardProps {
  ad: AdItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClick: (ad: AdItem) => void;
}

const CATEGORY_META: Record<AdCategory, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  for_sale: { label: 'للبيع', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-800', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
  to_buy: { label: 'للشراء', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-800', icon: <ShoppingCart className="w-3.5 h-3.5" /> },
  services: { label: 'خدمات', bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800', icon: <Wrench className="w-3.5 h-3.5" /> },
  lost_found: { label: 'مفقودات', bg: 'bg-rose-50 border-rose-200', text: 'text-rose-800', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
};

export const AdCard: React.FC<AdCardProps> = ({
  ad,
  isFavorite,
  onToggleFavorite,
  onClick
}) => {
  const cat = CATEGORY_META[ad.category] || CATEGORY_META.for_sale;
  const hasImage = ad.images && ad.images.length > 0;
  const coverImage = hasImage ? ad.images[0] : null;

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = generateWhatsAppLink(ad.whatsapp, ad.title, ad.price);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(ad.id);
  };

  return (
    <article
      onClick={() => onClick(ad)}
      className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer relative"
    >
      {/* Visual Image / Fallback Container */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt={ad.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            onError={(e) => {
              // Graceful fallback if image load fails
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
            <span className="p-3 rounded-full bg-white/70 shadow-xs mb-2 text-teal-700">
              {cat.icon}
            </span>
            <span className="text-xs font-semibold text-slate-500">إعلان بدون صور</span>
          </div>
        )}

        {/* Category Pill Over Image */}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border backdrop-blur-md shadow-xs ${cat.bg} ${cat.text}`}>
            {cat.icon}
            <span>{cat.label}</span>
          </span>
        </div>

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white backdrop-blur-md flex items-center justify-center text-slate-500 hover:text-rose-600 shadow-sm transition-transform active:scale-90"
          title={isFavorite ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-600'}`} />
        </button>

        {/* Images Count indicator if > 1 */}
        {ad.images && ad.images.length > 1 && (
          <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
            {ad.images.length} صور
          </span>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        
        <div>
          {/* Price Header */}
          <div className="flex items-baseline justify-between gap-2 mb-2">
            <span className="text-base sm:text-lg font-bold text-teal-800 font-mono">
              {formatPrice(ad.price)}
            </span>
            {ad.isNegotiable && ad.price && (
              <span className="text-[11px] text-slate-500 font-medium">قابل للتفاوض</span>
            )}
          </div>

          {/* Ad Title */}
          <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-2 mb-2 group-hover:text-teal-700 transition-colors">
            {ad.title}
          </h3>

          {/* Short description excerpt */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
            {ad.description}
          </p>
        </div>

        {/* Metadata & Actions */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1 truncate max-w-[55%]">
              <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span className="truncate">{ad.location}</span>
            </span>
            <span className="flex items-center gap-1 shrink-0">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatRelativeTime(ad.createdAt)}</span>
            </span>
          </div>

          {/* Action Row: Direct WhatsApp Button */}
          <button
            type="button"
            onClick={handleWhatsAppClick}
            className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            title="تواصل مباشر عبر واتساب"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>تواصل واتساب فوري</span>
          </button>

        </div>

      </div>
    </article>
  );
};
