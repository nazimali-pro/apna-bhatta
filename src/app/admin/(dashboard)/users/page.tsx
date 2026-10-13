import { prisma } from '@/lib/db';
import AdminUsersView from './AdminUsersView';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
    const customers = await prisma.user.findMany({
        where: { role: 'CUSTOMER' },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            _count: { select: { orders: true } }
        }
    });

    const drivers = await prisma.user.findMany({
        where: { role: 'DRIVER' },
        orderBy: { createdAt: 'desc' },
        include: { driverDetail: true }
    });

    return <AdminUsersView 
        initialCustomers={JSON.parse(JSON.stringify(customers))}
        initialDrivers={JSON.parse(JSON.stringify(drivers))}
    />;
}
