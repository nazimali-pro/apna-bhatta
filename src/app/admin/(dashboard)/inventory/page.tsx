import { prisma } from '@/lib/db';
import AdminInventoryView from './AdminInventoryView';

export const dynamic = 'force-dynamic';

export default async function AdminInventoryPage() {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        include: { images: true },
    });

    return <AdminInventoryView initialProducts={JSON.parse(JSON.stringify(products))} />;
}
