'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { getWhatsAppHref } from '../../data/content';
import { Phone } from 'lucide-react';

export function FloatingWhatsApp() {
  const { language, t } = useLanguage();

  return (
    <aside
      aria-label="WhatsApp Support"
      className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-40 flex items-center group pointer-events-auto"
    >
      <div className="hidden sm:block bg-white text-[#123D35] text-xs font-semibold px-3.5 py-2 rounded-full shadow-lg border border-[#2D3533]/10 mx-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {t('استفسار أو طلب عبر واتساب', 'Besoin d’aide ? Contactez-nous')}
      </div>

      <a
        href={getWhatsAppHref(language)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('تواصلي مع الحرة عبر واتساب', 'Contacter Al Hurra sur WhatsApp')}
        className="w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white flex items-center justify-center shadow-xl hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#C89748] transition-all duration-300 relative"
      >
        {/* Pulsing ring animation */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none"></span>
        <Phone className="w-6 h-6 fill-current relative z-10" />
      </a>
    </aside>
  );
}
