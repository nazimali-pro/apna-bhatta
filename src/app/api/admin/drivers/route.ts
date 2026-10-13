import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAdminToken } from '@/lib/auth-utils';

export async function GET() {
    const isAdmin = await verifyAdminToken();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const drivers = await prisma.user.findMany({
        where: { role: 'DRIVER' },
        orderBy: { createdAt: 'desc' },
        include: { driverDetail: true },
    });
    return NextResponse.json({ drivers });
}

export async function PATCH(request: Request) {
    console.log('PATCH /api/admin/drivers hit');
    const isAdmin = await verifyAdminToken();
    if (!isAdmin) {
        console.log('PATCH /api/admin/drivers: Unauthorized');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { driverId, action } = await request.json();
    console.log('PATCH /api/admin/drivers: action=', action, 'driverId=', driverId);
    if (!driverId || !action) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    if (action === 'verify') {
        try {
            await prisma.$executeRaw`UPDATE "DriverDetail" SET "isVerified" = true WHERE "driverId" = ${driverId}`;
            return NextResponse.json({ success: true, message: 'Driver verified' });
        } catch (err: any) {
            console.error('Raw SQL verify error:', err);
            return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
        }
    }

    if (action === 'reject') {
        try {
            await prisma.$executeRaw`UPDATE "DriverDetail" SET "isVerified" = false WHERE "driverId" = ${driverId}`;
            return NextResponse.json({ success: true, message: 'Driver rejected' });
        } catch (err: any) {
            console.error('Raw SQL reject error:', err);
            return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
        }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
