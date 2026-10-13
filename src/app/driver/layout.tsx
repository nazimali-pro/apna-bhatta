import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth-utils';
import { SessionAuthGuard } from '@/components/auth-components';
import PortalLayoutClient from '@/components/PortalLayoutClient';

export const dynamic = 'force-dynamic';

const navItems = [
    { href: '/driver', label: 'Deliveries', icon: '🚚', exact: true },
];

export default async function DriverLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();
    if (!session || session.role !== 'DRIVER') {
        redirect('/login/driver');
    }

    return (
        <div className="flex min-h-screen" style={{ background: '#fdfaf8' }}>
            <SessionAuthGuard requiredRole="DRIVER" loginPath="/login/driver" />
            <PortalLayoutClient
                navItems={navItems}
                portalLabel="Driver Portal"
                loginPath="/login/driver"
                homeLink={{ href: '/', label: 'Visit Site' }}
            />
            <div className="flex-1 lg:ml-64 pb-20 lg:pb-0">
                <main className="min-h-screen p-5 lg:p-8" style={{ background: '#fdfaf8', color: '#1a0c05' }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
