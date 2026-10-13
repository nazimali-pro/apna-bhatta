import { getSession } from '@/lib/auth-utils';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import CustomerProfileView from '../CustomerProfileView';

export const dynamic = 'force-dynamic';

export default async function CustomerProfilePage() {
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
            image: true,
            createdAt: true,
            _count: {
                select: { orders: true }
            }
        }
    });

    if (!user) redirect('/login/customer');

    return (
        <div className="max-w-4xl pb-12">
            <CustomerProfileView user={user as any} />
        </div>
    );
}
