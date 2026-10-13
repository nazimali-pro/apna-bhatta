import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const origin = new URL(request.url).origin;
    const response = NextResponse.redirect(`${origin}/`);
    // Clear the session cookie directly on the response — this is the only
    // reliable method in Next.js 15+ Route Handlers
    response.cookies.set('session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
    });
    return response;
}

