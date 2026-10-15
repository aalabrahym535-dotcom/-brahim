import React, { useState } from 'react';
import { X, Database, Check, Copy, ExternalLink, HardDrive, ShieldCheck, Zap } from 'lucide-react';
import { SupabaseConfig } from '../types';
import { COMPLETE_SUPABASE_SQL } from '../services/supabase';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SupabaseConfig;
  onSaveConfig: (config: SupabaseConfig) => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig
}) => {
  const [url, setUrl] = useState(config.url || '');
  const [anonKey, setAnonKey] = useState(config.anonKey || '');
  const [bucketName, setBucketName] = useState(config.bucketName || 'bazar-images');
  const [copiedSql, setCopiedSql] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(COMPLETE_SUPABASE_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const isConn = Boolean(url.trim() && anonKey.trim());
    onSaveConfig({
      url: url.trim(),
      anonKey: anonKey.trim(),
      bucketName: bucketName.trim() || 'bazar-images',
      tableName: 'ads',
      isConnected: isConn
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base sm:text-lg font-bold">
              إعدادات قاعدة البيانات والتخزين السحابي (Supabase)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-right">
          
          {/* Status Banner */}
          <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 flex items-start gap-3">
            <HardDrive className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-teal-900 mb-1">
                محرك التخزين النشط: نظام IndexedDB المحلي المدمج الفوري
              </h4>
              <p className="text-xs text-teal-800 leading-relaxed">
                التطبيق يعمل حالياً بأعلى كفاءة مع حفظ دائم للإعلانات والصور على ذاكرة المتصفح دون الحاجة لأي مفاتيح خارجية. إذا كنت تملك مشروعاً في Supabase، يمكنك إدخال بياناتك بالأسفل لمزامنة السحابة.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-4">
            
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                رابط مشروع Supabase (Project URL)
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-project.supabase.co"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-slate-900 text-xs font-mono"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                المفتاح العام (anon / public key)
              </label>
              <input
                type="password"
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-slate-900 text-xs font-mono"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                اسم حاوية تخزين الصور (Storage Bucket)
              </label>
              <input
                type="text"
                value={bucketName}
                onChange={(e) => setBucketName(e.target.value)}
                placeholder="bazar-images"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-slate-900 text-xs font-mono"
                dir="ltr"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleCopySql}
                className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>نسخ كود SQL لإنشاء جدول Supabase</span>
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>تم الحفظ بنجاح</span>
                  </>
                ) : (
                  <span>حفظ إعدادات الربط</span>
                )}
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};
