import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth-utils';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'CUSTOMER') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Find the order and verify ownership
        const order = await prisma.order.findUnique({
            where: { id },
            select: { customerId: true, status: true }
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        if (order.customerId !== session.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Only PENDING orders can be cancelled
        if (order.status !== 'PENDING') {
            return NextResponse.json({ 
                error: `Cannot cancel order in ${order.status} status.` 
            }, { status: 400 });
        }

        // Update the order status
        const updatedOrder = await prisma.order.update({
            where: { id },
            data: { status: 'CANCELLED' }
        });

        return NextResponse.json({ 
            success: true, 
            message: 'Order cancelled successfully',
            order: updatedOrder 
        });

    } catch (error: any) {
        console.error('Order Cancellation Error:', error);
        return NextResponse.json({ 
            error: 'Failed to cancel order',
            details: error.message 
        }, { status: 500 });
    }
}
