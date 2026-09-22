'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice } from '../../utils/format';
import { useCart } from '../../context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

export function CartDrawer() {
  const { t, isRtl } = useLanguage();
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    subtotalMAD,
    openCheckout,
  } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'MAROC10') {
      setDiscountPercent(10);
      setPromoSuccess(t('تم تطبيق خصم 10% بنجاح!', 'Code de 10% appliqué !'));
      setPromoError('');
    } else {
      setPromoError(t('كود الخصم غير صالح', 'Code promo invalide'));
      setPromoSuccess('');
    }
  };

  const discountMAD = (subtotalMAD * discountPercent) / 100;
  const shippingFeeMAD = 0;
  const totalMAD = subtotalMAD - discountMAD;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Container */}
      <div
        className={`fixed inset-y-0 max-w-full flex ${
          isRtl ? 'left-0' : 'right-0'
        }`}
      >
        <div className="w-screen max-w-md bg-[#FFFCF7] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-[#2D3533]/10 flex items-center justify-between bg-[#F8F4EC]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#123D35]" />
              <h2 className="font-bold text-base text-[#123D35]">
                {t('سلة المشتريات', 'Votre Panier')}
                <span className="text-xs font-normal text-[#64746E] mx-1.5">
                  ({items.length} {t('منتج', 'articles')})
                </span>
              </h2>
            </div>
            <button
              onClick={closeCart}
              aria-label="Fermer"
              className="p-1.5 rounded-full hover:bg-[#2D3533]/10 text-[#2D3533] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Badge */}
          <div className="bg-[#123D35] text-[#FFFCF7] p-3 text-xs">
            <div className="flex items-center justify-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#C89748]" />
              <span>
                {t(
                  'توصيل مجاني لجميع مدن المغرب · الدفع عند الاستلام',
                  'LIVRAISON GRATUITE PARTOUT AU MAROC · PAIEMENT À LA LIVRAISON'
                )}
              </span>
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#123D35]/10 flex items-center justify-center mb-4 text-[#123D35]">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="font-bold text-base text-[#123D35] mb-1">
                  {t('سلة التسوق فارغة', 'Votre panier est vide')}
                </h3>
                <p className="text-xs text-[#64746E] max-w-xs mb-6">
                  {t(
                    'استكشفي مستحضراتنا الطبيعية وأضيفي لمستك المفضلة من جبال الأطلس.',
                    'Découvrez nos rituels précieux et faites entrer la magie du Maroc chez vous.'
                  )}
                </p>
                <button
                  onClick={closeCart}
                  className="bg-[#123D35] text-white text-xs font-semibold px-6 py-3 rounded-lg hover:bg-[#1A5449] transition-colors uppercase tracking-wider"
                >
                  {t('ابدئي التسوق الآن', 'Découvrir nos soins')}
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 pb-4 border-b border-[#2D3533]/10 last:border-b-0"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[#F8F4EC] border border-[#2D3533]/10 shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.nameFr}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-[#123D35] line-clamp-1">
                          {t(item.product.nameAr, item.product.nameFr)}
                        </h4>
                        <span className="text-[11px] text-[#64746E]">
                          {item.product.volume}
                        </span>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-[#64746E] hover:text-red-600 transition-colors p-1"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Controller */}
                      <div className="flex items-center border border-[#2D3533]/20 rounded-md overflow-hidden">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="px-2 py-1 hover:bg-[#2D3533]/5 text-[#2D3533] transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-[#123D35]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="px-2 py-1 hover:bg-[#2D3533]/5 text-[#2D3533] transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="font-bold text-sm text-[#123D35]">
                        {formatPrice(item.product.priceMAD * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Order Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#2D3533]/10 bg-[#F8F4EC]/60 space-y-4">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder={t('كود الخصم (مثال: MAROC10)', 'Code promo (ex: MAROC10)')}
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-white border border-[#2D3533]/20 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#123D35] uppercase"
                />
                <button
                  type="submit"
                  className="bg-[#2D3533] hover:bg-[#123D35] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  {t('تطبيق', 'Appliquer')}
                </button>
              </form>
              {promoSuccess && (
                <div className="text-xs text-green-700 font-medium">{promoSuccess}</div>
              )}
              {promoError && (
                <div className="text-xs text-red-600 font-medium">{promoError}</div>
              )}

              {/* Subtotal Calculation Breakdown */}
              <div className="space-y-1.5 text-xs text-[#2D3533]">
                <div className="flex justify-between">
                  <span className="text-[#64746E]">{t('المجموع الفرعي', 'Sous-total')}</span>
                  <span className="font-semibold">{formatPrice(subtotalMAD)}</span>
                </div>
                {discountMAD > 0 && (
                  <div className="flex justify-between text-green-700 font-medium">
                    <span>{t('الخصم (10%)', 'Remise (10%)')}</span>
                    <span>-{formatPrice(discountMAD)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#64746E]">{t('الشحن والتوصيل', 'Livraison')}</span>
                  <span className="font-semibold text-green-700 font-bold">
                    {t('مجاني', 'Gratuite')}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#2D3533]/10 flex justify-between text-sm sm:text-base font-bold text-[#123D35]">
                  <span>{t('المجموع الإجمالي', 'Total TTC')}</span>
                  <span>{formatPrice(totalMAD)}</span>
                </div>
              </div>

              {/* Checkout CTA Button */}
              <button
                onClick={openCheckout}
                className="w-full bg-[#123D35] hover:bg-[#1A5449] text-[#FFFCF7] font-bold text-xs sm:text-sm py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                <span>{t('متابعة الطلب والدفع', 'Passer la commande')}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>

              <div className="text-center">
                <span className="text-[11px] text-[#64746E] flex items-center justify-center gap-1">
                  <span>🔒 {t('دفع آمن عند الاستلام أو بالبطاقة البنكية', 'Paiement sécurisé ou à la livraison')}</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
