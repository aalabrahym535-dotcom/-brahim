import React from 'react';
import { Store, MessageCircle, Heart, ShieldCheck, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-base font-['Cairo',sans-serif]">
                بازار حمام التركمان
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              المنصة المجانية الأولى للإعلانات المبوبة لخدمة أهالي بلدة حمام التركمان، تل أبيض، ومشروع ري البليخ. تسهيل حركة البيع والشراء والخدمات المحلية بكل شفافية وأمان عبر تطبيق واتساب.
            </p>
            <div className="flex items-center gap-2 text-slate-500 pt-1">
              <MapPin className="w-3.5 h-3.5 text-teal-500" />
              <span>ريف الرقة الشمالي - حمام التركمان</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold text-sm">أقسام السوق</h4>
            <ul className="space-y-1.5">
              <li><span className="hover:text-teal-400 transition-colors">عروض للبيع (آليات، مواشي، أجهزة)</span></li>
              <li><span className="hover:text-teal-400 transition-colors">طلبات شراء فورية</span></li>
              <li><span className="hover:text-teal-400 transition-colors">خدمات وحرف (حفر آبار، صيانة)</span></li>
              <li><span className="hover:text-teal-400 transition-colors">مفقودات ومقتنيات</span></li>
            </ul>
          </div>

          {/* Col 3: Guidelines & Safety */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold text-sm">الأمان والمساعدة</h4>
            <div className="space-y-2">
              <p className="text-[11px] text-slate-400 leading-normal">
                المنصة مجانية ولا تتقاضى أي عمولة. يرجى دائماً إتمام عمليات الدفع يداً بيد بعد فحص السلعة في مكان عام.
              </p>
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>معاملات مباشرة وآمنة</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} بازار حمام التركمان. جميع الحقوق محفوظة لأهالي المنطقة.</p>
          <p className="flex items-center gap-1">
            صُمم لخدمة أهالي الريف الشمالي وتل أبيض
          </p>
        </div>
      </div>
    </footer>
  );
};
