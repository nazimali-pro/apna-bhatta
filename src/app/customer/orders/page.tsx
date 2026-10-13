import { getSession } from '@/lib/auth-utils';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';
import OrderCard from '@/components/OrderCard';

export default async function CustomerOrdersPage() {
    const session = await getSession();
    if (!session || session.role !== 'CUSTOMER') redirect('/login/customer');

    const orders = await prisma.order.findMany({
        where: { customerId: session.userId },
        orderBy: { createdAt: 'desc' },
        include: {
            items: {
                include: { product: { select: { name: true, price: true } } }
            },
            admin: {
                include: { bhattaDetail: { select: { bhattaName: true } } }
            },
            delivery: { select: { id: true } }
        }
    });

    return (
        <div className="max-w-4xl">
            <div className="mb-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-[#92400e]">Purchase History</p>
                <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight">My Orders</h1>
                <p className="text-sm mt-2 text-[var(--text-secondary)] opacity-70">Track, manage, and review your brick orders in one place.</p>
            </div>

            <div className="space-y-8">
                {orders.length === 0 ? (
                    <div className="rounded-3xl p-16 text-center bg-white border border-amber-900/5 shadow-sm">
                        <div className="text-5xl mb-4 opacity-20">ðŸ“¦</div>
                        <p className="text-[var(--text-secondary)] font-medium mb-6">You haven&apos;t placed any orders yet.</p>
                        <a href="/products" className="inline-block px-8 py-3 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-amber-900/10 transition-transform hover:scale-105" style={{ background: 'linear-gradient(135deg, #a16207, #92400e)' }}>Start Shopping</a>
                    </div>
                ) : (
                    orders.map(order => (
                        <OrderCard key={order.id} order={order} />
                    ))
                )}
            </div>
        </div>
    );
}

