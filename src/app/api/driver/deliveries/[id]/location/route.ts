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

        const { id } = await params;
        const { latitude, longitude } = await request.json();

        if (typeof latitude !== 'number' || typeof longitude !== 'number') {
            return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
        }

        // Update the delivery record
        const updatedDelivery = await prisma.delivery.update({
            where: { id, driverId: session.userId },
            data: { latitude, longitude }
        });

        return NextResponse.json({ success: true, location: { lat: latitude, lng: longitude } });

    } catch (error: any) {
        console.error('Error updating delivery location:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
