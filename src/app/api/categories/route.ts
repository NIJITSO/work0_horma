import { NextResponse } from 'next/server';
import { getDbCategories } from '../../../lib/categories';

export async function GET() {
  try {
    const categories = await getDbCategories();
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories from database:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
