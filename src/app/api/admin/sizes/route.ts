import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getAdminSession } from '../../../../lib/auth';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const sizes = await prisma.size.findMany({
      include: { _count: { select: { variants: true } } },
      orderBy: { id: 'asc' },
    });
    return NextResponse.json({ success: true, sizes });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erreur chargement formats' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const body = await request.json();
    const { name, nameAr, value, isActive = true } = body;

    if (!name || !value) return NextResponse.json({ success: false, error: 'Nom et valeur requis (ex: 100 ml)' }, { status: 400 });

    const size = await prisma.size.create({
      data: {
        name,
        nameAr: nameAr || name,
        value,
        isActive: Boolean(isActive),
      },
    });
    return NextResponse.json({ success: true, size });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erreur création format' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const body = await request.json();
    const { id, name, nameAr, value, isActive } = body;
    if (!id) return NextResponse.json({ success: false, error: 'ID manquant' }, { status: 400 });

    const updated = await prisma.size.update({
      where: { id: Number(id) },
      data: {
        ...(name !== undefined && { name }),
        ...(nameAr !== undefined && { nameAr }),
        ...(value !== undefined && { value }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
    });
    return NextResponse.json({ success: true, size: updated });
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

    await prisma.size.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Impossible de supprimer ce format' }, { status: 500 });
  }
}
