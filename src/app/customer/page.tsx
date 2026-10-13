import { getSession } from '@/lib/auth-utils';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import CustomerOverview from './CustomerOverview';

export const dynamic = 'force-dynamic';

export default async function CustomerDashboard() {
    const session = await getSession();

    if (!session || session.role !== 'CUSTOMER') {
        redirect('/login/customer');
    }

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { id: true, name: true }
    });

    if (!user) redirect('/login/customer');

    const orders = await prisma.order.findMany({
        where: { customerId: session.userId },
        orderBy: { createdAt: 'desc' },
        include: {
            items: {
                select: { quantity: true }
            },
            admin: {
                include: { bhattaDetail: { select: { bhattaName: true } } }
            }
        }
    });

    return <CustomerOverview user={user} orders={orders as any} />;
}

