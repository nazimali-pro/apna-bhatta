import { prisma } from '@/lib/db';
import AdminOrdersView from './AdminOrdersView';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            customer: { select: { name: true, email: true } },
            admin: { select: { name: true } },
            items: { 
                include: { 
                    product: { select: { name: true } } 
                } 
            },
            delivery: {
                include: {
                    driver: { select: { name: true } }
                }
            }
        }
    });

    return <AdminOrdersView initialOrders={JSON.parse(JSON.stringify(orders))} />;
}

