import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth-utils';
import { SessionAuthGuard } from '@/components/auth-components';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();
    return (
        <div className="min-h-screen flex flex-col" style={{ background: '#fdfaf8' }}>
            <SessionAuthGuard requiredRole="CUSTOMER" loginPath="/login/customer" />
            <Navbar initialSession={session} />
            <main className="flex-1 max-w-7xl mx-auto w-full p-5 lg:p-8">
                {children}
            </main>
            <Footer />
        </div>
    );
}
