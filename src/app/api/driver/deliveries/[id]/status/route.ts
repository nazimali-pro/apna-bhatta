import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-utils';
import { prisma } from '@/lib/db';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'DRIVER') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const resolvedParams = await params;
        const deliveryId = resolvedParams.id;
        const { status } = await request.json();

        if (!status) {
            return NextResponse.json({ error: 'Status is required' }, { status: 400 });
        }

        const delivery = await prisma.delivery.findUnique({
            where: { id: deliveryId }
        });

        if (!delivery) {
            return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
        }

        if (delivery.driverId !== session.userId) {
            return NextResponse.json({ error: 'You are not assigned to this delivery' }, { status: 403 });
        }

        // Update the delivery and the parent order
        await prisma.$transaction([
            prisma.delivery.update({
                where: { id: deliveryId },
                data: { status }
            }),
            prisma.order.update({
                where: { id: delivery.orderId },
                data: { status }
            })
        ]);

        return NextResponse.json({ success: true, message: `Delivery marked as ${status}` });

    } catch (error: any) {
        console.error('Error updating delivery status:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
