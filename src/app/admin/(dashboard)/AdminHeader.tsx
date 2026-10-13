'use client';

import AdminLogoutButton from '../AdminLogoutButton';

export default function AdminHeader() {
    return (
        <header className="h-16 flex justify-between items-center px-6 flex-shrink-0 bg-[var(--bg-secondary)] transition-colors duration-300">
            <div className="flex items-center gap-3">
                <span className="font-extrabold text-lg text-[var(--text-primary)]">Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-[10px] px-2 py-1 rounded-md font-black tracking-wider text-white shadow-sm" 
                    style={{ background: 'linear-gradient(135deg, #92400e, #7c2d12)' }}>
                    ADMIN
                </span>
                <AdminLogoutButton />
            </div>
        </header>
    );
}
