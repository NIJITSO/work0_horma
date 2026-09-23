import { PrismaClient } from '@prisma/client';
import { CATEGORIES, PRODUCTS } from '../src/data/content';

const prisma = new PrismaClient();

interface VariantSpec {
  sizeValue: string;
  scentSlug: string;
  priceMultiplier?: number;
  customPrice?: number;
  image?: string;
  sku?: string;
}

const PRODUCT_VARIANTS_SPEC: Record<string, VariantSpec[]> = {
  'savon-noir': [
    { sizeValue: '250 g', scentSlug: 'eucalyptus', priceMultiplier: 1.0 },
    { sizeValue: '250 g', scentSlug: 'fleur-oranger', priceMultiplier: 1.0 },
    { sizeValue: '500 g', scentSlug: 'eucalyptus', priceMultiplier: 1.72 },
  ],
  'serum-argan-hibiscus': [
    { sizeValue: '50 ml', scentSlug: 'naturel', priceMultiplier: 1.0 },
    { sizeValue: '100 ml', scentSlug: 'naturel', priceMultiplier: 1.68 },
  ],
  'creme-visage': [
    { sizeValue: '50 g', scentSlug: 'fleur-oranger', priceMultiplier: 1.0 },
    { sizeValue: '50 g', scentSlug: 'rose', priceMultiplier: 1.0 },
    { sizeValue: '100 g', scentSlug: 'fleur-oranger', priceMultiplier: 1.61 },
  ],
  'creme-hydratante-argan': [
    { sizeValue: '50 g', scentSlug: 'naturel', priceMultiplier: 1.0 },
    { sizeValue: '100 g', scentSlug: 'naturel', priceMultiplier: 1.63 },
  ],
  'gommage-corps': [
    {
      sizeValue: '200 g',
      scentSlug: 'nila',
      customPrice: 229,
      image: '/images/productsVariants/5-nila.jpeg',
      sku: 'AH-GOMMAGE_CORPS-NILA-200G',
    },
    {
      sizeValue: '200 g',
      scentSlug: 'akar-fassi',
      customPrice: 199,
      image: '/images/productsVariants/5-akar-fassi.jpeg',
      sku: 'AH-GOMMAGE_CORPS-AKAR_FASSI-200G',
    },
    {
      sizeValue: '500 g',
      scentSlug: 'nila',
      customPrice: 389,
      image: '/images/productsVariants/5-nila.jpeg',
      sku: 'AH-GOMMAGE_CORPS-NILA-500G',
    },
    {
      sizeValue: '500 g',
      scentSlug: 'akar-fassi',
      customPrice: 349,
      image: '/images/productsVariants/5-akar-fassi.jpeg',
      sku: 'AH-GOMMAGE_CORPS-AKAR_FASSI-500G',
    },
  ],
  'serum-argan': [
    { sizeValue: '30 ml', scentSlug: 'naturel', priceMultiplier: 1.0 },
    { sizeValue: '50 ml', scentSlug: 'naturel', priceMultiplier: 1.4 },
  ],
  // Product ID 8: Gel Douche Argan & Miel line with custom variant images (8-*.png/jpeg)
  'gel-douche-argan-miel': [
    {
      sizeValue: '100 ml',
      scentSlug: 'miel',
      customPrice: 85,
      image: '/images/productsVariants/8-miel.jpeg',
      sku: 'AH-GEL_DOUCHE-MIEL-100ML',
    },
    {
      sizeValue: '100 ml',
      scentSlug: 'argan',
      customPrice: 85,
      image: '/images/productsVariants/8-argan.png',
      sku: 'AH-GEL_DOUCHE-ARGAN-100ML',
    },
    {
      sizeValue: '100 ml',
      scentSlug: 'jasmine',
      customPrice: 89,
      image: '/images/productsVariants/8-jasmine.png',
      sku: 'AH-GEL_DOUCHE-JASMINE-100ML',
    },
    {
      sizeValue: '100 ml',
      scentSlug: 'gardenia',
      customPrice: 89,
      image: '/images/productsVariants/8-gardenia.png',
      sku: 'AH-GEL_DOUCHE-GARDENIA-100ML',
    },
    {
      sizeValue: '100 ml',
      scentSlug: 'fleur-oranger',
      customPrice: 89,
      image: '/images/productsVariants/8-fleur-oranger.png',
      sku: 'AH-GEL_DOUCHE-ORANGER-100ML',
    },
    {
      sizeValue: '100 ml',
      scentSlug: 'eucalyptus',
      customPrice: 89,
      image: '/images/productsVariants/8-eucalyptus.png',
      sku: 'AH-GEL_DOUCHE-EUCALYPTUS-100ML',
    },
  ],
  'gommage-visage-nila': [
    { sizeValue: '100 g', scentSlug: 'naturel', priceMultiplier: 1.0 },
    { sizeValue: '250 g', scentSlug: 'naturel', priceMultiplier: 1.69 },
  ],
  'eau-rose': [
    { sizeValue: '100 ml', scentSlug: 'rose', priceMultiplier: 1.0 },
    { sizeValue: '250 ml', scentSlug: 'rose', priceMultiplier: 1.71 },
  ],
};

