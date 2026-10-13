import { prisma } from '@/lib/db';
import AdminPaymentsView from './AdminPaymentsView';

export const dynamic = 'force-dynamic';

export default async function AdminPaymentsPage() {
    // Fetch all delivered orders for the financial ledger
    const orders = await prisma.order.findMany({
        where: { status: 'DELIVERED' },
        orderBy: { createdAt: 'desc' },
        include: {
            admin: { select: { name: true, bhattaDetail: { select: { bankName: true, accountNumber: true, easypaisaNumber: true } } } },
            delivery: true
        }
    }) as any[];

    return <AdminPaymentsView initialOrders={JSON.parse(JSON.stringify(orders))} />;
}

