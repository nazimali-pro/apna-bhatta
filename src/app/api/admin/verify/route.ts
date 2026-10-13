import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/auth-utils';

/**
 * GET /api/admin/verify
 * Lightweight session check endpoint used by the client-side AdminAuthGuard.
 * Returns 200 if the admin_token cookie is valid, 401 if not.
 */
export async function GET() {
    const isAdmin = await verifyAdminToken();
    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ ok: true });
}
