'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice } from '../../utils/format';
import { useCart } from '../../context/CartContext';
import { MOROCCAN_CITIES, BRAND } from '../../data/content';
import { X, CheckCircle, Truck, CreditCard, Banknote, ShieldCheck, Phone } from 'lucide-react';

export function CheckoutModal() {
  const { language, t } = useLanguage();
  const {
    items,
    isCheckoutOpen,
    closeCheckout,
    subtotalMAD,
    clearCart,
  } = useCart();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState(MOROCCAN_CITIES[0]);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (!isCheckoutOpen) return null;

  const shippingFeeMAD = 0;
  const totalMAD = subtotalMAD;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          city,
          address,
          paymentMethod,
          notes,
          items,
          subtotalMAD,
          shippingMAD: shippingFeeMAD,
          totalMAD,
        }),
      });

      const data = await response.json();
      if (data.success && data.order?.id) {
        setOrderId(data.order.id);
      } else {
        const fallbackId = `AH-${Math.floor(10000 + Math.random() * 90000)}`;
        setOrderId(fallbackId);
      }
    } catch (err) {
      console.error('Order submission error:', err);
      const fallbackId = `AH-${Math.floor(10000 + Math.random() * 90000)}`;
      setOrderId(fallbackId);
    } finally {
      setIsSubmitting(false);
      setOrderConfirmed(true);
      clearCart();
    }
  };

  const whatsappMessage = encodeURIComponent(
    (() => {
      const itemsList = items
        .map((i) => {
          const scentName = i.selectedVariant?.scent
            ? ` (${language === 'ar' ? (i.selectedVariant.scent.nameAr || i.selectedVariant.scent.name) : i.selectedVariant.scent.name})`
            : '';
          const sizeName = i.selectedVariant?.size ? ` - ${i.selectedVariant.size.value}` : '';
          return `- ${language === 'ar' ? i.product.nameAr : i.product.nameFr}${scentName}${sizeName} x${i.quantity}`;
        })
        .join('\n');

      return language === 'ar'
        ? `مرحباً الحرة! أود تأكيد طلبيتي رقم ${orderId}.\n\nالاسم: ${fullName}\nالهاتف: ${phone}\nالمدينة: ${city}\nالعنوان: ${address}\n\nالمنتجات:\n${itemsList}\n\nالمجموع: ${totalMAD} درهم`
        : `Bonjour AL HURRA ! Je souhaite confirmer ma commande ${orderId}.\n\nNom : ${fullName}\nTéléphone : ${phone}\nVille : ${city}\nAdresse : ${address}\n\nProduits :\n${itemsList}\n\nTotal : ${totalMAD} DH`;
    })()
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FFFCF7] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#2D3533]/15">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#2D3533]/10 flex items-center justify-between bg-[#F8F4EC]">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#123D35]">
              {orderConfirmed
                ? t('تم تأكيد طلبيتك بنجاح!', 'Commande confirmée avec succès !')
                : t('إتمام الطلب السريع', 'Finaliser ma commande')}
            </h2>
            <p className="text-xs text-[#64746E] mt-0.5">
              {orderConfirmed
                ? (language === 'ar' ? (
                    <>شكراً لثقتكم في <span dir="ltr" className="inline-block">AL HURRA</span></>
                  ) : (
                    'Merci pour votre confiance en AL HURRA'
                  ))
                : t('توصيل سريع لكافة المدن المغربية', 'Livraison express partout au Maroc')}
            </p>
          </div>
          <button
            onClick={closeCheckout}
            aria-label="Fermer"
            className="p-1.5 rounded-full hover:bg-[#2D3533]/10 text-[#2D3533]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmation Screen */}
        {orderConfirmed ? (
          <div className="p-8 text-center flex flex-col items-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center shadow">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-[#123D35]">
                {t('مبروك! تم تسجيل طلبك بنجاح', 'Félicitations ! Votre commande est enregistrée')}
              </h3>
              <p className="text-sm text-[#64746E]">
                {t('رقم الطلب الخاص بك: ', 'Numéro de commande : ')}
                <strong className="text-[#123D35] bg-[#F8F4EC] px-2.5 py-1 rounded font-mono">
                  {orderId}
                </strong>
              </p>
              <p className="text-xs text-[#2D3533]/80 max-w-md mx-auto pt-2">
                {t(
                  `سيتصل بكم فريق التوصيل لتأكيد موعد التسليم في ${city} خلال 24 إلى 48 ساعة. الدفع عند الاستلام.`,
                  `Notre équipe prendra contact avec vous pour organiser la livraison à ${city} sous 24 à 48h.`
                )}
              </p>
            </div>

            {/* WhatsApp Confirmation Shortcut */}
            <div className="pt-4 w-full max-w-sm space-y-3">
              <a
                href={`${BRAND.whatsappUrl}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm py-3.5 px-4 rounded-xl shadow transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>{t('تأكيد فوري عبر واتساب', 'Confirmer rapidement sur WhatsApp')}</span>
              </a>

              <button
                onClick={closeCheckout}
                className="w-full bg-[#123D35] text-white text-xs font-semibold py-3 rounded-xl hover:bg-[#1A5449] transition-colors"
              >
                {t('العودة للمتجر', 'Retour à la boutique')}
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Delivery Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#123D35] uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#C89748]" />
                <span>{t('معلومات التوصيل', 'Informations de livraison')}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#2D3533] mb-1">
                    {t('الاسم الكامل *', 'Nom complet *')}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t('مثال: فاطمة الزهراء', 'Ex: Fatima Zahra')}
                    className="w-full bg-[#F8F4EC]/60 border border-[#2D3533]/20 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#123D35]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#2D3533] mb-1">
                    {t('رقم الهاتف للتواصل *', 'Numéro de téléphone *')}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="06 XX XX XX XX"
                    dir="ltr"
                    className="w-full bg-[#F8F4EC]/60 border border-[#2D3533]/20 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#123D35]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#2D3533] mb-1">
                    {t('المدينة *', 'Ville *')}
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#F8F4EC]/60 border border-[#2D3533]/20 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#123D35]"
                  >
                    {MOROCCAN_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#2D3533] mb-1">
                    {t('عنوان التوصيل أو الحي *', 'Adresse complète *')}
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={t('الحي، الشارع، رقم المنزل...', 'Quartier, rue, n°')}
                    className="w-full bg-[#F8F4EC]/60 border border-[#2D3533]/20 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#123D35]"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3 pt-4 border-t border-[#2D3533]/10">
              <h3 className="text-sm font-bold text-[#123D35] uppercase tracking-wider flex items-center gap-2">
                <Banknote className="w-4 h-4 text-[#C89748]" />
                <span>{t('طريقة الدفع', 'Mode de paiement')}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`p-3.5 rounded-xl border-2 flex items-center gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#123D35] bg-[#123D35]/5'
                      : 'border-[#2D3533]/15 hover:border-[#2D3533]/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="text-[#123D35] focus:ring-[#123D35]"
                  />
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-[#123D35]">
                      {t('الدفع عند الاستلام (COD)', 'Paiement à la livraison')}
                    </div>
                    <div className="text-[11px] text-[#64746E]">
                      {t('ادفع نقداً عند معاينة واستلام طلبيتك', 'Payez en espèces à la réception')}
                    </div>
                  </div>
                </label>

                <label
                  className={`p-3.5 rounded-xl border-2 flex items-center gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[#123D35] bg-[#123D35]/5'
                      : 'border-[#2D3533]/15 hover:border-[#2D3533]/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="text-[#123D35] focus:ring-[#123D35]"
                  />
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-[#123D35]">
                      {t('بطاقة بنكية مغربية / دولية', 'Carte bancaire marocaine / Visa')}
                    </div>
                    <div className="text-[11px] text-[#64746E]">
                      {t('دفع آمن ومحمي 100% بتشفير SSL', 'Paiement sécurisé et chiffré')}
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Ordered Items Preview */}
            <div className="bg-[#F8F4EC]/60 p-3.5 rounded-xl border border-[#2D3533]/10 space-y-2">
              <div className="text-xs font-semibold text-[#123D35] flex items-center justify-between">
                <span>{t('المنتجات المطلوبة:', 'Articles commandés :')}</span>
                <span className="text-[11px] text-[#64746E]">
                  ({items.length} {t('عناصر', 'produits')})
                </span>
              </div>
              <div className="max-h-36 overflow-y-auto space-y-2 pe-1">
                {items.map((item, idx) => {
                  const varPrice = item.selectedVariant ? item.selectedVariant.price : item.product.priceMAD;
                  const itemImg = item.selectedVariant?.image || item.product.image;
                  return (
                    <div key={idx} className="flex items-center gap-2.5 text-xs">
                      <div className="relative w-10 h-10 rounded-md overflow-hidden bg-white border border-[#2D3533]/10 shrink-0">
                        <Image src={itemImg} alt={item.product.nameFr} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[#123D35] truncate">
                          {t(item.product.nameAr, item.product.nameFr)}
                        </div>
                        <div className="text-[10px] text-[#64746E] flex items-center gap-1 flex-wrap">
                          {item.selectedVariant?.scent && (
                            <span className="bg-[#123D35]/10 text-[#123D35] px-1 rounded font-medium">
                              {t(item.selectedVariant.scent.nameAr || item.selectedVariant.scent.name, item.selectedVariant.scent.name)}
                            </span>
                          )}
                          <span>
                            {item.selectedVariant?.size
                              ? (language === 'ar' ? item.selectedVariant.size.nameAr || item.selectedVariant.size.value : item.selectedVariant.size.value)
                              : item.product.volume}
                          </span>
                          <span>• x{item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-bold text-[#123D35] text-xs shrink-0">
                        {formatPrice(varPrice * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total Order Summary */}
            <div className="bg-[#F8F4EC] p-4 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between font-medium text-[#64746E]">
                <span>{t('المجموع الفرعي للسلع', 'Sous-total')}</span>
                <span>{formatPrice(subtotalMAD)}</span>
              </div>
              <div className="flex justify-between font-medium text-[#64746E]">
                <span>{t('مصاريف الشحن إلى', 'Frais d’expédition vers')} {city}</span>
                <span className="text-green-700 font-bold">
                  {t('مجاني 🚚', 'Gratuit 🚚')}
                </span>
              </div>
              <div className="pt-2 border-t border-[#2D3533]/15 flex justify-between text-base font-bold text-[#123D35]">
                <span>{t('المجموع الصافي للدفع', 'Total à régler')}</span>
                <span className="text-lg text-[#123D35]">{formatPrice(totalMAD)}</span>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#123D35] hover:bg-[#1A5449] disabled:opacity-50 text-[#FFFCF7] font-bold text-sm sm:text-base py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              {isSubmitting ? (
                <span>{t('جاري تسجيل الطلب...', 'Traitement en cours...')}</span>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 text-[#C89748]" />
                  <span>{t('تأكيد الطلب الآن', 'Confirmer ma commande')}</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
