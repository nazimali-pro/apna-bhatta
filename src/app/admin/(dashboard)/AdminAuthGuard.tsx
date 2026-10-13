'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * AdminAuthGuard — mounted in the admin layout.
 * On every page load (including back-button restore), it hits the server
 * to verify the session is still valid. If not, it redirects to login.
 * This is necessary because browsers cache page HTML and bypass server
 * redirect logic when the user presses Back after logging out.
 */
export default function AdminAuthGuard() {
    const router = useRouter();

    useEffect(() => {
        // Verify session with the server on every mount
        fetch('/api/admin/verify', { method: 'GET', credentials: 'same-origin' })
            .then(res => {
                if (!res.ok) {
                    router.replace('/admin/login');
                }
            })
            .catch(() => {
                router.replace('/admin/login');
            });
    }, [router]);

    return null; // renders nothing — just runs the auth check
}
