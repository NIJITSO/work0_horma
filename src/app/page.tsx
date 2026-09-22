'use client';

import React, { useState } from 'react';
import { AnnouncementBar } from '../components/layout/AnnouncementBar';
import { Navbar } from '../components/layout/Navbar';
import { HeroBanner } from '../components/ecommerce/HeroBanner';
import { TrustBadges } from '../components/ecommerce/TrustBadges';
import { CategoriesSection } from '../components/ecommerce/CategoriesSection';
import { BestsellersSection } from '../components/ecommerce/BestsellersSection';
import { HeritageSection } from '../components/ecommerce/HeritageSection';
import { SignatureRitualsSection } from '../components/ecommerce/SignatureRitualsSection';
import { GallerySection } from '../components/ecommerce/GallerySection';
import { TestimonialsSection } from '../components/ecommerce/TestimonialsSection';
import { FaqSection } from '../components/ecommerce/FaqSection';
import { NewsletterSection } from '../components/ecommerce/NewsletterSection';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/ecommerce/CartDrawer';
import { CheckoutModal } from '../components/ecommerce/CheckoutModal';
import { QuickViewModal } from '../components/ecommerce/QuickViewModal';
import { SearchModal } from '../components/ecommerce/SearchModal';
import { FloatingWhatsApp } from '../components/layout/FloatingWhatsApp';

export default function HomePage() {
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

        {/* 5. Shop by Category */}
        <CategoriesSection
          activeCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* 6. Bestsellers Products Catalog */}
        <BestsellersSection selectedCategory={selectedCategory} />

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
      <SearchModal />
      <FloatingWhatsApp />
    </div>
  );
}
