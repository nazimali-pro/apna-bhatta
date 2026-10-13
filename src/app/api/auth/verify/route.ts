import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-utils';

/**
 * GET /api/auth/verify
 * Returns the current session role if valid, or 401 if the user is logged out.
 * Used by SessionAuthGuard on every page mount to catch the back-button scenario.
 */
export async function GET() {
    const session = await getSession();
    if (!session || !session.role) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ role: session.role });
}
