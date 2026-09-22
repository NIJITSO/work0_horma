'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, Globe } from 'lucide-react';

export function AnnouncementBar() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <aside aria-label="Announcement" className="bg-[#123D35] text-[#FFFCF7] text-[11px] md:text-xs py-2 px-4 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Language Toggle */}
        <div className="flex items-center gap-3 order-2 sm:order-1">
          <div className="flex items-center gap-1 bg-[#0E302A] px-2 py-0.5 rounded border border-[#1A5449]">
            <Globe className="w-3 h-3 text-[#C89748]" />
            <button
              onClick={() => setLanguage('ar')}
              className={`hover:text-[#C89748] transition-colors font-medium ${
                language === 'ar' ? 'text-[#C89748] font-bold' : 'text-[#FFFCF7]/70'
              }`}
            >
              العربية
            </button>
            <span className="text-[#FFFCF7]/30">|</span>
            <button
              onClick={() => setLanguage('fr')}
              className={`hover:text-[#C89748] transition-colors font-medium ${
                language === 'fr' ? 'text-[#C89748] font-bold' : 'text-[#FFFCF7]/70'
              }`}
            >
              FR
            </button>
          </div>
        </div>

        {/* Central Promotional Banner */}
        <div className="flex items-center justify-center gap-2 font-medium tracking-wide order-1 sm:order-2 flex-1 text-center">
          <Sparkles className="w-3.5 h-3.5 text-[#C89748] animate-pulse shrink-0" />
          <span>
            {t(
              'توصيل مجاني لجميع مدن المغرب · الدفع عند الاستلام',
              'LIVRAISON GRATUITE PARTOUT AU MAROC · PAIEMENT À LA LIVRAISON'
            )}
          </span>
        </div>

        {/* Trust Highlight on Desktop */}
        <div className="hidden md:flex items-center gap-2 text-[#FFFCF7]/80 order-3 text-[11px]">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C89748]"></span>
          <span>{t('صنع بالمغرب 🇲🇦 100% طبيعي', 'Artisanat Marocain 🇲🇦 100% Bio')}</span>
        </div>
      </div>
    </aside>
  );
}
