'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { DecorativeDivider } from '../ui/DecorativeDivider';
import { formatPrice } from '../../utils/format';
import { Product } from '../../types';
import { Eye, ArrowRight, ArrowLeft } from 'lucide-react';

interface ProductHotspotConfig {
  slug: string;
  variantScentSlug?: string;
  nameFr: string;
  nameAr: string;
  subtitleFr: string;
  subtitleAr: string;
  tagFr: string;
  tagAr: string;
  // Exact percentage coordinates on the 1672 x 941 canvas
  x: number;
  y: number;
  tooltipPlacement: 'top' | 'bottom';
  align?: 'center' | 'left' | 'right';
}

// 9 products with calibrated coordinates centered on top/lid of each item
const PRODUCT_HOTSPOTS: ProductHotspotConfig[] = [
  {
    slug: 'savon-noir',
    variantScentSlug: 'naturel',
    nameFr: 'Savon Naturel Artisanal',
    nameAr: 'صابون طبيعي تقليدي',
    subtitleFr: 'À l’huile d’argan & plantes',
    subtitleAr: 'بزيت الأركان والأعشاب الطبيعية',
    tagFr: '100% Naturel · 100g',
    tagAr: 'طبيعي 100% · 100غ',
    x: 23.2,
    y: 41.0,
    tooltipPlacement: 'top',
    align: 'center',
  },
  {
    slug: 'serum-argan-hibiscus',
    variantScentSlug: 'hibiscus',
    nameFr: 'Sérum Argan & Hibiscus',
    nameAr: 'سيروم أركان وكركديه',
    subtitleFr: 'Soin capillaire fortifiant & barbe',
    subtitleAr: 'عناية مقوية للشعر واللحية',
    tagFr: 'Flacon pompe · 50ml',
    tagAr: 'مضخة فاخرة · 50مل',
    x: 34.3,
    y: 20.5,
    tooltipPlacement: 'bottom',
    align: 'center',
  },
  {
    slug: 'creme-hydratante-argan',
    nameFr: 'Crème Hydratante à l’Argan',
    nameAr: 'كريم مرطب بزيت الأركان',
    subtitleFr: 'Texture veloutée & hydratation 24h',
    subtitleAr: 'ملمس مخملي وترطيب عميق 24 ساعة',
    tagFr: 'Soin Visage · 50g',
    tagAr: 'عناية الوجه · 50غ',
    x: 46.2,
    y: 35.5,
    tooltipPlacement: 'top',
    align: 'center',
  },
  {
    slug: 'serum-argan',
    nameFr: 'Sérum Visage Huile d’Argan',
    nameAr: 'سيروم الوجه بزيت الأركان',
    subtitleFr: 'Élixir repulpant & anti-âge',
    subtitleAr: 'إكسير مجدد وممتلئ للبشرة',
    tagFr: 'Flacon pipette · 30ml',
    tagAr: 'قطارة زجاجية · 30مل',
    x: 59.5,
    y: 23.5,
    tooltipPlacement: 'bottom',
    align: 'center',
  },
  {
    slug: 'gel-douche-argan-miel',
    variantScentSlug: 'miel',
    nameFr: 'Gel Douche Argan & Miel',
    nameAr: 'جل استحمام أركان وعسل',
    subtitleFr: 'Nettoyage soyeux & parfum ambré',
    subtitleAr: 'نظافة حريرية وعطر عنبري ساحر',
    tagFr: 'Flacon · 100ml',
    tagAr: 'قارورة · 100مل',
    x: 70.0,
    y: 15.0,
    tooltipPlacement: 'bottom',
    align: 'center',
  },
  {
    slug: 'eau-rose',
    variantScentSlug: 'rose',
    nameFr: 'Lait Corporel à base de Rose',
    nameAr: 'حليب الجسم بورد قلعة مكونة',
    subtitleFr: 'Voile satiné hydratant & parfumé',
    subtitleAr: 'لمسة حريرية مرطبة ومعطرة',
    tagFr: 'Soin Corps · 100ml',
    tagAr: 'عناية الجسم · 100مل',
    x: 79.8,
    y: 16.5,
    tooltipPlacement: 'bottom',
    align: 'right',
  },
  {
    slug: 'gommage-corps',
    variantScentSlug: 'nila',
    nameFr: 'Gommage Corps à la Nila',
    nameAr: 'مقشر الجسم بالنيلة الزرقاء',
    subtitleFr: 'Exfoliation hammam & peau soyeuse',
    subtitleAr: 'تقشير حمام مغربي ولمعان استثنائي',
    tagFr: 'Pot généreux · 200g',
    tagAr: 'حجم سخي · 200غ',
    x: 48.2,
    y: 58.5,
    tooltipPlacement: 'top',
    align: 'center',
  },
  {
    slug: 'baume-levres',
    nameFr: 'Baume à Lèvres à l’Argan',
    nameAr: 'بلسم الشفاه بالأركان الطبيعي',
    subtitleFr: 'Nutrition intense & spatule bois',
    subtitleAr: 'تغذية وحماية مكثفة مع ملعقة خشبية',
    tagFr: 'Cire d’abeille · 20g',
    tagAr: 'شمع النحل · 20غ',
    x: 64.5,
    y: 64.5,
    tooltipPlacement: 'top',
    align: 'center',
  },
  {
    slug: 'gommage-visage-nila',
    nameFr: 'Gommage Visage Nila & Herbes',
    nameAr: 'مقشر الوجه بالنيلة والأعشاب',
    subtitleFr: 'Grains fins exfoliants éclat immédiat',
    subtitleAr: 'حبيبات دقيقة لتفتيح ونعومة فورية',
    tagFr: 'Soin doux · 100g',
    tagAr: 'عناية لطيفة · 100غ',
    x: 81.0,
    y: 61.5,
    tooltipPlacement: 'top',
    align: 'right',
  },
];

