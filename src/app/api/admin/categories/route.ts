import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getAdminSession } from '../../../../lib/auth';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { id: 'asc' },
    });
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ success: false, error: 'Erreur lors du chargement des catégories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const body = await request.json();
    const { name, slug, description, image, isActive = true } = body;

    if (!name || !slug) {
      return NextResponse.json({ success: false, error: 'Nom et slug requis' }, { status: 400 });
    }

    const cleanSlug = slug.trim().toLowerCase();
    const existing = await prisma.category.findUnique({ where: { slug: cleanSlug } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Ce slug de catégorie existe déjà' }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug: cleanSlug,
        description: description || `Produits de la gamme ${name}`,
        image: image || '/images/categories/argan.png',
        isActive: Boolean(isActive),
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ success: false, error: 'Erreur lors de la création de la catégorie' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const body = await request.json();
    const { id, name, slug, description, image, isActive } = body;

    if (!id) return NextResponse.json({ success: false, error: 'ID manquant' }, { status: 400 });

    const updated = await prisma.category.update({
      where: { id: Number(id) },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug: slug.trim().toLowerCase() }),
        ...(description !== undefined && { description }),
        ...(image !== undefined && { image }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
    });

    return NextResponse.json({ success: true, category: updated });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ success: false, error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID manquant' }, { status: 400 });

    // Check if category has products
    const productCount = await prisma.product.count({ where: { categoryId: Number(id) } });
    if (productCount > 0) {
      return NextResponse.json(
        { success: false, error: `Impossible de supprimer: ${productCount} produit(s) sont rattachés à cette catégorie.` },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ success: false, error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}
