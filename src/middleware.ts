import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from './lib/auth-utils';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Skip all internal Next.js paths and static assets
    if (
        path.startsWith('/_next') || 
        path.startsWith('/favicon.ico') ||
        path.match(/\.(jpg|jpeg|png|gif|webp|svg|ico|mp4|woff|woff2|ttf|otf)$/)
    ) {
        return NextResponse.next();
    }

    // Admin routes use their own cookie-based auth — skip all session checks
    if (path.startsWith('/admin') || path.startsWith('/api/admin')) {
        return NextResponse.next();
    }

    // Public routes (no auth required)
    const isPublicRoute =
        path === '/' ||
        path === '/about' ||
        path === '/contact' ||
        path === '/products' ||
        path.startsWith('/products/') ||
        path.startsWith('/login') ||
        path.startsWith('/register') ||
        path === '/api/upload';

    try {
        const session = await getSession();

        // Unauthenticated user trying to access a protected route
        if (!session && !isPublicRoute && !path.startsWith('/api/auth')) {
            return NextResponse.redirect(new URL('/login/customer', request.url));
        }

        // Logged-in user tries to access login/register — redirect to their main page
        if (session && (path.startsWith('/login') || path.startsWith('/register'))) {
            const redirectPath = session.role === 'CUSTOMER' ? '/products' : `/${session.role.toLowerCase()}`;
            return NextResponse.redirect(new URL(redirectPath, request.url));
        }

        // RBAC: role-specific route protection
        if (session) {
            if (path.startsWith('/driver') && session.role !== 'DRIVER') {
                return NextResponse.redirect(new URL('/unauthorized', request.url));
            }
            if (path.startsWith('/customer') && session.role !== 'CUSTOMER') {
                return NextResponse.redirect(new URL('/unauthorized', request.url));
            }
        }
    } catch (error) {
        console.error('Middleware session check failed:', error);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/auth (auth endpoints)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
    ],
};
