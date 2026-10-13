import { redirect } from 'next/navigation';
import { verifyAdminToken } from '@/lib/auth-utils';
import { prisma } from '@/lib/db';
import AdminDashboardClient from './AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const isAdmin = await verifyAdminToken();
    if (!isAdmin) redirect('/admin/login');

    const [
        totalUsers, totalProducts, totalDrivers, totalCustomers, totalOrders,
        aggregateOrders, contactReports,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.product.count(),
        prisma.user.count({ where: { role: 'DRIVER' } }),
        prisma.user.count({ where: { role: 'CUSTOMER' } }),
        prisma.order.count(),
        prisma.order.aggregate({ _sum: { totalAmount: true }, where: { status: 'DELIVERED', isPaid: true } }),
        prisma.contactReport.findMany({ orderBy: { createdAt: 'desc' } }),
    ]);

    const totalRevenue = aggregateOrders._sum.totalAmount || 0;

    return (
        <AdminDashboardClient
            stats={{ totalUsers, totalProducts, totalDrivers, totalCustomers, totalOrders, totalRevenue }}
            initialReports={JSON.parse(JSON.stringify(contactReports))}
        />
    );
}
