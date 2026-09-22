'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '../../context/LanguageContext';
import { CATEGORIES } from '../../data/content';
import { DecorativeDivider } from '../ui/DecorativeDivider';

export function CategoriesSection({
  activeCategory,
  onSelectCategory,
}: {
  activeCategory?: string;
  onSelectCategory?: (slug: string) => void;
}) {
  const { t } = useLanguage();

  return (
    <section id="categories" className="py-12 sm:py-16 bg-[#FFFCF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#123D35] italic tracking-wide">
            {t('تسوق حسب الفئة', 'Acheter par catégorie')}
          </h2>
          <DecorativeDivider className="mt-2" />
        </div>

        {/* Categories Circular Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 sm:gap-8 justify-items-center">
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory && onSelectCategory(cat.slug)}
                className="group flex flex-col items-center cursor-pointer text-center focus:outline-none"
              >
                {/* Round Image Frame */}
                <div
                  className={`relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden p-1 transition-all duration-300 shadow-sm group-hover:shadow-md ${
                    isSelected
                      ? 'border-2 border-[#123D35] ring-2 ring-[#C89748]/50 scale-105'
                      : 'border border-[#2D3533]/15 group-hover:border-[#C89748] group-hover:scale-105'
                  }`}
                >
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    <Image
                      src={cat.image}
                      alt={cat.nameFr}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Category Label */}
                <span
                  className={`mt-3 text-xs sm:text-sm font-semibold tracking-wide uppercase transition-colors ${
                    isSelected
                      ? 'text-[#123D35] border-b border-[#123D35]'
                      : 'text-[#2D3533] group-hover:text-[#123D35]'
                  }`}
                >
                  {t(cat.nameAr, cat.nameFr)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
