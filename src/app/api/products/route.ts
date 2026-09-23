import { NextResponse } from 'next/server';
import { getDbProducts } from '../../../lib/products';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const products = await getDbProducts(category ?? undefined);
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products from database:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
