'use client';

import { useRouter } from 'next/navigation';

export default function AdminLogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/admin/auth', { method: 'DELETE' });
        router.push('/admin/login');
        router.refresh();
    };

    return (
        <button
            onClick={handleLogout}
            suppressHydrationWarning
            className="px-4 py-2 rounded-lg text-sm font-bold transition hover:-translate-y-0.5 active:translate-y-0 shadow-sm hover:shadow-md"
            style={{ 
                backgroundColor: '#fff', 
                color: '#92400e', 
                border: '1px solid rgba(146,64,14,0.15)',
                boxShadow: '0 2px 8px rgba(146,64,14,0.05)'
            }}
        >
            🚪 Logout
        </button>
    );
}
