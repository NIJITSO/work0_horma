'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Category, Product, Scent, Size } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { AnnouncementBar } from '../layout/AnnouncementBar';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';
import { BoutiqueProductCard } from './BoutiqueProductCard';
import { CartDrawer } from '../ecommerce/CartDrawer';
import { CheckoutModal } from '../ecommerce/CheckoutModal';
import { QuickViewModal } from '../ecommerce/QuickViewModal';
import { SearchModal } from '../ecommerce/SearchModal';
import { FloatingWhatsApp } from '../layout/FloatingWhatsApp';
import {
  Filter,
  Sparkles,
  Search,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ArrowUpDown,
  Truck,
  ShieldCheck,
  Leaf,
} from 'lucide-react';

interface BoutiqueClientProps {
  categories: Category[];
  products: Product[];
}

export function BoutiqueClient({ categories, products }: BoutiqueClientProps) {
  const { language, t, isRtl } = useLanguage();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedScent, setSelectedScent] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Extract unique scents and sizes across all loaded products
  const allScents = useMemo(() => {
    const map = new Map<string, { slug: string; nameFr: string; nameAr?: string }>();
    products.forEach((p) => {
      p.variants?.forEach((v) => {
        if (v.scent && !map.has(v.scent.slug)) {
          map.set(v.scent.slug, {
            slug: v.scent.slug,
            nameFr: v.scent.name,
            nameAr: v.scent.nameAr,
          });
        }
      });
    });
    return Array.from(map.values());
  }, [products]);

  const allSizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      p.variants?.forEach((v) => {
        if (v.size?.value) set.add(v.size.value);
      });
    });
    return Array.from(set);
  }, [products]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }

        // Scent filter
        if (selectedScent !== 'all') {
          const hasScent = p.variants?.some((v) => v.scent?.slug === selectedScent);
          if (!hasScent) return false;
        }

        // Size filter
        if (selectedSize !== 'all') {
          const hasSize = p.variants?.some((v) => v.size?.value === selectedSize);
          if (!hasSize) return false;
        }

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle =
            p.nameAr.toLowerCase().includes(q) ||
            p.nameFr.toLowerCase().includes(q) ||
            p.subtitleAr.toLowerCase().includes(q) ||
            p.subtitleFr.toLowerCase().includes(q);
          const matchCategory = p.category.toLowerCase().includes(q);
          if (!matchTitle && !matchCategory) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.priceMAD - b.priceMAD;
        if (sortBy === 'price-desc') return b.priceMAD - a.priceMAD;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // featured default order
      });
  }, [products, selectedCategory, selectedScent, selectedSize, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedScent('all');
    setSelectedSize('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  const isFiltered =
    selectedCategory !== 'all' ||
    selectedScent !== 'all' ||
    selectedSize !== 'all' ||
    searchQuery.trim() !== '' ||
    sortBy !== 'featured';

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFCF7] text-[#2D3533]">
      {/* 1. Announcement Bar & Navbar */}
      <AnnouncementBar />
      <Navbar />

      <main className="flex-1">
        {/* 2. Boutique Hero Banner */}
        <section className="bg-gradient-to-b from-[#F8F4EC] to-[#FFFCF7] border-b border-[#2D3533]/10 py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-xs text-[#64746E]">
              <Link href="/" className="hover:text-[#123D35] transition-colors">
                {t('الرئيسية', 'Accueil')}
              </Link>
              <span>/</span>
              <span className="text-[#123D35] font-semibold">
                {t('المتجر الكامل', 'La Boutique')}
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold text-[#C89748] tracking-widest uppercase">
                {t('عناية طبيعية مغربية فاخرة', 'COSMÉTIQUES NATURELS D’EXCEPTION')}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-luxury font-bold text-[#123D35] italic">
                {t('متجر الحرة', 'La Boutique Al Hurra')}
              </h1>
              <p className="text-xs sm:text-sm text-[#64746E] leading-relaxed pt-1">
                {t(
                  'استكشفي تشكيلتنا المتكاملة من الزيوت النقية، السيرومات، الصابون الطبيعي والمقشرات التقليدية بمختلف الأحجام والروائح العطرية.',
                  'Découvrez notre collection complète d’huiles précieuses, sérums, savons naturels et gommages traditionnels, disponibles en plusieurs formats et senteurs artisanales.'
                )}
              </p>
            </div>

            {/* Quick Value Badges */}
            <div className="pt-4 flex flex-wrap justify-center gap-3 sm:gap-6 text-xs text-[#123D35]">
              <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-full border border-[#2D3533]/10 shadow-2xs">
                <Truck className="w-3.5 h-3.5 text-[#C89748]" />
                <span>{t('توصيل سريع مجاني لكافة المدن', 'Livraison express partout au Maroc')}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-full border border-[#2D3533]/10 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C89748]" />
                <span>{t('الدفع عند الاستلام', 'Paiement à la livraison')}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-full border border-[#2D3533]/10 shadow-2xs">
                <Leaf className="w-3.5 h-3.5 text-[#C89748]" />
                <span>{t('مكونات طبيعية 100%', '100% Ingrédients naturels')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Category Tabs Strip */}
        <section className="sticky top-14 z-30 bg-[#FFFCF7]/95 backdrop-blur-md border-b border-[#2D3533]/10 py-3 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
              {/* All Category Pill */}
              <button
                onClick={() => setSelectedCategory('all')}
                className={`text-xs font-semibold px-4 py-2 rounded-full whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === 'all'
                    ? 'bg-[#123D35] text-white shadow-xs'
                    : 'bg-[#F8F4EC] text-[#2D3533] hover:bg-[#EAE2D2]'
                }`}
              >
                <span>{t('جميع المستحضرات', 'Tous les soins')}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedCategory === 'all' ? 'bg-white/20' : 'bg-black/10'
                  }`}
                >
                  {products.length}
                </span>
              </button>

              {/* Individual Categories */}
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.slug;
                const count = products.filter((p) => p.category === cat.slug).length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`text-xs font-semibold px-4 py-2 rounded-full whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#123D35] text-white shadow-xs'
                        : 'bg-[#F8F4EC] text-[#2D3533] hover:bg-[#EAE2D2]'
                    }`}
                  >
                    <span>{t(cat.nameAr, cat.nameFr)}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-white/20' : 'bg-black/10'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. Controls: Search, Scent, Size, and Sort Filter Bar */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
          <div className="bg-[#F8F4EC]/60 border border-[#2D3533]/10 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#64746E] absolute start-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t(
                  'ابحثي بالاسم أو الفئة...',
                  'Rechercher par nom ou catégorie...'
                )}
                className="w-full bg-[#FFFCF7] border border-[#2D3533]/15 rounded-xl ps-10 pe-4 py-2.5 text-xs sm:text-sm text-[#2D3533] focus:outline-none focus:ring-2 focus:ring-[#123D35]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-[#64746E] hover:text-[#123D35]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Dropdowns: Scent, Size, Sort */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Scent Filter */}
              <div className="flex-1 sm:flex-initial">
                <select
                  value={selectedScent}
                  onChange={(e) => setSelectedScent(e.target.value)}
                  className="w-full sm:w-auto bg-[#FFFCF7] border border-[#2D3533]/15 rounded-xl px-3 py-2.5 text-xs font-medium text-[#2D3533] focus:outline-none focus:ring-2 focus:ring-[#123D35]"
                >
                  <option value="all">
                    {t('جميع السنتورات (الروائح)', 'Toutes les senteurs')}
                  </option>
                  {allScents.map((sc) => (
                    <option key={sc.slug} value={sc.slug}>
                      {t(sc.nameAr || sc.nameFr, sc.nameFr)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Size Filter */}
              <div className="flex-1 sm:flex-initial">
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full sm:w-auto bg-[#FFFCF7] border border-[#2D3533]/15 rounded-xl px-3 py-2.5 text-xs font-medium text-[#2D3533] focus:outline-none focus:ring-2 focus:ring-[#123D35]"
                >
                  <option value="all">
                    {t('جميع الأحجام والأوزان', 'Tous les formats')}
                  </option>
                  {allSizes.map((sz) => (
                    <option key={sz} value={sz}>
                      {sz}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Selector */}
              <div className="flex-1 sm:flex-initial">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full sm:w-auto bg-[#FFFCF7] border border-[#2D3533]/15 rounded-xl px-3 py-2.5 text-xs font-medium text-[#2D3533] focus:outline-none focus:ring-2 focus:ring-[#123D35]"
                >
                  <option value="featured">{t('الترتيب: الموصى به', 'Trier : En vedette')}</option>
                  <option value="price-asc">{t('السعر: من الأقل للأعلى', 'Prix : croissant')}</option>
                  <option value="price-desc">{t('السعر: من الأعلى للأقل', 'Prix : décroissant')}</option>
                  <option value="rating">{t('التقييم: الأعلى تقييماً', 'Mieux notés')}</option>
                </select>
              </div>

              {/* Reset button if filters active */}
              {isFiltered && (
                <button
                  onClick={handleResetFilters}
                  title={t('إعادة تعيين الفلاتر', 'Réinitialiser les filtres')}
                  className="p-2.5 rounded-xl bg-white border border-[#2D3533]/20 hover:border-red-500 hover:text-red-600 transition-colors text-xs font-semibold flex items-center gap-1 shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('إعادة تعيين', 'Réinitialiser')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Results Summary Counter */}
          <div className="flex items-center justify-between pt-4 px-1 text-xs text-[#64746E]">
            <span>
              {t(
                `عرض ${filteredProducts.length} من أصل ${products.length} مستحضر`,
                `Affichage de ${filteredProducts.length} sur ${products.length} produits`
              )}
            </span>
            {selectedCategory !== 'all' && (
              <span className="bg-[#123D35]/10 text-[#123D35] px-2.5 py-0.5 rounded-full font-semibold">
                {t('فئة: ', 'Catégorie : ')}
                {categories.find((c) => c.slug === selectedCategory)?.nameFr || selectedCategory}
              </span>
            )}
          </div>
        </section>

        {/* 5. Product Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
          {filteredProducts.length === 0 ? (
            /* Empty State */
            <div className="bg-[#F8F4EC]/40 border border-[#2D3533]/10 rounded-2xl p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#123D35]/10 text-[#123D35] flex items-center justify-center mx-auto">
                <SlidersHorizontal className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="text-lg font-bold text-[#123D35]">
                {t('لا توجد نتائج تطابق بحثك', 'Aucun soin ne correspond à vos filtres')}
              </h3>
              <p className="text-xs sm:text-sm text-[#64746E] max-w-md mx-auto">
                {t(
                  'جربي تغيير السنتور أو الحجم المختار، أو إزالة كلمة البحث للاطلاع على باقي المستحضرات.',
                  'Essayez d’ajuster vos critères de recherche ou réinitialisez les filtres pour découvrir notre collection.'
                )}
              </p>
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 bg-[#123D35] text-white text-xs font-semibold px-5 py-2.5 rounded-xl hover:bg-[#1A5449] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('إظهار جميع المستحضرات', 'Afficher tous les soins')}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <BoutiqueProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* 6. Footer */}
      <Footer />

      {/* 7. Drawers & Modals */}
      <CartDrawer />
      <CheckoutModal />
      <QuickViewModal />
      <SearchModal products={products} />
      <FloatingWhatsApp />
    </div>
  );
}
