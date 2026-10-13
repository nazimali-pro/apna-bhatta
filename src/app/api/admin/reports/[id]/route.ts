import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// PATCH - update report status/note
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { status, adminNote } = await request.json();
        const report = await prisma.contactReport.update({
            where: { id },
            data: { status, adminNote, updatedAt: new Date() },
        });
        return NextResponse.json(report);
    } catch {
        return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
    }
}

// DELETE - delete a report
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.contactReport.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed to delete report' }, { status: 500 });
    }
}
