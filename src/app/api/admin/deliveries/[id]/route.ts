import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAdminToken } from '@/lib/auth-utils';

export async function PATCH(request: Request, context: any) {
    const isAdmin = await verifyAdminToken();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await context.params;
    const { driverId, status } = await request.json();

    try {
        const data: any = {};
        // Allow unassigning driver by passing null
        if (driverId !== undefined) data.driverId = driverId;
        if (status !== undefined) data.status = status;

        const delivery = await prisma.delivery.update({
            where: { id },
            data,
        });

        // Sync order status if delivery status becomes finalized states
        if (status === 'DISPATCHED' || status === 'DELIVERED') {
            await prisma.order.update({
                where: { id: delivery.orderId },
                data: { status }
            });
        }

        return NextResponse.json({ success: true, delivery });
    } catch (error) {
        console.error("Delivery Update Error:", error);
        return NextResponse.json({ error: 'Failed to update delivery' }, { status: 500 });
    }
}
