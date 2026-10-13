import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAdminToken } from '@/lib/auth-utils';
import crypto from 'crypto';

// PUT /api/admin/inventory/[id] — update a product
export async function PUT(request: Request, context: any) {
    const isAdmin = await verifyAdminToken();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await context.params;

    try {
        const body = await request.json();
        const { name, description, price, stock, images, brickType, strength, dimensions, weight, color, category } = body;

        const existing = await prisma.product.findUnique({ where: { id } });
        if (!existing) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

        const updateData: any = {
            name,
            description: description || '',
            price: parseFloat(price.toString()),
            stock: parseInt(stock.toString(), 10),
            brickType,
            strength,
            dimensions,
            weight,
            color,
            category,
        };

        if (images && Array.isArray(images)) {
            updateData.imageUrl = images.length > 0 ? images[0] : null;
        }

        const product = await prisma.product.update({ where: { id }, data: updateData });

        // Sync images
        if (images && Array.isArray(images)) {
            // @ts-ignore
            await prisma.$executeRaw`DELETE FROM "ProductImage" WHERE "productId" = ${id}`;
            for (const url of images) {
                const imgId = crypto.randomUUID();
                // @ts-ignore
                await prisma.$executeRaw`INSERT INTO "ProductImage" ("id", "productId", "url", "createdAt") VALUES (${imgId}, ${id}, ${url}, NOW())`;
            }
        }

        // @ts-ignore
        const productImages = await prisma.$queryRaw`SELECT * FROM "ProductImage" WHERE "productId" = ${id}` as any[];

        return NextResponse.json({ product: { ...product, images: productImages } });
    } catch (error) {
        console.error('Update product error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE /api/admin/inventory/[id] — delete a product
export async function DELETE(request: Request, context: any) {
    const isAdmin = await verifyAdminToken();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await context.params;

    try {
        await prisma.product.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete product error:', error);
        return NextResponse.json({ error: 'Failed to delete product. It may be linked to existing orders.' }, { status: 500 });
    }
}
