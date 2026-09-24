'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Product, ProductVariant } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/format';
import { Star, ShoppingBag, Check } from 'lucide-react';

interface BoutiqueProductCardProps {
  product: Product;
}

export function BoutiqueProductCard({ product }: BoutiqueProductCardProps) {
  const { language, t, isRtl } = useLanguage();
  const { addItem, openQuickView } = useCart();

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
  const currentStock = activeVariant ? activeVariant.stock : (product.inStock ? 50 : 0);

  // Available unique sizes and scents for this product
  const availableSizes = useMemo(() => {
    const list: { id: number; value: string; nameAr?: string }[] = [];
    variants.forEach((v) => {
      if (v.size && !list.some((s) => s.value === v.size?.value)) {
        list.push({ id: v.size.id, value: v.size.value, nameAr: v.size.nameAr });
      }
    });
    return list;
  }, [variants]);

  const availableScents = useMemo(() => {
    const list: { id: number; name: string; nameAr?: string; slug: string }[] = [];
    variants.forEach((v) => {
      if (v.scent && !list.some((sc) => sc.slug === v.scent?.slug)) {
        list.push({
          id: v.scent.id,
          name: v.scent.name,
          nameAr: v.scent.nameAr,
          slug: v.scent.slug,
        });
      }
    });
    return list;
  }, [variants]);

  const handleSelectSize = (sizeValue: string) => {
    const matched = variants.find(
      (v) =>
        v.size?.value === sizeValue &&
        (activeVariant?.scentId ? v.scentId === activeVariant.scentId : true)
    );
    if (matched) {
      setSelectedVariantId(matched.id);
    } else {
      const anyWithSize = variants.find((v) => v.size?.value === sizeValue);
      if (anyWithSize) setSelectedVariantId(anyWithSize.id);
    }
  };

  const handleSelectScent = (scentSlug: string) => {
    const matched = variants.find(
      (v) =>
        v.scent?.slug === scentSlug &&
        (activeVariant?.sizeId ? v.sizeId === activeVariant.sizeId : true)
    );
    if (matched) {
      setSelectedVariantId(matched.id);
    } else {
      const anyWithScent = variants.find((v) => v.scent?.slug === scentSlug);
      if (anyWithScent) setSelectedVariantId(anyWithScent.id);
    }
  };

  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(product, 1, activeVariant || undefined);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div
      onClick={() => openQuickView(product, activeVariant?.id)}
      className="group relative bg-[#FFFCF7] rounded-2xl overflow-hidden border border-[#2D3533]/15 hover:border-[#123D35]/40 transition-all duration-300 hover:shadow-xl flex flex-col h-full cursor-pointer"
    >
      {/* Product Image Frame */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#F8F4EC]/60">
        <Image
          key={currentImage}
          src={currentImage}
          alt={t(product.nameAr, product.nameFr)}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badge (Top Left / Right) */}
        {product.badgeAr && (
          <div className="absolute top-3 start-3 z-10 pointer-events-none">
            <span className="bg-[#123D35]/90 text-[#FFFCF7] text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-xs">
              {t(product.badgeAr, product.badgeFr || product.badgeAr)}
            </span>
          </div>
        )}

        {/* Stock Alert */}
        {currentStock < 10 && currentStock > 0 && (
          <div className="absolute bottom-2 start-2 z-10 pointer-events-none">
            <span className="bg-amber-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
              {t(`باقي ${currentStock} فقط!`, `Plus que ${currentStock} en stock !`)}
            </span>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Rating & Category */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#C89748]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-[#2D3533]">{product.rating}</span>
              <span className="text-[#64746E] text-[11px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-sm sm:text-base text-[#123D35] leading-snug line-clamp-1 group-hover:text-[#C89748] transition-colors">
            {t(product.nameAr, product.nameFr)}
          </h3>

          {/* Subtitle / Description */}
          <p className="text-xs text-[#64746E] mt-1 line-clamp-2 leading-relaxed">
            {t(product.subtitleAr || product.descriptionAr, product.subtitleFr || product.descriptionFr)}
          </p>
        </div>

        {/* Interactive Variant Options (Sizes & Scents) */}
        <div className="space-y-2.5 pt-2 border-t border-[#2D3533]/10">
          {/* Scent selector */}
          {availableScents.length > 1 && (
            <div onClick={(e) => e.stopPropagation()}>
              <div className="text-[11px] font-semibold text-[#123D35] mb-1 flex items-center justify-between">
                <span>{t('السنتور (الرائحة):', 'Senteur :')}</span>
                <span className="text-[#C89748] font-medium">
                  {t(
                    activeVariant?.scent?.nameAr || activeVariant?.scent?.name || '',
                    activeVariant?.scent?.name || ''
                  )}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {availableScents.map((sc) => {
                  const isSelected = activeVariant?.scent?.slug === sc.slug;
                  return (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectScent(sc.slug);
                      }}
                      className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all ${
                        isSelected
                          ? 'bg-[#123D35] text-white shadow-xs'
                          : 'bg-[#F8F4EC] text-[#2D3533] hover:bg-[#EAE2D2]'
                      }`}
                    >
                      {t(sc.nameAr || sc.name, sc.name)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Fixed Format / Size display */}
          {(activeVariant?.size || product.volume) && (
            <div className="flex items-center justify-between text-[11px] font-medium text-[#64746E]">
              <span>{t('الحجم / السعة:', 'Format :')}</span>
              <span className="font-semibold text-[#123D35] bg-[#F8F4EC] px-2 py-0.5 rounded-md border border-[#2D3533]/10">
                {activeVariant?.size ? (isRtl ? activeVariant.size.nameAr || activeVariant.size.value : activeVariant.size.value) : product.volume}
              </span>
            </div>
          )}

          {/* Pricing & SKU */}
          <div className="flex items-baseline justify-between pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold text-[#123D35]">
                {formatPrice(currentPrice)}
              </span>
              {product.originalPriceMAD && product.originalPriceMAD > currentPrice && (
                <span className="text-xs text-[#64746E] line-through">
                  {formatPrice(product.originalPriceMAD)}
                </span>
              )}
            </div>
            {activeVariant?.sku && (
              <span className="text-[10px] text-[#64746E] font-mono">
                {activeVariant.sku}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart CTA */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart();
          }}
          disabled={currentStock <= 0}
          className={`w-full font-semibold text-xs sm:text-sm py-2.5 px-3 rounded-xl shadow-xs transition-all duration-300 flex items-center justify-center gap-2 ${
            isAdded
              ? 'bg-[#1A5449] text-white'
              : 'bg-[#123D35] hover:bg-[#1A5449] text-[#FFFCF7]'
          } disabled:bg-gray-300 disabled:cursor-not-allowed`}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4 text-[#C89748]" />
              <span>{t('تمت الإضافة للسلة!', 'Ajouté au panier !')}</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>
                {currentStock <= 0
                  ? t('نفذ من المخزون', 'Épuisé')
                  : t('أضف إلى السلة', 'Ajouter au panier')}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
