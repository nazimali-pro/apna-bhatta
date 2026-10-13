import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth-utils';

export async function POST(request: Request) {
    try {
        const session = await getSession();

        if (!session || session.role !== 'CUSTOMER') {
            return NextResponse.json({ error: 'Unauthorized. Only customers can checkout.' }, { status: 401 });
        }

        const body = await request.json();
        const { items, address, latitude, longitude, paymentMethod } = body;

        if (!items || !Array.isArray(items) || items.length === 0 || !address || !latitude || !longitude) {
            return NextResponse.json({ error: 'Missing required checkout fields or items are empty' }, { status: 400 });
        }

        // There is a single admin vendor — all products belong to admin
        let adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
        if (!adminUser) {
            // Auto-create system admin if not found (needed for fresh databases)
            adminUser = await prisma.user.create({
                data: {
                    email: 'admin@apnabhatta.com',
                    password: 'system-protected',
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

        const createdOrders = await prisma.$transaction(async (tx) => {
            // Fetch all products to get latest prices and validate stock
            const productIds = items.map((i: any) => i.productId);
            const products = await tx.product.findMany({
                where: { id: { in: productIds } },
            });

            let totalAmount = 0;

            // Create a single order for all items (single vendor)
            const order = await tx.order.create({
                data: {
                    customerId: session.userId,
                    sellerId: adminUser.id,
                    totalAmount: 0, // Updated after items
                    address,
                    latitude,
                    longitude,
                    paymentMethod: paymentMethod === 'ONLINE' ? 'ONLINE' : 'COD',
                    status: 'PENDING',
                }
            });

            for (const item of items) {
                const product = products.find((p: any) => p.id === item.productId);
                if (!product) throw new Error(`Product ${item.productId} not found`);

                if (product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for ${product.name}. Only ${product.stock} left.`);
                }

                const itemTotal = (item.quantity / 1000) * product.price;
                totalAmount += itemTotal;

                // Decrement stock
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                });

                // Create OrderItem
                await tx.orderItem.create({
                    data: {
                        orderId: order.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        price: itemTotal
                    }
                });
            }

            // Update order with real total
            const updatedOrder = await tx.order.update({
                where: { id: order.id },
                data: { totalAmount }
            });

            return [updatedOrder];
        });

        return NextResponse.json({ orders: createdOrders }, { status: 201 });

    } catch (error: any) {
        console.error('Checkout error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
