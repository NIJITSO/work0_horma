'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';

export function BestsellersSection({
  products = [],
  selectedCategory,
}: {
  products?: Product[];
  selectedCategory?: string;
}) {
  const { t, isRtl } = useLanguage();

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory || selectedCategory === 'all')
    : products;

  return (
    <section id="bestsellers" className="py-12 sm:py-16 bg-[#F8F4EC]/60 border-y border-[#2D3533]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold text-[#C89748] tracking-widest uppercase">
              {t('مجموعة مختارة بعناية', 'SÉLECTION D’EXCEPTION')}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-luxury font-bold text-[#123D35] italic mt-1">
              {t('أفضل مبيعاتنا الحصرية', 'Meilleures ventes')}
            </h2>
          </div>

          <a
            href="#bestsellers"
            className="text-xs sm:text-sm font-semibold text-[#123D35] hover:text-[#C89748] transition-colors inline-flex items-center gap-1.5 uppercase tracking-wider"
          >
            <span>{t('عرض جميع المستحضرات', 'Voir tous les soins')}</span>
            <span>{isRtl ? '←' : '→'}</span>
          </a>
        </div>

        {/* Product Cards Layout: 5 on large desktop, 4 on laptop, 2-3 on tablet, 1.2 on mobile */}
        <div className="flex sm:grid overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 gap-4 sm:gap-6 snap-x snap-mandatory sm:snap-none scrollbar-none sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="w-[78vw] max-w-[280px] sm:w-auto sm:max-w-none shrink-0 sm:shrink snap-start flex"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
