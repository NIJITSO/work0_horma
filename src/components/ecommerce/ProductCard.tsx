'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice } from '../../utils/format';
import { useCart } from '../../context/CartContext';
import { Star, Eye, ShoppingBag, Check } from 'lucide-react';

export function ProductCard({ product }: { product: Product }) {
  const { t } = useLanguage();
  const { addItem, openQuickView } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openQuickView(product);
    }
  };

  return (
    <div
      tabIndex={0}
      role="article"
      aria-label={t(product.nameAr, product.nameFr)}
      onKeyDown={handleKeyDown}
      onClick={() => openQuickView(product)}
      className="group flex flex-col h-full w-full bg-[#FFFCF7] border border-[#2D3533]/12 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#123D35]/30 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full bg-[#FAF7F2] p-4 flex items-center justify-center overflow-hidden">
        <Image
          src={product.image}
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
          <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 bg-[#123D35] text-[#FFFCF7] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm z-10">
            {t(product.badgeAr, product.badgeFr || '')}
          </div>
        )}

        {/* Quick View Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            openQuickView(product);
          }}
          aria-label={t('معاينة سريعة', 'Aperçu rapide')}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/95 hover:bg-white text-[#123D35] text-xs font-semibold px-4 py-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap z-10"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{t('معاينة سريعة', 'Aperçu rapide')}</span>
        </button>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Size / Weight & Rating */}
          <div className="flex items-center justify-between text-[11px] text-[#64746E] uppercase tracking-wider mb-1.5">
            <span className="font-semibold text-[#123D35]/80">{product.volume}</span>
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

          {/* Short Description */}
          <p className="text-xs text-[#2D3533]/70 line-clamp-2 mt-1 font-light min-h-[2rem]">
            {t(product.subtitleAr, product.subtitleFr)}
          </p>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="pt-2 border-t border-[#2D3533]/5 flex flex-col gap-2.5">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold text-[#123D35]">
              {formatPrice(product.priceMAD)}
            </span>
            {product.originalPriceMAD && (
              <span className="text-xs text-[#64746E] line-through">
                {formatPrice(product.originalPriceMAD)}
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
