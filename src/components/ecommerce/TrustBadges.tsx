'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Leaf, Award, Droplets, HeartHandshake, Truck, ShieldCheck } from 'lucide-react';

export function TrustBadges() {
  const { t } = useLanguage();

  const badges = [
    {
      icon: Leaf,
      titleAr: '100% طبيعي',
      titleFr: '100% NATUREL',
      descAr: 'مكونات عضوية نقية',
      descFr: 'Ingrédients purs certifiés',
    },
    {
      icon: Award,
      titleAr: 'صنع في المغرب',
      titleFr: 'FABRICATION ARTISANALE',
      descAr: 'تعاونيات الأطلس الحرة',
      descFr: 'Au cœur du terroir marocain',
    },
    {
      icon: Droplets,
      titleAr: 'مستخلصات نقية',
      titleFr: 'EXTRAITS PURS',
      descAr: 'عصر بارد بدون إضافات',
      descFr: 'Première pression à froid',
    },
    {
      icon: HeartHandshake,
      titleAr: 'رفق بالحيوان',
      titleFr: 'NON TESTÉ SUR ANIMAUX',
      descAr: 'منتجات نباتية آمنة',
      descFr: 'Éthique & Cruelty-free',
    },
    {
      icon: Truck,
      titleAr: 'توصيل سريع 24/48H',
      titleFr: 'LIVRAISON EXPRESS',
      descAr: 'لكافة المدن المغربية',
      descFr: 'Partout au Maroc & Monde',
    },
    {
      icon: ShieldCheck,
      titleAr: 'الدفع عند الاستلام',
      titleFr: 'PAIEMENT SÉCURISÉ',
      descAr: 'ضمان الرضا أو الاسترجاع',
      descFr: 'À la livraison ou par carte',
    },
  ];

  return (
    <section className="bg-[#FFFCF7] border-b border-[#2D3533]/10 py-8 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-4 items-center">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-3 rounded-xl hover:bg-[#F8F4EC] transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-[#123D35]/5 group-hover:bg-[#123D35] flex items-center justify-center text-[#123D35] group-hover:text-[#FFFCF7] transition-all duration-300 mb-3">
                  <Icon className="w-6 h-6 stroke-[1.6]" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-[#123D35] tracking-wide uppercase mb-1">
                  {t(badge.titleAr, badge.titleFr)}
                </h3>
                <p className="text-[11px] text-[#2D3533]/70 font-light">
                  {t(badge.descAr, badge.descFr)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
