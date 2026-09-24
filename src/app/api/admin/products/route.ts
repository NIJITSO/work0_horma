import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getAdminSession } from '../../../../lib/auth';

/**
 * GET all products for the dashboard
 */
export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        variants: {
          include: {
            scent: true,
            size: true,
          },
          orderBy: { id: 'asc' },
        },
        images: true,
      },
      orderBy: { id: 'desc' },
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching admin products:', error);
    return NextResponse.json({ success: false, error: 'Erreur lors du chargement des produits' }, { status: 500 });
  }
}

/**
 * POST: Create a new product
 */
export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      name,
      nameFr,
      nameAr,
      slug,
      categoryId,
      basePrice,
      description,
      descriptionFr,
      descriptionAr,
      subtitleFr,
      subtitleAr,
      ingredientsFr,
      ingredientsAr,
      usageFr,
      usageAr,
      mainImage,
      isActive = true,
      variants = [],
    } = body;

    const finalNameFr = nameFr || name;
    if (!finalNameFr || !slug || !categoryId || basePrice === undefined) {
      return NextResponse.json(
        { success: false, error: 'Champs requis manquants (nom, slug, catégorie, prix)' },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existing = await prisma.product.findUnique({
      where: { slug: slug.trim().toLowerCase() },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Un produit avec ce slug (identifiant URL) existe déjà.' },
        { status: 400 }
      );
    }

    const cleanImg = mainImage || '/images/products/savon-noir.jpeg';

    const newProduct = await prisma.product.create({
      data: {
        name: name || nameFr,
        nameFr,
        nameAr: nameAr || nameFr,
        slug: slug.trim().toLowerCase(),
        categoryId: Number(categoryId),
        basePrice: Number(basePrice),
        description: description || descriptionFr || '',
        descriptionFr: descriptionFr || '',
        descriptionAr: descriptionAr || '',
        subtitleFr: subtitleFr || '',
        subtitleAr: subtitleAr || '',
        ingredientsFr: ingredientsFr || '',
        ingredientsAr: ingredientsAr || '',
        usageFr: usageFr || '',
        usageAr: usageAr || '',
        mainImage: cleanImg,
        isActive: Boolean(isActive),
        images: {
          create: [{ image: cleanImg, isMain: true }],
        },
      },
    });

    // Create default variant if provided
    if (variants && variants.length > 0) {
      for (let i = 0; i < variants.length; i++) {
        const v = variants[i];
        await prisma.productVariant.create({
          data: {
            productId: newProduct.id,
            sku: v.sku || `AH-${newProduct.slug.toUpperCase()}-V${i + 1}`,
            price: Number(v.price || basePrice),
            stock: Number(v.stock ?? 50),
            image: v.image || cleanImg,
            sizeId: v.sizeId ? Number(v.sizeId) : null,
            scentId: v.scentId ? Number(v.scentId) : null,
            isActive: v.isActive !== false,
          },
        });
      }
    } else {
      // Create at least 1 default variant so the product is orderable
      const firstSize = await prisma.size.findFirst();
      await prisma.productVariant.create({
        data: {
          productId: newProduct.id,
          sku: `AH-${newProduct.slug.toUpperCase()}-STD`,
          price: Number(basePrice),
          stock: 50,
          image: cleanImg,
          sizeId: firstSize?.id ?? null,
          isActive: true,
        },
      });
    }

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ success: false, error: 'Erreur lors de la création du produit' }, { status: 500 });
  }
}

/**
 * PUT: Update an existing product
 */
export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID produit manquant' }, { status: 400 });
    }

    const updated = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        ...(data.nameFr !== undefined && { nameFr: data.nameFr, name: data.nameFr }),
        ...(data.nameAr !== undefined && { nameAr: data.nameAr }),
        ...(data.slug !== undefined && { slug: data.slug.trim().toLowerCase() }),
        ...(data.categoryId !== undefined && { categoryId: Number(data.categoryId) }),
        ...(data.basePrice !== undefined && { basePrice: Number(data.basePrice) }),
        ...(data.descriptionFr !== undefined && { descriptionFr: data.descriptionFr, description: data.descriptionFr }),
        ...(data.descriptionAr !== undefined && { descriptionAr: data.descriptionAr }),
        ...(data.subtitleFr !== undefined && { subtitleFr: data.subtitleFr }),
        ...(data.subtitleAr !== undefined && { subtitleAr: data.subtitleAr }),
        ...(data.ingredientsFr !== undefined && { ingredientsFr: data.ingredientsFr }),
        ...(data.ingredientsAr !== undefined && { ingredientsAr: data.ingredientsAr }),
        ...(data.usageFr !== undefined && { usageFr: data.usageFr }),
        ...(data.usageAr !== undefined && { usageAr: data.usageAr }),
        ...(data.mainImage !== undefined && { mainImage: data.mainImage }),
        ...(data.isActive !== undefined && { isActive: Boolean(data.isActive) }),
      },
      include: {
        category: true,
        variants: { include: { scent: true, size: true } },
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ success: false, error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}

/**
 * DELETE: Delete a product
 */
export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID manquant' }, { status: 400 });
    }

    // Cascade delete variants and images, then product
    await prisma.productVariant.deleteMany({ where: { productId: Number(id) } });
    await prisma.productImage.deleteMany({ where: { productId: Number(id) } });
    await prisma.product.delete({ where: { id: Number(id) } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ success: false, error: 'Impossible de supprimer ce produit' }, { status: 500 });
  }
}
