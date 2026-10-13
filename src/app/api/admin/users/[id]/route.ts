import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// DELETE a user
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        // Delete dependent records first
        await prisma.orderItem.deleteMany({ where: { order: { customerId: id } } });
        await prisma.delivery.deleteMany({ where: { order: { customerId: id } } });
        await prisma.order.deleteMany({ where: { OR: [{ customerId: id }, { sellerId: id }] } });
        await prisma.product.deleteMany({ where: { sellerId: id } });
        await prisma.bhattaDetail.deleteMany({ where: { sellerId: id } });
        
        // Driver specific cleanup
        await prisma.delivery.updateMany({ 
            where: { driverId: id }, 
            data: { driverId: null } 
        });
        await prisma.driverDetail.deleteMany({ where: { driverId: id } });

        await prisma.user.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}

// PATCH - update user role
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { role } = await request.json();
        const user = await prisma.user.update({ where: { id }, data: { role } });
        return NextResponse.json(user);
    } catch {
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}
