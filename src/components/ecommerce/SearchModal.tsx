'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useLanguage } from '../../context/LanguageContext';
import { formatPrice } from '../../utils/format';
import { useCart } from '../../context/CartContext';
import { PRODUCTS } from '../../data/content';
import { Search, X, ArrowRight, ArrowLeft } from 'lucide-react';

export function SearchModal() {
  const { t, isRtl } = useLanguage();
  const { isSearchOpen, closeSearch, openQuickView } = useCart();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.nameAr.toLowerCase().includes(q) ||
        p.nameFr.toLowerCase().includes(q) ||
        p.descriptionAr.toLowerCase().includes(q) ||
        p.descriptionFr.toLowerCase().includes(q) ||
        p.ingredientsAr.toLowerCase().includes(q) ||
        p.ingredientsFr.toLowerCase().includes(q)
    );
  }, [query]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4">
      <div className="bg-[#FFFCF7] rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#2D3533]/15 animate-in fade-in zoom-in-95">
        {/* Search Input Header */}
        <div className="p-4 sm:p-5 border-b border-[#2D3533]/10 flex items-center gap-3 bg-[#F8F4EC]">
          <Search className="w-5 h-5 text-[#123D35] shrink-0" />
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(
              'ابحثي عن مستحضر، مكون (أركان، نيلة، ماء ورد...)...',
              'Rechercher un soin, ingrédient (argan, nila, rose...)...'
            )}
            className="w-full bg-transparent text-sm sm:text-base text-[#2D3533] placeholder:text-[#64746E] focus:outline-none"
          />
          <button
            onClick={closeSearch}
            aria-label="Fermer"
            className="p-1.5 rounded-full hover:bg-[#2D3533]/10 text-[#2D3533]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6">
          {query.trim() === '' ? (
            <div className="text-center py-8 text-xs text-[#64746E]">
              <p className="mb-3">
                {t('عمليات البحث الشائعة:', 'Recherches populaires :')}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['أركان', 'نيلة زرقاء', 'ماء ورد', 'صابون بلدي', 'سيروم'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="bg-[#F8F4EC] hover:bg-[#123D35] hover:text-white px-3 py-1.5 rounded-full text-xs font-medium text-[#123D35] transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#64746E]">
              {t('لم يتم العثور على أي نتائج.', 'Aucun résultat trouvé.')}
            </div>
          ) : (
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#64746E] uppercase tracking-wider block mb-2">
                {filtered.length} {t('نتائج بحث', 'résultats')}
              </span>
              {filtered.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    closeSearch();
                    openQuickView(product);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F8F4EC] cursor-pointer transition-colors border border-transparent hover:border-[#2D3533]/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white shrink-0 border border-[#2D3533]/10">
                      <Image
                        src={product.image}
                        alt={product.nameFr}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-[#123D35]">
                        {t(product.nameAr, product.nameFr)}
                      </h4>
                      <span className="text-[11px] text-[#64746E]">
                        {product.volume}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-xs sm:text-sm text-[#123D35]">
                      {formatPrice(product.priceMAD)}
                    </span>
                    <span className="text-xs text-[#C89748]">
                      {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
