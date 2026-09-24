import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getAdminSession } from '../../../../lib/auth';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const scents = await prisma.scent.findMany({
      include: { _count: { select: { variants: true } } },
      orderBy: { id: 'asc' },
    });
    return NextResponse.json({ success: true, scents });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erreur chargement senteurs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const body = await request.json();
    const { name, nameAr, slug, image, isActive = true } = body;

    if (!name || !slug) return NextResponse.json({ success: false, error: 'Nom et slug requis' }, { status: 400 });

    const scent = await prisma.scent.create({
      data: {
        name,
        nameAr: nameAr || name,
        slug: slug.trim().toLowerCase(),
        image: image || null,
        isActive: Boolean(isActive),
      },
    });
    return NextResponse.json({ success: true, scent });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erreur création senteur' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const body = await request.json();
    const { id, name, nameAr, slug, image, isActive } = body;
    if (!id) return NextResponse.json({ success: false, error: 'ID manquant' }, { status: 400 });

    const updated = await prisma.scent.update({
      where: { id: Number(id) },
      data: {
        ...(name !== undefined && { name }),
        ...(nameAr !== undefined && { nameAr }),
        ...(slug !== undefined && { slug: slug.trim().toLowerCase() }),
        ...(image !== undefined && { image }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
    });
    return NextResponse.json({ success: true, scent: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erreur modification' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID manquant' }, { status: 400 });

    await prisma.scent.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Impossible de supprimer cette senteur' }, { status: 500 });
  }
}
