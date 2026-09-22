'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice } from '../../utils/format';
import { RITUALS } from '../../data/content';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { DecorativeDivider } from '../ui/DecorativeDivider';

export function SignatureRitualsSection() {
  const { t, isRtl } = useLanguage();

  return (
    <section id="rituals" className="py-16 sm:py-24 bg-[#F8F4EC]/80 border-b border-[#2D3533]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-[#C89748] tracking-widest uppercase block mb-2">
            {t('مجموعات عناية متكاملة', 'COFFRETS DE SOINS COMPLETS')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#123D35] italic">
            {t('طقوسنا المميزة', 'Nos rituels signature')}
          </h2>
          <DecorativeDivider className="mt-3" />
        </div>

        {/* 3 Signature Rituals Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {RITUALS.map((ritual) => (
            <div
              key={ritual.id}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-[#123D35] text-[#FFFCF7] flex flex-col h-full"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden shrink-0">
                <Image
                  src={ritual.image}
                  alt={t(ritual.titleAr, ritual.titleFr)}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#123D35] via-[#123D35]/20 to-transparent pointer-events-none" />
                
                <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 bg-[#C89748] text-[#123D35] font-bold text-xs px-3 py-1 rounded-full shadow">
                  {t(ritual.badgeAr || `${ritual.productsCount} منتجات متكاملة`, ritual.badgeFr || `${ritual.productsCount} soins complets`)}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1 justify-between">
                <div className="flex-1 flex flex-col">
                  <h3 className="text-xl sm:text-2xl font-serif-luxury font-bold text-[#FFFCF7] group-hover:text-[#C89748] transition-colors mb-2">
                    {t(ritual.titleAr, ritual.titleFr)}
                  </h3>
                  <p className="text-xs text-[#C89748] font-medium tracking-wide uppercase mb-3">
                    {t(ritual.taglineAr, ritual.taglineFr)}
                  </p>
                  <p className="text-xs text-[#FFFCF7]/80 font-light leading-relaxed mb-4">
                    {t(ritual.descriptionAr, ritual.descriptionFr)}
                  </p>
                </div>

                <div className="pt-4 mt-auto border-t border-[#FFFCF7]/15 flex items-center justify-between">
                  <span className="text-lg font-bold text-[#C89748]" dir="ltr">
                    {formatPrice(ritual.priceMAD)}
                  </span>
                  
                  <a
                    href="#bestsellers"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FFFCF7] group-hover:text-[#C89748] transition-colors uppercase tracking-wider"
                  >
                    <span>{t('اكتشفي الطقس', 'DÉCOUVRIR')}</span>
                    {isRtl ? <ArrowLeft className="w-4 h-4 shrink-0" /> : <ArrowRight className="w-4 h-4 shrink-0" />}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
