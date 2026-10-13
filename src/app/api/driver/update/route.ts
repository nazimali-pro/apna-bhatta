import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth-utils';

export async function POST(request: Request) {
    try {
        const session = await getSession();

        if (!session || session.role !== 'DRIVER') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { deliveryId, status, latitude, longitude } = body;

        if (!deliveryId || !status) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Verify delivery belongs to this driver
        const delivery = await prisma.delivery.findUnique({ where: { id: deliveryId } });
        if (!delivery || delivery.driverId !== session.userId) {
            return NextResponse.json({ error: 'Delivery not found or unauthorized' }, { status: 404 });
        }

        // Update both delivery and parent order status
        const result = await prisma.$transaction(async (tx) => {
            const updatedDelivery = await tx.delivery.update({
                where: { id: deliveryId },
                data: {
                    status,
                    ...(latitude ? { latitude } : {}),
                    ...(longitude ? { longitude } : {}),
                },
            });

            await tx.order.update({
                where: { id: delivery.orderId },
                data: {
                    status,
                    ...(status === 'DELIVERED' ? { isPaid: true } : {}) // Auto-mark paid on delivery for COD logic simplicity in MVP
                },
            });

            return updatedDelivery;
        });

        return NextResponse.json({ delivery: result }, { status: 200 });

    } catch (error: any) {
        console.error('Update delivery error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