async function main() {
  console.log('🌱 Starting database seeding with rich multi-variants and custom images...');

  // Clean existing order items and variants to ensure clean state
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({ where: { slug: { in: ['huile-nila', 'gommage-argan'] } } });

  // 1. Seed Sizes with Arabic and French values
  const sizeData = [
    { name: '30 ml', nameAr: '30 مل', value: '30 ml' },
    { name: '50 ml', nameAr: '50 مل', value: '50 ml' },
    { name: '100 ml', nameAr: '100 مل', value: '100 ml' },
    { name: '200 ml', nameAr: '200 مل', value: '200 ml' },
    { name: '250 ml', nameAr: '250 مل', value: '250 ml' },
    { name: '500 ml', nameAr: '500 مل', value: '500 ml' },
    { name: '50 g', nameAr: '50 غ', value: '50 g' },
    { name: '100 g', nameAr: '100 غ', value: '100 g' },
    { name: '200 g', nameAr: '200 غ', value: '200 g' },
    { name: '250 g', nameAr: '250 غ', value: '250 g' },
    { name: '500 g', nameAr: '500 غ', value: '500 g' },
  ];

  const sizeMap = new Map<string, number>();
  for (const s of sizeData) {
    const existing = await prisma.size.findFirst({ where: { value: s.value } });
    if (existing) {
      await prisma.size.update({
        where: { id: existing.id },
        data: { name: s.name, nameAr: s.nameAr },
      });
      sizeMap.set(s.value, existing.id);
    } else {
      const created = await prisma.size.create({ data: s });
      sizeMap.set(s.value, created.id);
    }
  }
  console.log(`✅ Seeded ${sizeMap.size} sizes.`);

  // 2. Seed Scents with bilingual names
  const scentData = [
    { name: 'Naturel / Sans Parfum', nameAr: 'طبيعي / بدون عطر', slug: 'naturel', image: '/images/scents/naturel.png' },
    { name: 'Argan & Miel', nameAr: 'أركان وعسل', slug: 'miel', image: '/images/scents/miel.png' },
    { name: 'Argan Pur', nameAr: 'أركان خالص', slug: 'argan', image: '/images/scents/argan.png' },
    { name: 'Jasmin', nameAr: 'ياسمين', slug: 'jasmine', image: '/images/scents/jasmine.png' },
    { name: 'Gardénia', nameAr: 'غاردينيا', slug: 'gardenia', image: '/images/scents/gardenia.png' },
    { name: "Fleur d'oranger", nameAr: 'زهر البرتقال', slug: 'fleur-oranger', image: '/images/scents/fleur-oranger.png' },
    { name: 'Rose de Damas', nameAr: 'ورد جوري', slug: 'rose', image: '/images/scents/rose.png' },
    { name: 'Eucalyptus', nameAr: 'أوكالبتوس', slug: 'eucalyptus', image: '/images/scents/eucalyptus.png' },
    { name: 'Nila Bleue', nameAr: 'النيلة الزرقاء', slug: 'nila', image: '/images/scents/nila.png' },
    { name: 'Akar Fassi', nameAr: 'العكر الفاسي', slug: 'akar-fassi', image: '/images/scents/akar-fassi.png' },
    { name: 'Verveine', nameAr: 'لويزة', slug: 'verveine', image: '/images/scents/verveine.png' },
    { name: 'Lavande', nameAr: 'خزامى', slug: 'lavande', image: '/images/scents/lavande.png' },
  ];

  const scentMap = new Map<string, number>();
  for (const sc of scentData) {
    const upserted = await prisma.scent.upsert({
      where: { slug: sc.slug },
      update: { name: sc.name, nameAr: sc.nameAr, image: sc.image },
      create: sc,
    });
    scentMap.set(sc.slug, upserted.id);
  }
  console.log(`✅ Seeded ${scentMap.size} scents.`);

  // 3. Seed Categories
  const categoryMap = new Map<string, number>();
  for (const cat of CATEGORIES) {
    const cleanImage = `/images/categories/${cat.slug}.png`;
    const upserted = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.nameFr,
        image: cleanImage,
        description: `Produits de la gamme ${cat.nameFr}`,
      },
      create: {
        name: cat.nameFr,
        slug: cat.slug,
        image: cleanImage,
        description: `Produits de la gamme ${cat.nameFr}`,
      },
    });
    categoryMap.set(cat.slug, upserted.id);
  }
  console.log(`✅ Seeded ${categoryMap.size} categories.`);

  // 4. Seed Products with Variants
  let totalVariants = 0;
  for (const p of PRODUCTS) {
    const categoryId = categoryMap.get(p.category) || Array.from(categoryMap.values())[0];
    const cleanProductImage = `/images/products/${p.id}.jpeg`;

    const product = await prisma.product.upsert({
      where: { slug: p.id },
      update: {
        categoryId,
        name: p.nameFr,
        description: p.descriptionFr,
        mainImage: cleanProductImage,
        basePrice: p.priceMAD,
        nameAr: p.nameAr,
        nameFr: p.nameFr,
        subtitleAr: p.subtitleAr,
        subtitleFr: p.subtitleFr,
        descriptionAr: p.descriptionAr,
        descriptionFr: p.descriptionFr,
        ingredientsAr: p.ingredientsAr,
        ingredientsFr: p.ingredientsFr,
        usageAr: p.usageAr,
        usageFr: p.usageFr,
      },
      create: {
        categoryId,
        name: p.nameFr,
        slug: p.id,
        description: p.descriptionFr,
        mainImage: cleanProductImage,
        basePrice: p.priceMAD,
        nameAr: p.nameAr,
        nameFr: p.nameFr,
        subtitleAr: p.subtitleAr,
        subtitleFr: p.subtitleFr,
        descriptionAr: p.descriptionAr,
        descriptionFr: p.descriptionFr,
        ingredientsAr: p.ingredientsAr,
        ingredientsFr: p.ingredientsFr,
        usageAr: p.usageAr,
        usageFr: p.usageFr,
      },
    });

    // Seed ProductImage
    const existingImg = await prisma.productImage.findFirst({
      where: { productId: product.id, isMain: true },
    });
    if (existingImg) {
      await prisma.productImage.update({
        where: { id: existingImg.id },
        data: { image: cleanProductImage },
      });
    } else {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          image: cleanProductImage,
          isMain: true,
        },
      });
    }

    // Seed Variants for this product
    const variantSpecs = PRODUCT_VARIANTS_SPEC[p.id] || [
      { sizeValue: p.volume || '50 ml', scentSlug: 'naturel', priceMultiplier: 1.0 },
    ];

    for (let i = 0; i < variantSpecs.length; i++) {
      const spec = variantSpecs[i];
      const sizeId = sizeMap.get(spec.sizeValue) || sizeMap.get('50 ml');
      const scentId = scentMap.get(spec.scentSlug) || scentMap.get('naturel');
      const variantPrice = spec.customPrice ?? Math.round(p.priceMAD * (spec.priceMultiplier || 1.0));
      const variantImage = spec.image || cleanProductImage;
      const sku = spec.sku || `AH-${p.id.toUpperCase().replace(/-/g, '_')}-V${i + 1}`;

      await prisma.productVariant.create({
        data: {
          productId: product.id,
          sku,
          price: variantPrice,
          stock: 45 + i * 5,
          image: variantImage,
          sizeId: sizeId ?? null,
          scentId: scentId ?? null,
        },
      });
      totalVariants++;
    }
  }
  console.log(`✅ Seeded ${PRODUCTS.length} products with ${totalVariants} rich variants.`);

  // 5. Seed a demo Customer
  const demoCustomer = await prisma.customer.upsert({
    where: { email: 'fatima@alhurra.ma' },
    update: {},
    create: {
      firstName: 'فاطمة الزهراء',
      lastName: 'العلوي',
      email: 'fatima@alhurra.ma',
      phone: '0661234567',
      address: 'Quartier Palmier, Rue 12, N 4',
      city: 'الدار البيضاء',
    },
  });
  console.log(`✅ Seeded demo customer: ${demoCustomer.firstName}`);

  console.log('🎉 Database seeding with multi-variants complete!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
