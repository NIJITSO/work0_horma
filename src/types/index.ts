export type Language = 'ar' | 'fr';

export type CurrencyCode = 'MAD';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
}

export interface Category {
  id: string;
  nameAr: string;
  nameFr: string;
  image: string;
  slug: string;
}

export interface Product {
  id: string;
  nameAr: string;
  nameFr: string;
  subtitleAr: string;
  subtitleFr: string;
  priceMAD: number;
  originalPriceMAD?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  badgeAr?: string;
  badgeFr?: string;
  volume: string;
  descriptionAr: string;
  descriptionFr: string;
  benefitsAr: string[];
  benefitsFr: string[];
  ingredientsAr: string;
  ingredientsFr: string;
  usageAr: string;
  usageFr: string;
  inStock: boolean;
}

export interface Ritual {
  id: string;
  titleAr: string;
  titleFr: string;
  taglineAr: string;
  taglineFr: string;
  descriptionAr: string;
  descriptionFr: string;
  image: string;
  themeColor: string; // 'emerald' | 'gold' | 'sand'
  productsCount: number;
  badgeAr?: string;
  badgeFr?: string;
  priceMAD: number;
}

export interface Testimonial {
  id: string;
  nameAr: string;
  nameFr: string;
  locationAr: string;
  locationFr: string;
  commentAr: string;
  commentFr: string;
  rating: number;
  avatar: string;
  verified: boolean;
  productNameAr: string;
  productNameFr: string;
}

export interface FaqItem {
  id: string;
  questionAr: string;
  questionFr: string;
  answerAr: string;
  answerFr: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
