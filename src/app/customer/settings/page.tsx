import { getSession } from '@/lib/auth-utils';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import CustomerSettingsForm from '../CustomerSettingsForm';

export const dynamic = 'force-dynamic';

export default async function CustomerSettingsPage() {
    const session = await getSession();
    if (!session || session.role !== 'CUSTOMER') redirect('/login/customer');

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { 
            id: true, 
            name: true, 
            email: true, 
            phoneNumber: true, 
            city: true, 
            image: true 
        }
    });

    if (!user) redirect('/login/customer');

    return (
        <div className="max-w-4xl pb-12">
            <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-widest mb-1 text-[var(--accent-primary)]">Command Center</p>
                <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">Account Settings</h1>
                <p className="text-sm mt-1 text-[var(--text-secondary)] opacity-60">Manage your profile, security, and account status.</p>
            </div>

            <CustomerSettingsForm user={user as any} />
        </div>
    );
}
