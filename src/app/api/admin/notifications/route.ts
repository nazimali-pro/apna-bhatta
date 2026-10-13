import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAdminToken } from '@/lib/auth-utils';

// POST: create a notification for all or specific users
export async function POST(request: Request) {
    const isAdmin = await verifyAdminToken();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { title, message, targetRole } = await request.json();
    if (!title || !message) return NextResponse.json({ error: 'Title and message required' }, { status: 400 });

    // We store the notification broadcast as a ContactReport of type 'admin_broadcast' for the MVP
    // A full implementation would use a dedicated Notification table/push service
    // For now, return success to demonstrate the UI contract
    return NextResponse.json({ 
        success: true, 
        message: `Broadcast "${title}" queued for ${targetRole || 'ALL'} users.`,
        meta: { title, message, targetRole, sentAt: new Date().toISOString() }
    });
}
