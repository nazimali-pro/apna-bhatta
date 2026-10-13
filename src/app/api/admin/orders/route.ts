import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAdminToken } from '@/lib/auth-utils';

// GET all orders
export async function GET() {
    const isAdmin = await verifyAdminToken();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                customer: { select: { name: true, email: true } },
                admin: { select: { name: true } },
                items: { include: { product: { select: { name: true } } } },
            },
        });
        return NextResponse.json(orders);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

