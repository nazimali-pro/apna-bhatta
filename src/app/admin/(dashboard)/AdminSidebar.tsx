'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const MENU_ITEMS = [
    { label: 'Dashboard', href: '/admin', icon: '📊' },
    { label: 'Users', href: '/admin/users', icon: '👥' },
    { label: 'Inventory', href: '/admin/inventory', icon: '🧱' },
    { label: 'Orders', href: '/admin/orders', icon: '📦' },
    { label: 'Deliveries', href: '/admin/deliveries', icon: '🚚' },
    { label: 'Payments', href: '/admin/payments', icon: '💰' },
    { label: 'Support', href: '/admin/support', icon: '🎧' },
    { label: 'Reports', href: '/admin/reports', icon: '📈' },
    { label: 'Notifications', href: '/admin/notifications', icon: '🔔' },
    { label: 'Settings', href: '/admin/settings', icon: '⚙️' },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 flex-shrink-0 bg-[var(--bg-secondary)] shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-colors duration-300">
            {/* Brand */}
            <div className="h-16 flex items-center px-6">
                <span className="text-xl mr-2">🔐</span>
                <span className="font-extrabold text-lg tracking-wide text-[var(--text-primary)]">Apna<span style={{ color: '#b06040' }}>Bhatta</span> Admin</span>
            </div>

            {/* Nav Links */}
            <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
                {MENU_ITEMS.map(item => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                        <Link key={item.href} href={item.href}
                            className="flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-lg transition-colors"
                            style={{ 
                                backgroundColor: isActive ? 'rgba(176,96,64,0.1)' : 'transparent',
                                color: isActive ? '#f0a070' : 'var(--text-secondary)'
                            }}>
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    )
                })}
            </nav>
        </aside>
    );
}
