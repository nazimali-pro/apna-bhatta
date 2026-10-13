// --- DATE FORMATTING ---

/**
 * Format a date to a fixed locale string to prevent SSR/client hydration mismatches.
 * Always uses 'en-GB' locale so the output is identical on server and client.
 */
export function formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

export function formatDateTime(date: string | Date): string {
    return new Date(date).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
}

// --- CONSTANTS ---

export const CUSTOMER_NAV_ITEMS = [
    { href: '/customer', label: 'Overview', icon: '📊', exact: true },
    { href: '/customer/products', label: 'Shop', icon: '🧱', exact: false },
    { href: '/customer/orders', label: 'Orders', icon: '📦', exact: false },
    { href: '/customer/profile', label: 'Profile', icon: '👤', exact: false },
];
