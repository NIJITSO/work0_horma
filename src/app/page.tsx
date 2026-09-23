import React from 'react';
import { getDbCategories } from '../lib/categories';
import { getDbProducts } from '../lib/products';
import { HomePageClient } from '../components/home/HomePageClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    getDbCategories(),
    getDbProducts(),
  ]);

  return (
    <HomePageClient
      initialCategories={categories}
      initialProducts={products}
    />
  );
}
