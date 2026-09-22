'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { FAQ_ITEMS } from '../../data/content';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { DecorativeDivider } from '../ui/DecorativeDivider';

export function FaqSection() {
  const { t } = useLanguage();
  const [openId, setOpenId] = useState<string | null>('1');

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-[#FFFCF7] border-b border-[#2D3533]/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-[#C89748] tracking-widest uppercase block mb-2">
            {t('كل ما تودين معرفته', 'AIDE & CONSEILS')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#123D35] italic">
            {t('الأسئلة الشائعة', 'Questions fréquentes')}
          </h2>
          <DecorativeDivider className="mt-3" />
        </div>

        {/* 2-column or list accordion */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="bg-[#F8F4EC]/60 border border-[#2D3533]/10 rounded-xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggle(item.id)}
                  className="w-full p-5 text-start flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-[#123D35] hover:text-[#C89748] transition-colors focus:outline-none"
                >
                  <span>{t(item.questionAr, item.questionFr)}</span>
                  <div className="w-6 h-6 rounded-full bg-[#123D35]/10 flex items-center justify-center shrink-0">
                    {isOpen ? (
                      <Minus className="w-3.5 h-3.5 text-[#123D35]" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 text-[#123D35]" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#2D3533]/80 leading-relaxed font-light border-t border-[#2D3533]/5">
                    {t(item.answerAr, item.answerFr)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
