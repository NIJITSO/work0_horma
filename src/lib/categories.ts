import { prisma } from './prisma';
import { Category as UiCategory } from '../types';

const CATEGORY_ARABIC_NAMES: Record<string, string> = {
  argan: 'أركان',
  nila: 'نيلة',
  'figue-de-barbarie': 'تين شوكي',
  savons: 'صابون',
  serums: 'سيروم',
  gommages: 'مقشر',
};

export async function getDbCategories(): Promise<UiCategory[]> {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { id: 'asc' },
  });

  return categories.map(mapDbCategoryToUiCategory);
}

export function mapDbCategoryToUiCategory(dbCategory: any): UiCategory {
  return {
    id: dbCategory.slug || String(dbCategory.id),
    nameAr: CATEGORY_ARABIC_NAMES[dbCategory.slug] || dbCategory.name,
    nameFr: dbCategory.name,
    image: dbCategory.image || `/images/categories/${dbCategory.slug}.png`,
    slug: dbCategory.slug,
  };
}
