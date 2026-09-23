'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles } from 'lucide-react';

export function HeroBanner() {
  const { t, isRtl } = useLanguage();

  return (
    <section className="relative w-full bg-[#F8F4EC] border-b border-[#2D3533]/10 overflow-hidden lg:min-h-[640px] xl:min-h-[680px] 2xl:min-h-[720px] lg:flex lg:items-center">
      {/* 
        1. Hero Photograph Container
        - Mobile & Tablet (< 1024px): Stacked at the TOP of the section with controlled 16:10 / 16:9 aspect ratio.
          Full photo visible: woman's face, AL HURRA skincare products, and Moroccan interior unobstructed.
        - Desktop (>= 1024px): Docked to the RIGHT (w-[62%] xl:w-[60%]) filling the height.
      */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:absolute lg:inset-y-0 lg:right-0 lg:w-[62%] xl:w-[60%] lg:h-full overflow-hidden select-none">
        <Image
          src="/images/homePage/hero.jpeg"
          alt="AL HURRA - La beauté marocaine, naturellement précieuse"
          fill
          priority
          quality={95}
          sizes="(max-width: 1024px) 100vw, 62vw"
          className="object-cover object-[center_30%] sm:object-[center_35%] lg:object-[center_center]"
        />
        {/* Mobile subtle feather into cream background */}
        <div className="lg:hidden absolute inset-x-0 bottom-0 h-6 sm:h-8 bg-gradient-to-t from-[#F8F4EC] to-transparent pointer-events-none" />
      </div>

      {/* 
        2. Desktop Gradient Overlay:
        - 0% to 38%: Solid cream (#F8F4EC) keeping left text clean & legible
        - 38% to 58%: Soft transitional blend into photograph
        - 58% to 100%: 100% transparent (photo completely crisp and clear)
      */}
      <div
        className="hidden lg:block absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(
            to right,
            #F8F4EC 0%,
            #F8F4EC 38%,
            rgba(248, 244, 236, 0.95) 42%,
            rgba(248, 244, 236, 0.70) 48%,
            rgba(248, 244, 236, 0.30) 54%,
            rgba(248, 244, 236, 0.0) 60%,
            rgba(248, 244, 236, 0.0) 100%
          )`,
        }}
      />

      {/* 
        3. Hero Content Block
        - Mobile & Tablet (< 1024px): Positioned directly UNDERNEATH the image in document flow.
          Content-driven height, no overlap with image, zero text clipping.
        - Desktop (>= 1024px): Positioned on the LEFT (left: 5-6%, width: 38-40%), vertically centered.
        - Arabic / French Alignment:
          French: direction: ltr, text-align: left.
          Arabic: direction: rtl, text-align: right.
          Crucially, Arabic content stays on the left area so the woman on the right remains 100% unobstructed.
      */}
      <div
        className="relative z-10 w-full px-4 sm:px-6 py-6 sm:py-8 lg:py-0 lg:px-0 lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:left-[5%] xl:left-[6%] lg:w-[40%] xl:w-[38%] lg:max-w-[560px]"
        style={{
          direction: isRtl ? 'rtl' : 'ltr',
          textAlign: isRtl ? 'right' : 'left',
        }}
      >
        <div className="flex flex-col">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-2 sm:mb-3">
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#C89748] uppercase">
              {t('طقوس الجمال المغربية', 'RITUELS DE BEAUTÉ MAROCAINS')}
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-bold text-[#123D35] text-2xl sm:text-3xl lg:text-[32px] xl:text-[38px] leading-[1.2] tracking-tight">
            <span className="block">
              {t('الجمال المغربي،', 'La beauté marocaine,')}
            </span>
            <span className="block text-[#C89748] font-normal italic font-serif-luxury text-2xl sm:text-3xl lg:text-[32px] xl:text-[38px] mt-0.5 sm:mt-1">
              {t('طبيعي ونفيس.', 'naturellement précieuse.')}
            </span>
          </h1>

          {/* Paragraph */}
          <p className="text-xs sm:text-sm text-[#2D3533]/85 leading-relaxed font-light mt-3 sm:mt-4 mb-5 sm:mb-6 max-w-[480px]">
            {t(
              'عناية أصيلة مستوحاة من كنوز المغرب. مكونات طبيعية بكر من تعاونيات الأطلس، فعالية مثبتة، وجمال متألق.',
              'Des soins authentiques inspirés des trésors du Maroc. Ingrédients naturels, efficacité prouvée, beauté révélée.'
            )}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <a
              href="#bestsellers"
              className="inline-flex items-center justify-center gap-2 bg-[#C89748] hover:bg-[#B88636] text-[#FFFCF7] font-bold text-xs tracking-wider uppercase px-5 sm:px-7 py-3 sm:py-3.5 rounded shadow-sm hover:shadow transition-all duration-300"
            >
              <span>{t('اكتشف منتجاتنا', 'DÉCOUVRIR NOS SOINS')}</span>
            </a>

            <a
              href="#heritage"
              className="inline-flex items-center justify-center gap-2 bg-[#FFFCF7]/90 hover:bg-[#123D35]/5 text-[#123D35] border border-[#123D35]/35 font-semibold text-xs tracking-wider uppercase px-4 sm:px-6 py-3 sm:py-3.5 rounded transition-all duration-300"
            >
              <span>{t('تعرف على قصتنا', 'EN SAVOIR PLUS')}</span>
            </a>
          </div>

          {/* Trust Pillars */}
          <div className="mt-5 sm:mt-6 pt-4 border-t border-[#2D3533]/10 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[#2D3533]/75">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C89748] shrink-0" />
              <span className="font-medium">{t('100% طبيعي', '100% Naturel')}</span>
            </div>
            <span className="text-[#2D3533]/30 hidden xs:inline">•</span>
            <div>
              <span className="font-medium">{t('صنع بالمغرب 🇲🇦', 'Artisanat Marocain')}</span>
            </div>
            <span className="text-[#2D3533]/30 hidden xs:inline">•</span>
            <div>
              <span className="font-medium">{t('الدفع عند الاستلام', 'Paiement à la livraison')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
