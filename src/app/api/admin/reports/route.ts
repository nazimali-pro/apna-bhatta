import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET all contact reports
export async function GET() {
    try {
        const reports = await prisma.contactReport.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(reports);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
    }
}

// POST - save a new contact report
export async function POST(request: Request) {
    try {
        const { name, email, type, subject, message } = await request.json();
        if (!name || !email || !subject || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        const report = await prisma.contactReport.create({
            data: { name, email, type: type || 'general', subject, message },
        });
        return NextResponse.json(report, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Failed to save report' }, { status: 500 });
    }
}
