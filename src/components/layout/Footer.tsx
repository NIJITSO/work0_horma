'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import { Mail, Phone, MapPin, ShieldCheck, Heart, Lock } from 'lucide-react';
import { BRAND } from '../../data/content';

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
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

function FacebookIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.82 0-1.665.176-2.091.564-.427.387-.492.955-.492 1.942v1.473h3.818l-.504 3.667h-3.314v7.98H9.101z" />
    </svg>
  );
}

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#0B2520] text-[#FFFCF7] pt-16 pb-12 border-t border-[#C89748]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          {/* Brand Info & Mission */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="relative w-36 sm:w-44 h-14 sm:h-16">
              <Image
                src="/images/logo/logo-al-hurra.png"
                alt="AL HURRA"
                fill
                sizes="(max-width: 640px) 144px, 176px"
                className="object-contain object-left rtl:object-right ltr:object-left"
              />
            </div>

            <p className="text-xs sm:text-sm text-[#FFFCF7]/75 font-light leading-relaxed max-w-sm">
              {t(
                'علامة مغربية لمستحضرات التجميل الطبيعية، مستوحاة من طقوس الجمال والخبرة المغربية الأصيلة. عناية طبيعية صُممت لإبراز جمالكِ الطبيعي.',
                'Maison marocaine de cosmétique naturelle, inspirée des rituels de beauté et du savoir-faire ancestral du Maroc. Des soins authentiques conçus pour révéler votre beauté naturelle.'
              )}
            </p>

            <div className="flex items-center gap-3 mt-2">
              <a
                href={BRAND.instagramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#C89748] flex items-center justify-center transition-colors"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={BRAND.facebookUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#C89748] flex items-center justify-center transition-colors"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-[#C89748] tracking-widest uppercase mb-4">
              {t('المجموعات', 'COLLECTIONS')}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#FFFCF7]/80 font-light">
              <li>
                <Link href="/boutique" className="text-[#C89748] font-medium hover:underline transition-colors flex items-center gap-1">
                  <span>{t('تصفح المتجر بالكامل', 'Toute la Boutique')}</span>
                </Link>
              </li>
              <li>
                <a href="/#bestsellers" className="hover:text-[#C89748] transition-colors">
                  {t('الأكثر مبيعاً', 'Meilleures ventes')}
                </a>
              </li>
              <li>
                <a href="/#categories" className="hover:text-[#C89748] transition-colors">
                  {t('عناية بالوجه والأركان', 'Soins Argan & Nila')}
                </a>
              </li>
              <li>
                <a href="/#categories" className="hover:text-[#C89748] transition-colors">
                  {t('الحمام المغربي والصابون', 'Rituels de Hammam')}
                </a>
              </li>
              <li>
                <a href="/#rituals" className="hover:text-[#C89748] transition-colors">
                  {t('صناديق الهدايا الفاخرة', 'Coffrets Cadeaux')}
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service & Policies */}
          <div>
            <h4 className="text-xs font-bold text-[#C89748] tracking-widest uppercase mb-4">
              {t('خدمة العملاء', 'SERVICE CLIENT')}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#FFFCF7]/80 font-light">
              <li>
                <a href="#faq" className="hover:text-[#C89748] transition-colors">
                  {t('الأسئلة المتكررة', 'FAQ & Aide')}
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#C89748] transition-colors">
                  {t('الشحن والتوصيل (24-48h)', 'Livraison au Maroc')}
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#C89748] transition-colors">
                  {t('سياسة الاسترجاع (14 يوماً)', 'Retours & Remboursements')}
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#C89748] transition-colors">
                  {t('الشحن الدولي السريع', 'Livraison Internationale')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold text-[#C89748] tracking-widest uppercase mb-4">
              {t('اتصلي بنا', 'CONTACT')}
            </h4>
            <ul className="space-y-3 text-xs text-[#FFFCF7]/80 font-light">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C89748] shrink-0" />
                <a href={BRAND.phoneHref} className="hover:text-[#C89748] transition-colors" dir="ltr">
                  {BRAND.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C89748] shrink-0" />
                <a
                  href={BRAND.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('تواصلي مع الحرة عبر واتساب', 'Contacter Al Hurra sur WhatsApp')}
                  className="hover:text-[#C89748] transition-colors"
                >
                  <span>{t('واتساب: ', 'WhatsApp : ')}</span>
                  <span dir="ltr">{BRAND.phoneDisplay}</span>
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C89748] shrink-0" />
                <span>{t('مراكش والدار البيضاء، المغرب', 'Marrakech & Casablanca')}</span>
              </li>
              <li className="pt-2 text-[11px] text-[#C89748]">
                {t('خدمة عملاء متاحة 7 أيام / 7', 'Service disponible 7j/7')}
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods & Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center">
            <span className="text-[11px] bg-[#1A5449] text-[#C89748] px-2.5 py-1 rounded font-bold border border-[#C89748]/30">
              {t('الدفع عند الاستلام', 'Paiement à la livraison')}
            </span>
          </div>

          <div className="text-xs text-[#FFFCF7]/50 text-center sm:text-end">
            <p>
              {t('© 2026 AL HURRA. جميع الحقوق محفوظة.', '© 2026 AL HURRA. Tous droits réservés.')}
              <Link href="/admin" className="ms-3 text-[#C89748]/60 hover:text-[#C89748] transition-colors inline-flex items-center gap-1 text-[11px]" title="Espace Administrateur">
                <Lock className="w-3 h-3" />
                <span>{t('الإدارة', 'Admin')}</span>
              </Link>
            </p>
            <p className="text-[10px] text-[#FFFCF7]/30 mt-1">
              {t('مستحضرات تجميل طبيعية معتمدة • صنع في المغرب', 'Cosmétiques naturels certifiés • Made in Morocco')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
