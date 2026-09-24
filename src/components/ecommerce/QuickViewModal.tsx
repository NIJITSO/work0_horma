'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice } from '../../utils/format';
import { useCart } from '../../context/CartContext';
import { X, Star, ShoppingBag, Check, Plus, Minus, Sparkles, CheckCircle2 } from 'lucide-react';

export function QuickViewModal() {
  const { t, isRtl } = useLanguage();
  const { quickViewProduct, quickViewInitialVariantId, closeQuickView, addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const triggeringElementRef = useRef<HTMLElement | null>(null);

  const variants = quickViewProduct?.variants || [];

  // Reset quantity and default variant when modal opens
  useEffect(() => {
    if (quickViewProduct) {
      setQuantity(1);
      setIsAdded(false);
      const initialId =
        quickViewInitialVariantId ||
        (quickViewProduct.variants?.length ? quickViewProduct.variants[0].id : null);
      setSelectedVariantId(initialId);
      triggeringElementRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      if (triggeringElementRef.current) {
        triggeringElementRef.current.focus();
      }
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [quickViewProduct]);

  // Support closing with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeQuickView();
      }
    };
    if (quickViewProduct) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quickViewProduct, closeQuickView]);

  const activeVariant = useMemo(() => {
    if (!variants.length) return null;
    return variants.find((v) => v.id === selectedVariantId) || variants[0];
  }, [variants, selectedVariantId]);

  const currentPrice = activeVariant ? activeVariant.price : quickViewProduct?.priceMAD || 0;
  const currentImage = activeVariant?.image || quickViewProduct?.image || '';
  const currentStock = activeVariant ? activeVariant.stock : 50;

  // Available unique sizes and scents
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

  if (!quickViewProduct) return null;

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

  const handleAddToCart = () => {
    addItem(quickViewProduct, quantity, activeVariant || undefined);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      closeQuickView();
    }, 900);
  };

  const benefits = isRtl ? quickViewProduct.benefitsAr : quickViewProduct.benefitsFr;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
      onClick={closeQuickView}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-overlay-in"
    >
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FAF7F2] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#2D3533]/15 relative my-auto"
      >
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          aria-label={t('إغلاق', 'Fermer')}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-20 p-2.5 rounded-full bg-white/90 hover:bg-white text-[#2D3533] hover:text-[#123D35] shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#123D35]/30"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 50/50 Split Container: Image on Left (FR) / Right (AR), Information on other side */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Column 1: Product / Variant Image */}
          <div className="relative aspect-square md:aspect-auto md:min-h-[480px] bg-[#F8F4EC] p-6 sm:p-8 flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-e border-[#2D3533]/10">
            <div className="relative w-full h-full min-h-[260px] sm:min-h-[340px] flex items-center justify-center">
              <Image
                key={currentImage}
                src={currentImage}
                alt={t(quickViewProduct.nameAr, quickViewProduct.nameFr)}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'center',
                }}
                className="transition-all duration-500 hover:scale-105"
              />
            </div>

            {/* Product Badge */}
            {quickViewProduct.badgeAr && (
              <div className="absolute top-4 start-4 bg-[#123D35] text-[#FFFCF7] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow z-10">
                {t(quickViewProduct.badgeAr, quickViewProduct.badgeFr || '')}
              </div>
            )}

            {/* SKU & Stock Pill */}
            {activeVariant && (
              <div className="absolute bottom-3 start-4 end-4 flex items-center justify-between text-[11px] text-[#64746E] bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-[#2D3533]/10">
                <span className="font-mono text-[10px]">{activeVariant.sku}</span>
                <span className="flex items-center gap-1 text-green-700 font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  {t('متوفر في المخزون', 'En stock')}
                </span>
              </div>
            )}
          </div>

          {/* Column 2: Product Information & Variant Selectors */}
          <div className="p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-[#64746E] uppercase tracking-wider mb-2.5">
                <span className="font-semibold text-[#123D35] bg-[#123D35]/10 px-2.5 py-1 rounded-md">
                  {activeVariant?.size ? (isRtl ? activeVariant.size.nameAr || activeVariant.size.value : activeVariant.size.value) : quickViewProduct.volume}
                </span>
                <div className="flex items-center gap-1.5 text-[#C89748]">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold text-[#2D3533]">{quickViewProduct.rating.toFixed(1)}</span>
                  <span className="text-[#64746E]">
                    ({quickViewProduct.reviewCount} {t('تقييم', 'avis')})
                  </span>
                </div>
              </div>

              {/* Full Product Title */}
              <h2
                id="modal-product-title"
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#123D35] leading-tight mb-1"
              >
                {t(quickViewProduct.nameAr, quickViewProduct.nameFr)}
              </h2>

              {/* Subtitle / Active Variant Name */}
              <p className="text-xs sm:text-sm text-[#C89748] font-medium tracking-wide mb-3">
                {activeVariant?.scent
                  ? `${t('الرائحة:', 'Senteur :')} ${t(activeVariant.scent.nameAr || activeVariant.scent.name, activeVariant.scent.name)}`
                  : t(quickViewProduct.subtitleAr, quickViewProduct.subtitleFr)}
              </p>

              {/* Current Price and Crossed-out Old Price */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl sm:text-3xl font-bold text-[#123D35]">
                  {formatPrice(currentPrice)}
                </span>
                {quickViewProduct.originalPriceMAD && (
                  <span className="text-sm sm:text-base text-[#64746E] line-through">
                    {formatPrice(Math.round(currentPrice * 1.25))}
                  </span>
                )}
              </div>

              {/* SCENT SELECTOR (If product has multiple scents) */}
              {availableScents.length > 0 && (
                <div className="mb-4 p-3 bg-white/70 rounded-xl border border-[#2D3533]/10">
                  <div className="text-xs font-semibold text-[#123D35] mb-2 flex items-center justify-between">
                    <span>{t('اختر الرائحة / المكون:', 'Choisir la senteur / parfum :')}</span>
                    {activeVariant?.scent && (
                      <span className="text-[#C89748] font-bold">
                        {t(activeVariant.scent.nameAr || activeVariant.scent.name, activeVariant.scent.name)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {availableScents.map((sc) => {
                      const isSelected = activeVariant?.scent?.slug === sc.slug;
                      return (
                        <button
                          key={sc.id}
                          type="button"
                          onClick={() => handleSelectScent(sc.slug)}
                          className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                            isSelected
                              ? 'bg-[#123D35] text-white border-[#123D35] shadow-xs scale-102'
                              : 'bg-white text-[#2D3533] border-[#2D3533]/20 hover:border-[#123D35]'
                          }`}
                        >
                          {t(sc.nameAr || sc.name, sc.name)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* FIXED SIZE / FORMAT DISPLAY */}
              {(activeVariant?.size || quickViewProduct.volume) && (
                <div className="mb-4 p-3 bg-white/70 rounded-xl border border-[#2D3533]/10 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#123D35]">{t('الحجم / السعة:', 'Format / Contenance :')}</span>
                  <span className="text-xs font-bold text-[#123D35] bg-[#F8F4EC] px-2.5 py-1 rounded-lg border border-[#2D3533]/10">
                    {activeVariant?.size ? (isRtl ? activeVariant.size.nameAr || activeVariant.size.value : activeVariant.size.value) : quickViewProduct.volume}
                  </span>
                </div>
              )}

              {/* Long Description */}
              <p className="text-xs sm:text-sm text-[#2D3533]/85 leading-relaxed font-light mb-4">
                {t(quickViewProduct.descriptionAr, quickViewProduct.descriptionFr)}
              </p>

              {/* Bordered “Bienfaits clés” / “الفوائد الرئيسية” Section */}
              <div className="border border-[#2D3533]/15 rounded-xl p-3.5 bg-[#F8F4EC]/60 mb-4">
                <div className="font-bold text-xs sm:text-sm text-[#123D35] mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C89748]" />
                  <span>{t('الفوائد الرئيسية', 'Bienfaits clés')}</span>
                </div>
                <ul className="space-y-1.5 text-xs text-[#2D3533]/85">
                  {benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#C89748] font-bold text-xs">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ingredients Section */}
              <div className="text-xs text-[#64746E] leading-relaxed mb-4 bg-white/70 p-3 rounded-lg border border-[#2D3533]/10">
                <strong className="text-[#2D3533]">{t('المكونات: ', 'Ingrédients : ')}</strong>
                <span>{t(quickViewProduct.ingredientsAr, quickViewProduct.ingredientsFr)}</span>
              </div>
            </div>

            {/* Quantity Selector & Add-to-Cart Button */}
            <div className="pt-4 border-t border-[#2D3533]/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Quantity selector */}
              <div className="flex items-center justify-between sm:justify-start border border-[#2D3533]/20 rounded-xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label={t('تقليل الكمية', 'Diminuer la quantité')}
                  className="px-3.5 py-3 hover:bg-[#2D3533]/5 text-[#2D3533] transition-colors focus:outline-none"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-[#123D35] min-w-[2.5rem] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label={t('زيادة الكمية', 'Augmenter la quantité')}
                  className="px-3.5 py-3 hover:bg-[#2D3533]/5 text-[#2D3533] transition-colors focus:outline-none"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 px-6 rounded-xl text-xs sm:text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md ${
                  isAdded
                    ? 'bg-[#1A5449] text-white'
                    : 'bg-[#123D35] hover:bg-[#1A5449] text-[#FFFCF7]'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4 text-[#C89748]" />
                    <span>{t('تمت الإضافة للسلة!', 'Ajouté au panier !')}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t('أضف إلى السلة', 'Ajouter au panier')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
