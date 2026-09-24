'use client';

import React, { useState } from 'react';
import { Category, Product } from '../../types';
import { AnnouncementBar } from '../layout/AnnouncementBar';
import { Navbar } from '../layout/Navbar';
import { HeroBanner } from '../ecommerce/HeroBanner';
import { TrustBadges } from '../ecommerce/TrustBadges';
import { CategoriesSection } from '../ecommerce/CategoriesSection';
import { InteractivePackSection } from '../ecommerce/InteractivePackSection';
import { HeritageSection } from '../ecommerce/HeritageSection';
import { SignatureRitualsSection } from '../ecommerce/SignatureRitualsSection';
import { GallerySection } from '../ecommerce/GallerySection';
import { TestimonialsSection } from '../ecommerce/TestimonialsSection';
import { FaqSection } from '../ecommerce/FaqSection';
import { NewsletterSection } from '../ecommerce/NewsletterSection';
import { Footer } from '../layout/Footer';
import { CartDrawer } from '../ecommerce/CartDrawer';
import { CheckoutModal } from '../ecommerce/CheckoutModal';
import { QuickViewModal } from '../ecommerce/QuickViewModal';
import { SearchModal } from '../ecommerce/SearchModal';
import { FloatingWhatsApp } from '../layout/FloatingWhatsApp';

interface HomePageClientProps {
  initialCategories: Category[];
  initialProducts: Product[];
}

export function HomePageClient({
  initialCategories,
  initialProducts,
}: HomePageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  const handleSelectCategory = (slug: string) => {
    setSelectedCategory((prev) => (prev === slug ? undefined : slug));
    const bestsellersEl = document.getElementById('bestsellers');
    if (bestsellersEl) {
      bestsellersEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFCF7] text-[#2D3533]">
      {/* 1. Top Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Main Luxury Header */}
      <Navbar />

      <main className="flex-1">
        {/* 3. Hero Section */}
        <HeroBanner />

        {/* 4. Trust Authenticity Badges (6 pillars) */}
        <TrustBadges />

        {/* 5. Shop by Category (Loaded from Database) */}
        <CategoriesSection
          categories={initialCategories}
          activeCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* 6. Interactive 9-Product Showcase (packDynamic scene with hotspots) */}
        <InteractivePackSection products={initialProducts} />

        {/* 7. Moroccan Heritage & Cooperative Story */}
        <HeritageSection />

        {/* 8. Signature Rituals Boxes */}
        <SignatureRitualsSection />

        {/* 9. Editorial Photo Gallery */}
        <GallerySection />

        {/* 10. Customer Testimonials */}
        <TestimonialsSection />

        {/* 11. FAQ Accordion */}
        <FaqSection />

        {/* 12. Newsletter Signup */}
        <NewsletterSection />
      </main>

      {/* 13. Production Footer */}
      <Footer />

      {/* 14. Modals & Drawers */}
      <CartDrawer />
      <CheckoutModal />
      <QuickViewModal />
      <SearchModal products={initialProducts} />
      <FloatingWhatsApp />
    </div>
  );
}
