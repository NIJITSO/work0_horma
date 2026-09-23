'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice } from '../../utils/format';
import { useCart } from '../../context/CartContext';
import { Star, ShoppingBag, Check } from 'lucide-react';

export function ProductCard({ product }: { product: Product }) {
  const { t, isRtl } = useLanguage();
  const { addItem, openQuickView } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const variants = product.variants || [];
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    variants.length > 0 ? variants[0].id : null
  );

  const activeVariant = useMemo(() => {
    if (!variants.length) return null;
    return variants.find((v) => v.id === selectedVariantId) || variants[0];
  }, [variants, selectedVariantId]);

  const currentPrice = activeVariant ? activeVariant.price : product.priceMAD;
  const currentImage = activeVariant?.image || product.image;
  const currentVolume = activeVariant?.size ? (isRtl ? activeVariant.size.nameAr || activeVariant.size.value : activeVariant.size.value) : product.volume;

  // Extract unique scents if multiple exist
  const scentVariants = useMemo(() => {
    const list: { id: number; name: string; nameAr?: string; slug: string; variantId: number }[] = [];
    variants.forEach((v) => {
      if (v.scent && !list.some((sc) => sc.slug === v.scent?.slug)) {
        list.push({
          id: v.scent.id,
          name: v.scent.name,
          nameAr: v.scent.nameAr,
          slug: v.scent.slug,
          variantId: v.id,
        });
      }
    });
    return list;
  }, [variants]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1, activeVariant || undefined);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openQuickView(product, activeVariant?.id);
    }
  };

  return (
    <div
      tabIndex={0}
      role="article"
      aria-label={t(product.nameAr, product.nameFr)}
      onKeyDown={handleKeyDown}
      onClick={() => openQuickView(product, activeVariant?.id)}
      className="group flex flex-col h-full w-full bg-[#FFFCF7] border border-[#2D3533]/12 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#123D35]/30 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full bg-[#FAF7F2] p-4 flex items-center justify-center overflow-hidden">
        <Image
          key={currentImage}
          src={currentImage}
          alt={t(product.nameAr, product.nameFr)}
          fill
          sizes="(max-width: 640px) 78vw, (max-width: 1024px) 33vw, 20vw"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
          }}
          className="group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badge */}
        {product.badgeAr && (
          <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 bg-[#123D35] text-[#FFFCF7] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm z-10 pointer-events-none">
            {t(product.badgeAr, product.badgeFr || '')}
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Size / Weight & Rating */}
          <div className="flex items-center justify-between text-[11px] text-[#64746E] uppercase tracking-wider mb-1.5">
            <span className="font-semibold text-[#123D35]/80">{currentVolume}</span>
            <div className="flex items-center gap-1 text-[#C89748]">
              <Star className="w-3 h-3 fill-current" />
              <span className="font-bold text-[#2D3533]">{product.rating.toFixed(1)}</span>
              <span className="text-[10px] text-[#64746E]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            className="text-sm sm:text-base font-bold text-[#123D35] group-hover:text-[#C89748] transition-colors line-clamp-1 min-h-[1.5rem]"
            title={t(product.nameAr, product.nameFr)}
          >
            {t(product.nameAr, product.nameFr)}
          </h3>

          {/* Short Description or Active Scent */}
          <p className="text-xs text-[#2D3533]/70 line-clamp-2 mt-1 font-light min-h-[2rem]">
            {activeVariant?.scent
              ? `${t('السنتور: ', 'Senteur : ')}${t(activeVariant.scent.nameAr || activeVariant.scent.name, activeVariant.scent.name)}`
              : t(product.subtitleAr, product.subtitleFr)}
          </p>

          {/* Scent Variant Quick Pills (If product has multiple scents) */}
          {scentVariants.length > 1 && (
            <div
              className="flex items-center gap-1 flex-wrap mt-2 pt-2 border-t border-[#2D3533]/10"
              onClick={(e) => e.stopPropagation()}
            >
              {scentVariants.map((sc) => {
                const isSelected = activeVariant?.scent?.slug === sc.slug;
                return (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVariantId(sc.variantId);
                    }}
                    className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition-all ${
                      isSelected
                        ? 'bg-[#123D35] text-white shadow-xs font-bold scale-102'
                        : 'bg-[#F8F4EC] text-[#2D3533]/80 hover:bg-[#EAE2D2] hover:text-[#123D35]'
                    }`}
                  >
                    {t(sc.nameAr || sc.name, sc.name)}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Pricing & Add to Cart */}
        <div className="pt-2 border-t border-[#2D3533]/5 flex flex-col gap-2.5">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold text-[#123D35]">
              {formatPrice(currentPrice)}
            </span>
            {product.originalPriceMAD && (
              <span className="text-xs text-[#64746E] line-through">
                {formatPrice(Math.round(currentPrice * 1.25))}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-300 shadow-sm ${
              isAdded
                ? 'bg-[#1A5449] text-white'
                : 'bg-[#123D35] hover:bg-[#1A5449] text-[#FFFCF7]'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#C89748]" />
                <span>{t('تمت الإضافة للسلة!', 'Ajouté au panier !')}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{t('أضف إلى السلة', 'Ajouter au panier')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
