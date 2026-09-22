'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice } from '../../utils/format';
import { useCart } from '../../context/CartContext';
import { X, Star, ShoppingBag, Check, Plus, Minus, Sparkles } from 'lucide-react';

export function QuickViewModal() {
  const { t, isRtl } = useLanguage();
  const { quickViewProduct, closeQuickView, addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const triggeringElementRef = useRef<HTMLElement | null>(null);

  // Reset quantity when modal opens for a new product
  useEffect(() => {
    if (quickViewProduct) {
      setQuantity(1);
      setIsAdded(false);
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

  if (!quickViewProduct) return null;

  const handleAddToCart = () => {
    addItem(quickViewProduct, quantity);
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
          {/* Column 1: Product Image */}
          <div className="relative aspect-square md:aspect-auto md:min-h-[460px] bg-[#F8F4EC] p-6 sm:p-8 flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-e border-[#2D3533]/10">
            <div className="relative w-full h-full min-h-[250px] sm:min-h-[320px] flex items-center justify-center">
              <Image
                src={quickViewProduct.image}
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
                className="transition-transform duration-500 hover:scale-105"
              />
            </div>

            {/* Product Badge */}
            {quickViewProduct.badgeAr && (
              <div className="absolute top-4 start-4 bg-[#123D35] text-[#FFFCF7] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow z-10">
                {t(quickViewProduct.badgeAr, quickViewProduct.badgeFr || '')}
              </div>
            )}
          </div>

          {/* Column 2: Product Information */}
          <div className="p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* 1. Size or Weight & 2. Rating and Review Count */}
              <div className="flex items-center justify-between text-xs text-[#64746E] uppercase tracking-wider mb-2.5">
                <span className="font-semibold text-[#123D35] bg-[#123D35]/10 px-2.5 py-1 rounded-md">
                  {quickViewProduct.volume}
                </span>
                <div className="flex items-center gap-1.5 text-[#C89748]">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold text-[#2D3533]">{quickViewProduct.rating.toFixed(1)}</span>
                  <span className="text-[#64746E]">
                    ({quickViewProduct.reviewCount} {t('تقييم', 'avis')})
                  </span>
                </div>
              </div>

              {/* 3. Full Product Title */}
              <h2
                id="modal-product-title"
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#123D35] leading-tight mb-1.5"
              >
                {t(quickViewProduct.nameAr, quickViewProduct.nameFr)}
              </h2>

              {/* 4. Short Description */}
              <p className="text-xs sm:text-sm text-[#C89748] font-medium tracking-wide mb-3">
                {t(quickViewProduct.subtitleAr, quickViewProduct.subtitleFr)}
              </p>

              {/* 5. Current Price and Crossed-out Old Price */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl sm:text-3xl font-bold text-[#123D35]">
                  {formatPrice(quickViewProduct.priceMAD)}
                </span>
                {quickViewProduct.originalPriceMAD && (
                  <span className="text-sm sm:text-base text-[#64746E] line-through">
                    {formatPrice(quickViewProduct.originalPriceMAD)}
                  </span>
                )}
              </div>

              {/* 6. Long Description */}
              <p className="text-xs sm:text-sm text-[#2D3533]/85 leading-relaxed font-light mb-5">
                {t(quickViewProduct.descriptionAr, quickViewProduct.descriptionFr)}
              </p>

              {/* 7. Bordered “Bienfaits clés” / “الفوائد الرئيسية” Section */}
              <div className="border border-[#2D3533]/15 rounded-xl p-4 bg-[#F8F4EC]/60 mb-5">
                <div className="font-bold text-sm text-[#123D35] mb-2.5 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C89748]" />
                  <span>{t('الفوائد الرئيسية', 'Bienfaits clés')}</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-[#2D3533]/85">
                  {benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#C89748] font-bold text-sm">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 8. Ingredients Section */}
              <div className="text-xs sm:text-sm text-[#64746E] leading-relaxed mb-6 bg-white/70 p-3.5 rounded-lg border border-[#2D3533]/10">
                <strong className="text-[#2D3533]">{t('المكونات: ', 'Ingrédients : ')}</strong>
                <span>{t(quickViewProduct.ingredientsAr, quickViewProduct.ingredientsFr)}</span>
              </div>
            </div>

            {/* 9. Quantity Selector & 10. Add-to-Cart Button */}
            <div className="pt-4 border-t border-[#2D3533]/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Quantity selector */}
              <div className="flex items-center justify-between sm:justify-start border border-[#2D3533]/20 rounded-xl overflow-hidden bg-white">
                <button
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
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label={t('زيادة الكمية', 'Augmenter la quantité')}
                  className="px-3.5 py-3 hover:bg-[#2D3533]/5 text-[#2D3533] transition-colors focus:outline-none"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart button */}
              <button
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
