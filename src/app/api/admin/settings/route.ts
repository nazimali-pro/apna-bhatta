import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAdminToken } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const isAdmin = await verifyAdminToken();
        if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        let settings = await (prisma as any).platformSettings.findFirst();
        
        // If no settings exist yet, create default entry
        if (!settings) {
            settings = await (prisma as any).platformSettings.create({
                data: {} // Uses schema defaults
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Settings Fetch Error:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const isAdmin = await verifyAdminToken();
        if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await request.json();
        
        // Ensure id is present for singleton behavior (always id: 1)
        const settings = await (prisma as any).platformSettings.upsert({
            where: { id: 1 },
            update: {
                platformName: data.platformName,
                contactEmail: data.contactEmail,
                contactPhone: data.contactPhone,
                commissionRate: parseFloat(data.commissionRate),
                minOrderQty: parseInt(data.minOrderQty),
                deliveryBaseCharge: parseFloat(data.deliveryBaseCharge),
                deliveryPerKmRate: parseFloat(data.deliveryPerKmRate),
                maintenanceMode: data.maintenanceMode,
                allowNewRegistrations: data.allowNewRegistrations,
                requireDriverApproval: data.requireDriverApproval,
            },
            create: {
                id: 1,
                ...data,
                commissionRate: parseFloat(data.commissionRate || '5'),
                minOrderQty: parseInt(data.minOrderQty || '500'),
                deliveryBaseCharge: parseFloat(data.deliveryBaseCharge || '500'),
                deliveryPerKmRate: parseFloat(data.deliveryPerKmRate || '50'),
            }
        });

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Settings Update Error:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
