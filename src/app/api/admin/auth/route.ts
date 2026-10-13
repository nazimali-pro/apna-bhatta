import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';

const ADMIN_ID = process.env.ADMIN_ID || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'bhatta@admin2025';
const ADMIN_SECRET = new TextEncoder().encode(
    process.env.ADMIN_SECRET || 'bhatta-admin-jwt-secret-2025'
);

export async function POST(request: Request) {
    try {
        const { adminId, password } = await request.json();

        if (adminId !== ADMIN_ID || password !== ADMIN_PASSWORD) {
            return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
        }

        // Create a short-lived admin JWT (8 hours)
        const token = await new SignJWT({ adminId, role: 'ADMIN' })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('8h')
            .sign(ADMIN_SECRET);

        const cookieStore = await cookies();
        cookieStore.set('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 8, // 8 hours
            path: '/', // Must be '/' so it's sent to /api/admin/* routes too
        });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE() {
    const response = NextResponse.json({ success: true });
    // Clear admin token directly on the response — reliable in Next.js 15+
    response.cookies.set('admin_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
    });
    // Also clear old-path cookie just in case
    response.cookies.set('admin_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/admin',
    });
    return response;
}