/**
 * Authentic Moroccan geometric rosette emblem for buttons
 */
function MoroccanRosette({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2.2L14.4 6.8L19.4 4.7L18.3 9.9L23.2 12L18.3 14.1L19.4 19.3L14.4 17.2L12 21.8L9.6 17.2L4.6 19.3L5.7 14.1L0.8 12L5.7 9.9L4.6 4.7L9.6 6.8L12 2.2Z" />
      <circle cx="12" cy="12" r="2.3" className="fill-[#123D35]" />
    </svg>
  );
}

interface InteractivePackSectionProps {
  products?: Product[];
}

export function InteractivePackSection({ products = [] }: InteractivePackSectionProps) {
  const { t, isRtl } = useLanguage();
  const { openQuickView } = useCart();
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const productMap = React.useMemo(() => {
    const map = new Map<string, Product>();
    products.forEach((p) => map.set(p.id, p));
    return map;
  }, [products]);

  const handleProductSelect = (hotspot: ProductHotspotConfig) => {
    const prod = productMap.get(hotspot.slug);
    if (!prod) return;

    const targetVariant = hotspot.variantScentSlug
      ? prod.variants?.find((v) => v.scent?.slug === hotspot.variantScentSlug)
      : prod.variants?.[0];

    openQuickView(prod, targetVariant?.id);
  };

  return (
    <section
      id="bestsellers"
      className="py-14 sm:py-20 lg:py-24 bg-[#FFFCF7] border-y border-[#2D3533]/10 relative overflow-hidden"
    >
      {/* Background ambient accents */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#F8F4EC] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 bg-[#F8F4EC] border border-[#C89748]/40 text-[#123D35] px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-3.5 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C89748]" />
            <span>{t('التشكيلة المغربية الأصيلة الكاملة', 'RITUELS COMPLETS · 9 SOINS D’EXCEPTION')}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C89748]" />
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-luxury font-bold text-[#123D35] italic tracking-wide">
            {t('المستحضرات التسعة في مشهد واحد', 'Nos Soins d’Exception en un Coup d’Œil')}
          </h2>

          <DecorativeDivider className="my-3.5" />

          <p className="text-xs sm:text-sm text-[#64746E] font-light max-w-xl mx-auto leading-relaxed">
            {t(
              'انقري على أي مستحضر فوق المنصة لاستكشاف تركيبته وفوائده الطبيعية واقتنائه مباشرة.',
              'Pointez ou cliquez sur les médaillons dorés pour découvrir chaque formule et la commander.'
            )}
          </p>
        </div>

        {/* Master Showcase Frame with Moroccan Arch Styling */}
        <div className="relative p-2 sm:p-3.5 lg:p-4 rounded-3xl bg-gradient-to-b from-[#F2ECE1] via-[#FAF7F2] to-[#EAE0CD] border border-[#C89748]/40 shadow-[0_20px_60px_-15px_rgba(18,61,53,0.18)]">
          {/* Strict LTR Container for Pixel-Perfect % Coordinates in Both Languages */}
          <div dir="ltr" className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-inner bg-[#123D35]/10 select-none">
            <Image
              src="/images/homePage/packDynamic.png"
              alt={t(
                'مستحضرات الحرة التسعة الطبيعية',
                'Les 9 soins naturels Al Hurra sur podium marocain'
              )}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
            />

            {/* Subtle cinematic gradient at bottom & top */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10 pointer-events-none" />

            {/* 9 Accurate Selection Buttons (NO Blinking / NO Flashing) */}
            {PRODUCT_HOTSPOTS.map((hotspot) => {
              const prod = productMap.get(hotspot.slug);
              const price = prod?.priceMAD;
              const isActive = activeSlug === hotspot.slug;

              return (
                <div
                  key={hotspot.slug}
                  style={{
                    left: `${hotspot.x}%`,
                    top: `${hotspot.y}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                  onMouseEnter={() => setActiveSlug(hotspot.slug)}
                  onMouseLeave={() => setActiveSlug(null)}
                >
                  {/* Selection Button */}
                  <button
                    onClick={() => handleProductSelect(hotspot)}
                    aria-label={t(
                      `عرض تفاصيل ${hotspot.nameAr} - ${price ? `${price} درهم` : ''}`,
                      `Afficher ${hotspot.nameFr} - ${price ? `${price} DH` : ''}`
                    )}
                    className="relative flex items-center justify-center p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-[#C89748] transition-transform duration-300 group-hover:scale-115 active:scale-95"
                  >
                    {/* Calm, Static Gold Ring Halo (NO Blinking, NO animate-ping) */}
                    <span className="absolute inset-0.5 rounded-full bg-[#C89748]/20 ring-1 ring-[#C89748]/50 shadow-[0_2px_12px_rgba(200,151,72,0.35)] transition-all duration-300 group-hover:ring-[#C89748] group-hover:bg-[#C89748]/30 group-hover:shadow-[0_4px_18px_rgba(200,151,72,0.6)]" />

                    {/* Elegant Moroccan Jewel Medallion */}
                    <span className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#123D35] border-1.5 border-[#C89748] text-[#C89748] flex items-center justify-center shadow-md transition-colors duration-300 group-hover:bg-[#C89748] group-hover:text-[#123D35]">
                      <MoroccanRosette className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:rotate-45" />
                    </span>
                  </button>

                  {/* Tooltip Card: ONLY SHOWN ON HOVER OR FOCUS */}
                  <div
                    className={`absolute z-30 pointer-events-none transition-all duration-200 ease-out ${
                      hotspot.tooltipPlacement === 'bottom'
                        ? 'top-full mt-1.5'
                        : 'bottom-full mb-1.5'
                    } ${
                      hotspot.align === 'right'
                        ? 'right-0 translate-x-4 sm:translate-x-0'
                        : hotspot.align === 'left'
                        ? 'left-0 -translate-x-4 sm:translate-x-0'
                        : 'left-1/2 -translate-x-1/2'
                    } ${
                      isActive
                        ? 'opacity-100 scale-100 translate-y-0'
                        : 'opacity-0 scale-95 pointer-events-none invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible'
                    }`}
                  >
                    <div
                      dir={isRtl ? 'rtl' : 'ltr'}
                      className="bg-[#0E302A]/95 backdrop-blur-md text-[#FFFCF7] border border-[#C89748]/70 px-3.5 py-2.5 rounded-xl shadow-2xl min-w-[190px] max-w-[240px] text-center space-y-1 relative"
                    >
                      {/* Little decorative gold crown bar */}
                      <div className="w-6 h-0.5 bg-[#C89748] mx-auto rounded-full mb-1" />

                      <div className="font-serif-luxury font-bold text-xs sm:text-sm text-[#FFFCF7] tracking-wide leading-tight">
                        {t(hotspot.nameAr, hotspot.nameFr)}
                      </div>

                      <div className="text-[10px] text-[#C89748] font-light">
                        {t(hotspot.tagAr, hotspot.tagFr)}
                      </div>

                      <div className="pt-1 flex items-center justify-between border-t border-white/10 text-xs">
                        {price && (
                          <span className="font-bold text-[#C89748]">
                            {formatPrice(price)}
                          </span>
                        )}
                        <span className="text-[10px] text-white/80 font-medium flex items-center gap-1 group-hover:text-white">
                          <span>{t('انقري للطلب', 'Voir le soin')}</span>
                          <span className="rtl:rotate-180">→</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile & Accessible Product Carousel (Matching Moroccan Circular Theme) */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <span className="text-[11px] font-bold text-[#C89748] tracking-widest uppercase">
                {t('تشكيلة متكاملة', 'SÉLECTION PARFUMÉE')}
              </span>
              <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-[#123D35] italic">
                {t('مستحضراتنا التسعة بالكامل', 'Tous les 9 soins de la gamme')}
              </h3>
            </div>

            <Link
              href="/boutique"
              className="text-xs font-semibold text-[#123D35] hover:text-[#C89748] transition-colors inline-flex items-center gap-1.5 uppercase tracking-wider group"
            >
              <span>{t('تصفح المتجر بالكامل', 'Toute la boutique')}</span>
              {isRtl ? (
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              )}
            </Link>
          </div>

          {/* Elegant Circular Product Strip */}
          <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-9 gap-3 sm:gap-4 overflow-x-auto pb-3 scrollbar-none snap-x">
            {PRODUCT_HOTSPOTS.map((hotspot) => {
              const prod = productMap.get(hotspot.slug);
              const price = prod?.priceMAD;
              const img = prod?.image || '/images/products/savon-noir.jpeg';
              const isItemActive = activeSlug === hotspot.slug;

              return (
                <button
                  key={hotspot.slug}
                  onClick={() => handleProductSelect(hotspot)}
                  onMouseEnter={() => setActiveSlug(hotspot.slug)}
                  onMouseLeave={() => setActiveSlug(null)}
                  className={`flex-shrink-0 w-32 sm:w-auto p-2.5 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center group cursor-pointer snap-start focus:outline-none focus:ring-2 focus:ring-[#123D35] ${
                    isItemActive
                      ? 'bg-[#F8F4EC] border-[#C89748] shadow-md -translate-y-1'
                      : 'bg-[#FFFCF7] border-[#2D3533]/12 hover:border-[#C89748] hover:bg-[#F8F4EC]/60 hover:-translate-y-0.5'
                  }`}
                  aria-label={t(
                    `فتح تفاصيل ${hotspot.nameAr}`,
                    `Afficher la fiche de ${hotspot.nameFr}`
                  )}
                >
                  {/* Round Avatar with Gold Ring Accent */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden p-0.5 border border-[#C89748]/50 group-hover:border-[#123D35] transition-colors mb-2 bg-white shadow-2xs">
                    <div className="relative w-full h-full rounded-full overflow-hidden">
                      <Image
                        src={img}
                        alt={hotspot.nameFr}
                        fill
                        sizes="80px"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>

                  {/* Product Title */}
                  <span className="font-semibold text-[11px] sm:text-xs text-[#123D35] line-clamp-1 group-hover:text-[#C89748] transition-colors">
                    {t(hotspot.nameAr, hotspot.nameFr)}
                  </span>

                  {/* Format Tag */}
                  <span className="text-[10px] text-[#64746E] line-clamp-1 mt-0.5 font-light">
                    {t(hotspot.tagAr, hotspot.tagFr)}
                  </span>

                  {/* Price Tag */}
                  {price && (
                    <span className="mt-1.5 text-xs font-bold text-[#123D35]">
                      {formatPrice(price)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
