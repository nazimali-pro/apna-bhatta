import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-utils';
import { prisma } from '@/lib/db';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // The ID here can be an Order ID (if no delivery exists) OR a Delivery ID (if unassigned delivery exists)
) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'DRIVER') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const resolvedParams = await params;
        const targetId = resolvedParams.id;

        // First, check if this ID connects to an existing unassigned delivery
        let existingDelivery = await prisma.delivery.findUnique({
            where: { id: targetId }
        });

        if (existingDelivery) {
            if (existingDelivery.driverId) {
                return NextResponse.json({ error: 'Delivery is already assigned to a driver' }, { status: 400 });
            }

            // Assign to this driver and update order status
            await prisma.$transaction([
                prisma.delivery.update({
                    where: { id: existingDelivery.id },
                    data: { driverId: session.userId, status: 'DISPATCHED' }
                }),
                prisma.order.update({
                    where: { id: existingDelivery.orderId },
                    data: { status: 'DISPATCHED' }
                })
            ]);

            return NextResponse.json({ success: true, message: 'Delivery accepted' });
        }

        // If no delivery found by that ID, assume the ID is an Order ID that needs a delivery created
        const unassignedOrder = await prisma.order.findUnique({
            where: { id: targetId },
            include: { delivery: true }
        });

        if (!unassignedOrder) {
            return NextResponse.json({ error: 'Order or Delivery not found' }, { status: 404 });
        }

        if (unassignedOrder.delivery) {
             return NextResponse.json({ error: 'Order already has a delivery assigned' }, { status: 400 });
        }

        // Create new delivery and assign to driver, update order
        await prisma.$transaction([
            prisma.delivery.create({
                data: {
                    orderId: unassignedOrder.id,
                    driverId: session.userId,
                    status: 'DISPATCHED'
                }
            }),
            prisma.order.update({
                where: { id: unassignedOrder.id },
                data: { status: 'DISPATCHED' }
            })
        ]);

        return NextResponse.json({ success: true, message: 'Delivery created and accepted' });

    } catch (error: any) {
        console.error('Error accepting delivery:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
