import { redirect } from 'next/navigation';
import { verifyAdminToken } from '@/lib/auth-utils';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminAuthGuard from './AdminAuthGuard';

// Force dynamic rendering so this layout is NEVER cached by Next.js or the browser
export const dynamic = 'force-dynamic';

export default async function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 1. Authenticate on the server
    const isAdmin = await verifyAdminToken();
    if (!isAdmin) redirect('/admin/login');

    // 2. Render Layout
    return (
        <div className="flex h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans overflow-hidden transition-colors duration-300">
            {/* Client-side guard: re-checks session on every page mount (including back-button) */}
            <AdminAuthGuard />

            {/* Sidebar (Desktop & Mobile Nav) */}
            <AdminSidebar />
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <AdminHeader />
                <main className="flex-1 overflow-y-auto p-6 bg-[var(--bg-primary)] transition-colors duration-300">
                    {children}
                </main>
            </div>
        </div>
    );
}

