import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// PATCH - update order status
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { status } = await request.json();
        const order = await prisma.order.update({ where: { id }, data: { status } });
        return NextResponse.json(order);
    } catch {
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}

// DELETE - delete an order and all its records
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.delivery.deleteMany({ where: { orderId: id } });
        await prisma.orderItem.deleteMany({ where: { orderId: id } });
        await prisma.order.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
    }
}
