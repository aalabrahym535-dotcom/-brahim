import React from 'react';
import { Search, X, Tag, ShoppingCart, ShoppingBag, Wrench, AlertTriangle, ArrowUpDown, MapPin } from 'lucide-react';
import { FilterCategory } from '../types';

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: FilterCategory;
  onSelectCategory: (cat: FilterCategory) => void;
  selectedLocation: string;
  onSelectLocation: (loc: string) => void;
  sortBy: 'newest' | 'price_asc' | 'price_desc';
  onSortChange: (sort: 'newest' | 'price_asc' | 'price_desc') => void;
  totalResults: number;
}

const CATEGORIES: { id: FilterCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'الكل', icon: <Tag className="w-4 h-4" /> },
  { id: 'for_sale', label: 'للبيع', icon: <ShoppingBag className="w-4 h-4" /> },
  { id: 'to_buy', label: 'للشراء', icon: <ShoppingCart className="w-4 h-4" /> },
  { id: 'services', label: 'خدمات', icon: <Wrench className="w-4 h-4" /> },
  { id: 'lost_found', label: 'مفقودات', icon: <AlertTriangle className="w-4 h-4" /> },
];

const LOCATIONS = [
  'جميع المناطق',
  'حمام التركمان الشمالي',
  'حمام التركمان الجنوبي',
  'حمام التركمان - السوق',
  'تل أبيض والريف',
  'ريف البليخ ومشروع الري',
  'قرى الجلاب'
];

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  selectedLocation,
  onSelectLocation,
  sortBy,
  onSortChange,
  totalResults
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs mb-6">
      
      {/* Top row: Search input + Location + Sort */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
        
        {/* Search input: "ابحث في الإعلانات..." */}
        <div className="md:col-span-6 relative">
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5 text-teal-700" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث في الإعلانات... (مثلاً: غسالة، جرار، طاقة شمسية، سيارة، أغنام)"
            className="w-full pr-11 pl-10 py-3 bg-slate-50 hover:bg-slate-50/80 focus:bg-white text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-sm font-medium transition-all outline-hidden"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-slate-600"
              title="مسح البحث"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Location selector */}
        <div className="md:col-span-3 relative">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            <MapPin className="w-4 h-4 text-teal-600" />
          </div>
          <select
            value={selectedLocation}
            onChange={(e) => onSelectLocation(e.target.value)}
            className="w-full pr-9 pl-3 py-3 bg-slate-50 hover:bg-slate-50/80 focus:bg-white text-slate-800 rounded-xl border border-slate-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-sm font-medium transition-all outline-hidden appearance-none cursor-pointer"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Sort selector */}
        <div className="md:col-span-3 relative">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            <ArrowUpDown className="w-4 h-4 text-teal-600" />
          </div>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as 'newest' | 'price_asc' | 'price_desc')}
            className="w-full pr-9 pl-3 py-3 bg-slate-50 hover:bg-slate-50/80 focus:bg-white text-slate-800 rounded-xl border border-slate-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-sm font-medium transition-all outline-hidden appearance-none cursor-pointer"
          >
            <option value="newest">الأحدث أولاً</option>
            <option value="price_asc">السعر: من الأقل للأعلى</option>
            <option value="price_desc">السعر: من الأعلى للأقل</option>
          </select>
        </div>

      </div>

      {/* Second row: Quick Category Filter Buttons [الكل، للبيع، للشراء، خدمات، مفقودات] */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-xs scale-[1.02]'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-slate-900'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Results counter indicator */}
        <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
          <span>عدد الإعلانات:</span>
          <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
            {totalResults}
          </span>
        </div>
      </div>

    </div>
  );
};
