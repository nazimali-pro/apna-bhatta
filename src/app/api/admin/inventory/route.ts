import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAdminToken } from '@/lib/auth-utils';
import crypto from 'crypto';

// GET /api/admin/inventory — list all products
export async function GET() {
    const isAdmin = await verifyAdminToken();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        include: { images: true },
    });
    return NextResponse.json({ products });
}

// POST /api/admin/inventory — create a new product
export async function POST(request: Request) {
    const isAdmin = await verifyAdminToken();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await request.json();
        const { name, description, price, stock, images, brickType, strength, dimensions, weight, color, category } = body;

        if (!name || price === undefined || stock === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // The admin user is identified by the ADMIN role — fetch their ID
        let adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
        
        // Auto-create system admin if not found (needed for fresh databases)
        if (!adminUser) {
            adminUser = await prisma.user.create({
                data: {
                    email: 'admin@apnabhatta.com',
                    password: 'system-protected', // Password not used for admin_token login
                    name: 'System Admin',
                    role: 'ADMIN',
                    bhattaDetail: {
                        create: {
                            bhattaName: 'Apna Bhatta Official',
                            address: 'Main Kiln Site',
                            phoneNumber: '0000000000',
                        }
                    }
                }
            });
        }

        const mainImageUrl = images && images.length > 0 ? images[0] : null;

        const product = await prisma.product.create({
            data: {
                sellerId: adminUser.id,
                name,
                description: description || '',
                price: parseFloat(price.toString()),
                stock: parseInt(stock.toString(), 10),
                imageUrl: mainImageUrl,
                brickType,
                strength,
                dimensions,
                weight,
                color,
                category,
            },
        });

        // Insert product images via raw SQL
        if (images && Array.isArray(images)) {
            for (const url of images) {
                const id = crypto.randomUUID();
                // @ts-ignore
                await prisma.$executeRaw`INSERT INTO "ProductImage" ("id", "productId", "url", "createdAt") VALUES (${id}, ${product.id}, ${url}, NOW())`;
            }
        }

        // @ts-ignore
        const productImages = await prisma.$queryRaw`SELECT * FROM "ProductImage" WHERE "productId" = ${product.id}` as any[];

        return NextResponse.json({ product: { ...product, images: productImages } }, { status: 201 });
    } catch (error: any) {
        console.error('Create product error:', error);
        return NextResponse.json({ 
            error: 'Internal server error', 
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
        }, { status: 500 });
    }
}
