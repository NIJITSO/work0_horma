'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '../../context/LanguageContext';
import { TESTIMONIALS } from '../../data/content';
import { Star, CheckCircle2, Quote } from 'lucide-react';
import { DecorativeDivider } from '../ui/DecorativeDivider';

export function TestimonialsSection() {
  const { t, isRtl } = useLanguage();

  return (
    <section className="py-16 sm:py-24 bg-[#F8F4EC]/70 border-b border-[#2D3533]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-[#C89748] tracking-widest uppercase block mb-2">
            {t('تجارب حقيقية', 'TÉMOIGNAGES CLIENTES')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-[#123D35] italic">
            {isRtl ? (
              <>
                ما تقوله عميلاتنا عن <span dir="ltr" className="inline-block">AL HURRA</span>
              </>
            ) : (
              'Elles ont adopté nos rituels'
            )}
          </h2>
          <DecorativeDivider className="mt-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="bg-[#FFFCF7] border border-[#2D3533]/10 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Rating Stars & Quote icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-[#C89748]">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#123D35]/20" />
                </div>

                {/* Comment */}
                <p className="text-sm text-[#2D3533]/85 leading-relaxed font-light italic mb-6">
                  &ldquo;{t(item.commentAr, item.commentFr)}&rdquo;
                </p>
              </div>

              {/* User Profile */}
              <div className="pt-4 border-t border-[#2D3533]/10 flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#C89748] shrink-0">
                  <Image
                    src={item.avatar}
                    alt={t(item.nameAr, item.nameFr)}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-sm text-[#123D35]">
                      {t(item.nameAr, item.nameFr)}
                    </h4>
                    {item.verified && (
                      <CheckCircle2 className="w-4 h-4 text-[#123D35]" />
                    )}
                  </div>
                  <div className="text-xs text-[#64746E]">
                    {t(item.locationAr, item.locationFr)}
                  </div>
                  <div className="text-[11px] text-[#C89748] font-medium mt-0.5">
                    {t('المنتج: ', 'Produit : ')}
                    {t(item.productNameAr, item.productNameFr)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
