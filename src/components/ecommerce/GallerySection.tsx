'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '../../context/LanguageContext';
import { GALLERY_IMAGES, BRAND } from '../../data/content';

function InstagramIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const INSTAGRAM_URL = BRAND.instagramUrl;

export function GallerySection() {
  const { t } = useLanguage();

  return (
    <section className="py-12 bg-[#FFFCF7] border-b border-[#2D3533]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#C89748] hover:text-[#B68536] uppercase tracking-widest mb-1 transition-colors group cursor-pointer"
          >
            <InstagramIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>@alhurra_officiel</span>
          </a>
          <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-[#123D35] italic">
            {t('لحظات جمال أصيلة من عالمنا', 'L’univers AL HURRA en images')}
          </h2>
        </div>

        {/* 5 Grid items */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {GALLERY_IMAGES.map((img, idx) => (
            <a
              key={idx}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-xl bg-[#F8F4EC] shadow-sm hover:shadow-lg transition-all duration-300 block"
              aria-label={t(img.altAr, img.altFr)}
            >
              <Image
                src={img.src}
                alt={t(img.altAr, img.altFr)}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-[#123D35]/0 group-hover:bg-[#123D35]/40 transition-colors duration-300 flex items-center justify-center">
                <InstagramIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
