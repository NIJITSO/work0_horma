import { prisma } from './prisma';
import { Product as UiProduct, ProductVariant as UiVariant } from '../types';
import { PRODUCTS } from '../data/content';

const CONTENT_PRODUCT_MAP = new Map(PRODUCTS.map((p) => [p.id, p]));

const SCENT_ARABIC_NAMES: Record<string, string> = {
  naturel: 'طبيعي / أصيل',
  miel: 'أركان وعسل',
  argan: 'أركان خالص',
  jasmine: 'ياسمين',
  gardenia: 'غاردينيا',
  'fleur-oranger': 'زهر البرتقال',
  rose: 'ورد جوري',
  eucalyptus: 'أوكالبتوس',
  nila: 'النيلة الزرقاء',
  'akar-fassi': 'العكر الفاسي',
  verveine: 'لويزة',
  lavande: 'خزامى',
  hibiscus: 'أركان وكركديه',
  'anti-fourches': 'أركان ضد التقصف',
};

export async function getDbProducts(categorySlug?: string): Promise<UiProduct[]> {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      category: categorySlug && categorySlug !== 'all' ? { slug: categorySlug } : undefined,
    },
    include: {
      category: true,
      images: true,
      variants: {
        where: { isActive: true },
        include: {
          scent: true,
          size: true,
        },
      },
    },
    orderBy: {
      id: 'asc',
    },
  });

  return products.map(mapDbProductToUiProduct);
}

export function mapDbProductToUiProduct(dbProduct: any): UiProduct {
  const contentMeta = CONTENT_PRODUCT_MAP.get(dbProduct.slug);
  const rawVariants = dbProduct.variants || [];

  const variants: UiVariant[] = rawVariants.map((v: any) => ({
    id: v.id,
    productId: v.productId,
    scentId: v.scentId,
    scent: v.scent
      ? {
          id: v.scent.id,
          name: v.scent.name,
          nameAr: v.scent.nameAr || SCENT_ARABIC_NAMES[v.scent.slug] || v.scent.name,
          slug: v.scent.slug,
          image: v.scent.image,
        }
      : null,
    sizeId: v.sizeId,
    size: v.size
      ? {
          id: v.size.id,
          name: v.size.name,
          nameAr: v.size.nameAr || v.size.name,
          value: v.size.value,
        }
      : null,
    sku: v.sku,
    price: Number(v.price),
    stock: v.stock,
    image: v.image,
    isActive: v.isActive,
  }));

  const firstVariant = variants[0];
  const sizeValue = contentMeta?.volume || firstVariant?.size?.value || '50 ml';
  const price = firstVariant?.price ? Number(firstVariant.price) : Number(dbProduct.basePrice);

  return {
    id: dbProduct.slug || String(dbProduct.id),
    nameAr: dbProduct.nameAr || contentMeta?.nameAr || dbProduct.name,
    nameFr: dbProduct.nameFr || contentMeta?.nameFr || dbProduct.name,
    subtitleAr: dbProduct.subtitleAr || contentMeta?.subtitleAr || '',
    subtitleFr: dbProduct.subtitleFr || contentMeta?.subtitleFr || '',
    priceMAD: price,
    originalPriceMAD: contentMeta?.originalPriceMAD ?? Math.round(price * 1.2),
    rating: contentMeta?.rating ?? 4.9,
    reviewCount: contentMeta?.reviewCount ?? 35,
    image: dbProduct.mainImage,
    category: dbProduct.category?.slug || contentMeta?.category || '',
    badgeAr: contentMeta?.badgeAr || 'طبيعي 100%',
    badgeFr: contentMeta?.badgeFr || '100% Naturel',
    volume: sizeValue,
    descriptionAr: dbProduct.descriptionAr || contentMeta?.descriptionAr || dbProduct.description || '',
    descriptionFr: dbProduct.descriptionFr || contentMeta?.descriptionFr || dbProduct.description || '',
    benefitsAr: contentMeta?.benefitsAr || [
      'منتج طبيعي وأصيل 100%',
      'تركيبة تقليدية مغربية فاخرة',
      'يغذي ويحمي البشرة بعناية',
    ],
    benefitsFr: contentMeta?.benefitsFr || [
      'Produit 100% naturel et authentique',
      'Formule traditionnelle marocaine d’exception',
      'Nourrit et protège la peau en profondeur',
    ],
    ingredientsAr: dbProduct.ingredientsAr || contentMeta?.ingredientsAr || 'مكونات طبيعية نقية مختارة بعناية.',
    ingredientsFr: dbProduct.ingredientsFr || contentMeta?.ingredientsFr || 'Ingrédients naturels purs rigoureusement sélectionnés.',
    usageAr: dbProduct.usageAr || contentMeta?.usageAr || 'يوضع على بشرة نظيفة ويدلك بلطف.',
    usageFr: dbProduct.usageFr || contentMeta?.usageFr || 'Appliquer sur peau propre en légers massages circulaires.',
    inStock: firstVariant ? firstVariant.stock > 0 : true,
    variants,
  };
}
