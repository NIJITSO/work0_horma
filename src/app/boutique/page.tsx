import React from 'react';
import { getDbCategories } from '../../lib/categories';
import { getDbProducts } from '../../lib/products';
import { BoutiqueClient } from '../../components/boutique/BoutiqueClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'La Boutique Al Hurra | المتجر الكامل للعناية الطبيعية المغربية',
  description:
    'Découvrez tous les cosmétiques naturels Al Hurra : huiles d’argan pures, crèmes, gommages et savons traditionnels avec toutes leurs variantes et senteurs.',
};

export default async function BoutiquePage() {
  const [categories, products] = await Promise.all([
    getDbCategories(),
    getDbProducts(),
  ]);

  return <BoutiqueClient categories={categories} products={products} />;
}
