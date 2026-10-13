import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAdminToken } from '@/lib/auth-utils';

export async function PATCH(request: Request, context: any) {
    const isAdmin = await verifyAdminToken();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await context.params;
    const { status, adminNote } = await request.json();

    try {
        const data: any = {};
        if (status) data.status = status;
        if (adminNote !== undefined) data.adminNote = adminNote;

        const report = await prisma.contactReport.update({ where: { id }, data });
        return NextResponse.json({ success: true, report });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
    }
}

export async function DELETE(_: Request, context: any) {
    const isAdmin = await verifyAdminToken();
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await context.params;
    try {
        await prisma.contactReport.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed to delete report' }, { status: 500 });
    }
}
