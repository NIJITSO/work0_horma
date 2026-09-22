'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '../../context/LanguageContext';

export function HeritageSection() {
  const { t, isRtl } = useLanguage();

  return (
    <section id="heritage" className="relative py-16 sm:py-24 bg-[#FFFCF7] overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-14 lg:items-center">
          {/* Text block: contents on mobile so children follow vertical order, flex column on desktop */}
          <div className="contents lg:flex lg:flex-col lg:justify-center lg:col-span-6 text-start">
            {/* 1. Header (Eyebrow, Title, Description) */}
            <div className="order-1 text-start mb-6 lg:mb-6">
              <span className="text-xs font-bold text-[#C89748] tracking-widest uppercase mb-3 block">
                {t('قصتنا', 'NOTRE HISTOIRE')}
              </span>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-luxury font-bold text-[#123D35] leading-tight mb-6">
                <span>{t('طقوس مغربية أصيلة،', 'Des rituels marocains,')}</span>
                <br />
                <span className={`text-[#C89748] font-normal ${isRtl ? '' : 'italic'}`}>
                  {t('وجمال يعبّر عن حريتكِ.', 'une beauté libre.')}
                </span>
              </h2>

              <p className="text-sm sm:text-base text-[#2D3533]/80 leading-relaxed font-light">
                {t(
                  'وُلدت الحرة من حب التقاليد المغربية لتحتفي بجمال طبيعي، حر وأصيل. تستلهم عنايتنا أسرارها من الطقوس المتوارثة عبر الأجيال، وتجمع بين الأركان والنيلة والورد والنباتات المغربية للعناية ببشرتكِ بكل لطف.',
                  'Née de l’amour des traditions marocaines, Al Hurra célèbre une beauté naturelle, libre et authentique. Nos soins s’inspirent des rituels transmis de génération en génération et associent l’argan, le Nila, la rose et les plantes marocaines pour prendre soin de votre peau avec douceur.'
                )}
              </p>
            </div>

            {/* 3. Statistics */}
            <div className="order-3 mb-8 pt-4 border-t border-[#2D3533]/10 text-start">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-[#123D35]">
                    {t('10 منتجات', '10 soins')}
                  </div>
                  <div className="text-xs text-[#2D3533]/70 mt-1">
                    {t('مجموعة طبيعية ومتكاملة', 'Une collection naturelle et complète')}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#123D35]">
                    {t('3 طقوس', '3 rituels')}
                  </div>
                  <div className="text-xs text-[#2D3533]/70 mt-1">
                    {t('مستوحاة من الخبرة المغربية', 'Inspirés du savoir-faire marocain')}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Button */}
            <div className="order-4">
              <a
                href="#rituals"
                className="inline-flex items-center justify-center gap-2 bg-[#C89748] hover:bg-[#B88636] focus:outline-none focus:ring-2 focus:ring-[#C89748] focus:ring-offset-2 text-[#FFFCF7] font-semibold text-xs uppercase tracking-widest px-8 py-3.5 rounded shadow-sm hover:shadow-md transition-all duration-300 w-full sm:w-auto"
              >
                <span>{t('اكتشفي قصتنا', 'DÉCOUVRIR NOTRE HISTOIRE')}</span>
                <span aria-hidden="true">{isRtl ? '←' : '→'}</span>
              </a>
            </div>
          </div>

          {/* 2. Image Column (order-2 on mobile, col-span-6 on lg) */}
          <div className="order-2 lg:order-none lg:col-span-6 mb-8 lg:mb-0">
            <div className="relative aspect-[4/3] w-full rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl border-4 border-[#F8F4EC] group">
              <Image
                src="/images/rituels/al-hurra-histoire.png"
                alt={t(
                  'منتجات الحرة الطبيعية المستوحاة من طقوس الجمال المغربية',
                  'Produits naturels Al Hurra inspirés des rituels marocains'
                )}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
