'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { Search, ShoppingBag, Menu, X, Phone, Heart } from 'lucide-react';
import { getWhatsAppHref } from '../../data/content';

export function Navbar() {
  const { language, t } = useLanguage();
  const { totalItems, openCart, openSearch } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { href: '/boutique', labelAr: 'المتجر', labelFr: 'La Boutique', isBoutique: true },
    { href: '/#categories', labelAr: 'العناية بالوجه', labelFr: 'Soins visage' },
    { href: '/#categories', labelAr: 'العناية بالجسم', labelFr: 'Soins corps' },
    { href: '/#rituals', labelAr: 'طقوس الجمال', labelFr: 'Rituels' },
    { href: '/#contact', labelAr: 'تواصل معنا', labelFr: 'Contactez-nous' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#F8F4EC]/95 backdrop-blur-md shadow-sm border-b border-[#2D3533]/10 py-2 sm:py-2.5'
            : 'bg-[#F8F4EC] border-b border-[#2D3533]/5 py-2 sm:py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* MOBILE HEADER (lg:hidden): Hamburger - Centered Logo - Search & Cart */}
          <div className="flex lg:hidden items-center justify-between w-full">
            {/* Hamburger / Close Button */}
            <div className="flex items-center justify-start flex-1">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={
                  isMobileMenuOpen
                    ? t('إغلاق القائمة', 'Fermer le menu')
                    : t('فتح القائمة', 'Ouvrir le menu')
                }
                className="p-2 -ms-2 text-[#2D3533] hover:text-[#123D35] transition-colors focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>

            {/* Centered Logo */}
            <div className="flex items-center justify-center shrink-0">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center group"
              >
                <Image
                  src="/images/logo/logo-web.png"
                  alt="AL HURRA"
                  width={175}
                  height={58}
                  priority
                  style={{
                    width: 'clamp(135px, 38vw, 175px)',
                    height: 'auto',
                    maxHeight: '52px',
                    objectFit: 'contain',
                  }}
                  className="shrink-0 transition-transform group-hover:scale-[1.02]"
                />
              </Link>
            </div>

            {/* Search and Shopping Bag Icons */}
            <div className="flex items-center justify-end flex-1 gap-1 sm:gap-2">
              <button
                onClick={openSearch}
                aria-label="Rechercher"
                className="p-2 text-[#2D3533] hover:text-[#123D35] rounded-full transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={openCart}
                aria-label="Panier"
                className="relative p-2 -me-1 text-[#2D3533] hover:text-[#123D35] rounded-full transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 rtl:-left-0.5 rtl:right-auto bg-[#123D35] text-[#FFFCF7] text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-sm animate-bounce">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* DESKTOP HEADER (hidden lg:flex): Logo - Desktop Nav - Actions */}
          <div className="hidden lg:flex items-center justify-between gap-4 w-full">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center shrink-0 group">
              <Image
                src="/images/logo/logo-web.png"
                alt="AL HURRA"
                width={210}
                height={70}
                priority
                sizes="210px"
                className="w-[210px] h-auto object-contain shrink-0 transition-transform group-hover:scale-[1.02]"
              />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="flex items-center gap-6 xl:gap-8 text-[13px] font-medium tracking-wide uppercase">
              {navLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className={
                    link.isBoutique
                      ? 'px-3.5 py-1 rounded-full bg-[#123D35] text-[#FFFCF7] hover:bg-[#1A534A] transition-all font-semibold shadow-sm text-xs tracking-wider'
                      : 'text-[#2D3533]/90 hover:text-[#123D35] hover:border-b-2 hover:border-[#123D35] pb-1 transition-all'
                  }
                >
                  {t(link.labelAr, link.labelFr)}
                </Link>
              ))}
            </nav>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={openSearch}
                aria-label="Rechercher"
                className="p-2 text-[#2D3533] hover:text-[#123D35] hover:bg-[#123D35]/5 rounded-full transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              <a
                href={getWhatsAppHref(language)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('الطلب عبر واتساب', 'Commander sur WhatsApp')}
                className="hidden sm:flex items-center gap-1.5 text-[12px] font-semibold text-[#123D35] bg-[#123D35]/10 hover:bg-[#123D35]/15 focus:outline-none focus:ring-2 focus:ring-[#C89748] px-3.5 py-1.5 rounded-full transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-[#123D35]" />
                <span className="hidden md:inline">{t('طلب مباشر', 'Commander')}</span>
              </a>

              <button
                onClick={openCart}
                aria-label="Panier"
                className="relative p-2 text-[#2D3533] hover:text-[#123D35] hover:bg-[#123D35]/5 rounded-full transition-colors"
              >
                <ShoppingBag className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 rtl:-left-1 rtl:right-auto bg-[#123D35] text-[#FFFCF7] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE NAVIGATION MENU LIST (Directly below header) */}
        {isMobileMenuOpen && (
          <div className="lg:hidden w-full bg-[#F8F4EC] border-t border-[#2D3533]/10 shadow-md animate-menu-open">
            <nav className="flex flex-col w-full">
              {navLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`w-full block px-5 py-4 text-start font-medium text-[15px] sm:text-base tracking-wide border-b border-[#2D3533]/10 transition-colors ${
                    link.isBoutique
                      ? 'text-[#123D35] font-bold bg-[#123D35]/5'
                      : 'text-[#2D3533] hover:text-[#123D35] hover:bg-[#F2ECE1]/60'
                  }`}
                >
                  {t(link.labelAr, link.labelFr)}
                </Link>
              ))}
              <div className="p-4 bg-[#F2ECE1]/40">
                <a
                  href={getWhatsAppHref(language)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t('الطلب عبر واتساب', 'Commander sur WhatsApp')}
                  className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-[#123D35] bg-[#123D35]/10 hover:bg-[#123D35]/15 focus:outline-none focus:ring-2 focus:ring-[#C89748] py-3 rounded-xl transition-all"
                >
                  <Phone className="w-4 h-4 text-[#123D35]" />
                  <span>{t('طلب مباشر', 'Commander')}</span>
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* BACKDROP OVERLAY (Closes menu on click) */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-[#2D3533]/25 backdrop-blur-[2px] animate-overlay-in lg:hidden"
        />
      )}
    </>
  );
}
