import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getAdminSession } from '../../../../lib/auth';

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    const variants = await prisma.productVariant.findMany({
      where: productId ? { productId: Number(productId) } : undefined,
      include: {
        product: { select: { id: true, nameFr: true, nameAr: true, slug: true } },
        scent: true,
        size: true,
      },
      orderBy: { id: 'desc' },
    });
    return NextResponse.json({ success: true, variants });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erreur chargement déclinaisons' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const body = await request.json();
    const { productId, sku, price, stock = 50, image, scentId, sizeId, isActive = true } = body;

    if (!productId || !price) {
      return NextResponse.json({ success: false, error: 'Produit et prix requis' }, { status: 400 });
    }

    const prod = await prisma.product.findUnique({ where: { id: Number(productId) } });
    if (!prod) return NextResponse.json({ success: false, error: 'Produit introuvable' }, { status: 404 });

    const finalSku = sku || `AH-${prod.slug.toUpperCase().replace(/-/g, '_')}-${Date.now().toString().slice(-4)}`;

    const variant = await prisma.productVariant.create({
      data: {
        productId: Number(productId),
        sku: finalSku,
        price: Number(price),
        stock: Number(stock),
        image: image || prod.mainImage,
        scentId: scentId ? Number(scentId) : null,
        sizeId: sizeId ? Number(sizeId) : null,
        isActive: Boolean(isActive),
      },
      include: { product: true, scent: true, size: true },
    });

    return NextResponse.json({ success: true, variant });
  } catch (error) {
    console.error('Error creating variant:', error);
    return NextResponse.json({ success: false, error: 'Erreur création déclinaison' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const body = await request.json();
    const { id, sku, price, stock, image, scentId, sizeId, isActive } = body;

    if (!id) return NextResponse.json({ success: false, error: 'ID manquant' }, { status: 400 });

    const updated = await prisma.productVariant.update({
      where: { id: Number(id) },
      data: {
        ...(sku !== undefined && { sku }),
        ...(price !== undefined && { price: Number(price) }),
        ...(stock !== undefined && { stock: Number(stock) }),
        ...(image !== undefined && { image }),
        ...(scentId !== undefined && { scentId: scentId ? Number(scentId) : null }),
        ...(sizeId !== undefined && { sizeId: sizeId ? Number(sizeId) : null }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
      include: { product: true, scent: true, size: true },
    });

    return NextResponse.json({ success: true, variant: updated });
  } catch (error) {
    console.error('Error updating variant:', error);
    return NextResponse.json({ success: false, error: 'Erreur modification déclinaison' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID manquant' }, { status: 400 });

    await prisma.productVariant.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Impossible de supprimer cette déclinaison' }, { status: 500 });
  }
}
