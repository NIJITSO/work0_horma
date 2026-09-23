import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      phone,
      city,
      address,
      items = [],
      totalMAD,
    } = body;

    if (!fullName || !phone || !city || !address || !items.length) {
      return NextResponse.json(
        { success: false, error: 'Missing required order details' },
        { status: 400 }
      );
    }

    // Split full name into first and last name
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || 'Client';
    const lastName = nameParts.slice(1).join(' ') || '';

    // 1. Find or create Customer
    let customer = await prisma.customer.findFirst({
      where: { phone: phone.trim() },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          firstName,
          lastName,
          phone: phone.trim(),
          city,
          address,
        },
      });
    }

    // 2. Generate unique order number
    const orderNumber = `AH-${Date.now().toString().slice(-4)}${Math.floor(100 + Math.random() * 900)}`;

    // 3. Resolve variants for each order item
    const orderItemsData = [];
    for (const item of items) {
      let variantId = item.variantId || item.selectedVariant?.id;

      if (!variantId && item.product?.id) {
        // Resolve variant by product slug or id
        const variant = await prisma.productVariant.findFirst({
          where: {
            OR: [
              { product: { slug: item.product.id } },
              { sku: { startsWith: `AH-${item.product.id.toUpperCase().replace(/-/g, '_')}` } },
            ],
          },
        });
        if (variant) {
          variantId = variant.id;
        }
      }

      // If still no variant, use first available variant in database
      if (!variantId) {
        const firstVariant = await prisma.productVariant.findFirst();
        variantId = firstVariant?.id;
      }

      const unitPrice = Number(
        item.selectedVariant?.price || item.product?.priceMAD || item.unitPrice || 0
      );
      const quantity = Number(item.quantity || 1);
      const totalPrice = unitPrice * quantity;

      if (variantId) {
        orderItemsData.push({
          productVariantId: variantId,
          quantity,
          unitPrice,
          totalPrice,
        });
      }
    }

    // 4. Create Order with OrderItems
    const order = await prisma.order.create({
      data: {
        customerId: customer.id,
        orderNumber,
        status: 'en_attente',
        totalAmount: Number(totalMAD) || 0,
        shippingAddress: `${address}, ${city}`,
        items: {
          create: orderItemsData,
        },
      },
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

    return NextResponse.json({
      success: true,
      order: {
        id: order.orderNumber,
        orderNumber: order.orderNumber,
        status: order.status,
        totalAmount: order.totalAmount,
        customer: order.customer,
        items: order.items,
      },
    });
  } catch (error) {
    console.error('Error creating order in MySQL:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record order' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
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
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
