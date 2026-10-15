import React from 'react';
import { Sparkles, MessageCircle, ShieldCheck, Zap, Megaphone } from 'lucide-react';

interface FeatureStripProps {
  customBannerText?: string;
}

export const FeatureStrip: React.FC<FeatureStripProps> = ({ customBannerText }) => {
  return (
    <section className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white border-b border-teal-700/60 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          
          {/* Welcome micro-kicker / Dynamic banner text */}
          <div className="flex items-center gap-2 text-teal-100 font-medium">
            <span className="flex h-2 w-2 rounded-full bg-teal-400"></span>
            <span className="text-xs sm:text-sm font-semibold">
              {customBannerText || 'سوق أهالي حمام التركمان وتل أبيض والريف الزراعي'}
            </span>
          </div>

          {/* Prompt specified badges */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-4">
            
            {/* وسم: تصنيف تلقائي ذكي */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-700/60 border border-teal-600/60 text-teal-50 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>تصنيف تلقائي ذكي</span>
            </div>

            {/* وسم: تواصل واتساب فوري */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-700/60 border border-emerald-500/60 text-emerald-100 text-xs font-semibold backdrop-blur-xs">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
              <span>تواصل واتساب فوري</span>
            </div>

            {/* وسم: مجاني بالكامل */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-700/50 border border-cyan-500/50 text-cyan-100 text-xs font-semibold backdrop-blur-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
              <span>مجاني بالكامل</span>
            </div>

            {/* Extra trust note */}
            <div className="hidden lg:flex items-center gap-1 text-teal-200/80 text-xs">
              <Zap className="w-3 h-3 text-amber-300" />
              <span>بدون أي عمولات أو وسيط</span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
