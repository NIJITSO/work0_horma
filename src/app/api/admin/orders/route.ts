import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getAdminSession } from '../../../../lib/auth';

/**
 * GET all orders for admin
 */
export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        items: {
          include: {
            productVariant: {
              include: {
                product: true,
                scent: true,
                size: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return NextResponse.json({ success: false, error: 'Erreur lors du chargement des commandes' }, { status: 500 });
  }
}

/**
 * PUT: Update order status
 */
export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID et statut requis' }, { status: 400 });
    }

    const updated = await prisma.order.update({
      where: { id: Number(id) },
      data: { status },
      include: {
        customer: true,
        items: {
          include: {
            productVariant: {
              include: {
                product: true,
                scent: true,
                size: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ success: false, error: 'Erreur lors de la mise à jour de la commande' }, { status: 500 });
  }
}
