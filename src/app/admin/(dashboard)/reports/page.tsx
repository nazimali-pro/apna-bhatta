import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminReportsPage() {
    // Fetch all delivered orders for Business Intelligence
    const orders = await prisma.order.findMany({
        where: { status: 'DELIVERED' },
        include: {
            admin: { select: { id: true, name: true, bhattaDetail: { select: { bhattaName: true } } } },
            items: { include: { product: { select: { id: true, name: true } } } }
        }
    }) as any[];

    // Aggregate Data
    let totalRevenue = 0;
    let totalBricksSold = 0;
    const productPerformance: Record<string, { id: string, name: string, qtySold: number, revenue: number }> = {};
    const monthlyRevenue: Record<string, number> = {};

    orders.forEach(o => {
        totalRevenue += o.totalAmount;
        
        // Month key: YYYY-MM
        const d = new Date(o.updatedAt);
        const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + o.totalAmount;
        
        // Product aggregation
        o.items.forEach((item: { quantity: number; productId: string; price: number; product: { id: string; name: string } | null }) => {
            totalBricksSold += item.quantity;
            const pid = item.productId;
            if (item.product) {
                if (!productPerformance[pid]) {
                    productPerformance[pid] = {
                        id: pid,
                        name: item.product.name,
                        qtySold: 0,
                        revenue: 0,
                    };
                }
                productPerformance[pid].qtySold += item.quantity;
                productPerformance[pid].revenue += (item.price * item.quantity);
            }
        });
    });

    const topProducts = Object.values(productPerformance).sort((a, b) => b.qtySold - a.qtySold).slice(0, 10);
    const monthlyData = Object.entries(monthlyRevenue).sort((a, b) => a[0].localeCompare(b[0])); // Oldest to newest

    const cell = 'px-4 py-4 text-sm border-b border-[#f0e8e0] text-[#2a1409]';
    const th = 'px-4 py-3 text-left text-xs font-bold uppercase tracking-wider border-b border-[#f0e8e0] text-[#8a7a6c] bg-[#fdfaf8]';

    return (
        <div className="space-y-10">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h1 className="text-2xl font-black text-[#2a1409]">Business Intelligence</h1>
                    <p className="text-sm text-[#8a7a6c]">Platform-wide sales reports, product performance, and network growth metrics.</p>
                </div>
            </div>

            {/* Global Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-[2rem] p-8 bg-white border border-[#f0e8e0] shadow-sm flex items-center justify-between overflow-hidden relative group">
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#b06040] mb-2">Lifetime Revenue</p>
                        <p className="text-3xl font-black text-[#2a1409]">PKR {totalRevenue.toLocaleString()}</p>
                    </div>
                    <span className="text-6xl opacity-5 grayscale absolute -right-4 -bottom-4 group-hover:scale-110 transition-transform">ðŸ“ˆ</span>
                </div>
                <div className="rounded-[2rem] p-8 bg-[#eff6ff] border border-[#bfdbfe] shadow-sm flex items-center justify-between overflow-hidden relative group">
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#1d4ed8] mb-2">Network Orders</p>
                        <p className="text-3xl font-black text-[#1d4ed8]">{orders.length}</p>
                    </div>
                    <span className="text-6xl opacity-10 absolute -right-4 -bottom-4 group-hover:scale-110 transition-transform">ðŸ“¦</span>
                </div>
                <div className="rounded-[2rem] p-8 bg-[#f0fdf4] border border-[#bbf7d0] shadow-sm flex items-center justify-between overflow-hidden relative group">
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#15803d] mb-2">Bricks Delivered</p>
                        <p className="text-3xl font-black text-[#15803d]">{totalBricksSold.toLocaleString()}</p>
                    </div>
                    <span className="text-6xl opacity-10 absolute -right-4 -bottom-4 group-hover:scale-110 transition-transform">ðŸ§±</span>
                </div>
            </div>

            {/* Monthly Trend */}
            <div className="rounded-[2.5rem] border border-[#f0e8e0] bg-white overflow-hidden shadow-sm">
                <div className="px-8 py-6 bg-[#fdfaf8] border-b border-[#f0e8e0] flex items-center justify-between">
                    <h2 className="font-black text-[#2a1409] tracking-tight text-lg">Monthly Revenue Growth</h2>
                    <span className="text-xs font-bold text-[#8a7a6c] uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-[#f0e8e0]">Historical Data</span>
                </div>
                <div className="p-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {monthlyData.length === 0 ? (
                        <p className="text-[#8a7a6c] text-sm italic py-4">No historical data available.</p>
                    ) : monthlyData.map(([month, rev]) => {
                        const [y, m] = month.split('-');
                        const date = new Date(parseInt(y), parseInt(m) - 1);
                        const monthName = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                        return (
                            <div key={month} className="bg-[#fdfaf8] p-5 rounded-2xl border border-[#f0e8e0] text-center hover:bg-white hover:shadow-md transition-all group">
                                <p className="text-[#8a7a6c] text-[10px] font-black uppercase tracking-widest mb-3">{monthName}</p>
                                <p className="font-black text-[#b06040] text-sm">PKR {rev.toLocaleString()}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Main Report Table */}
            <div className="rounded-[2.5rem] border border-[#f0e8e0] bg-white overflow-hidden shadow-sm">
                <div className="px-8 py-6 bg-[#fdfaf8] border-b border-[#f0e8e0]">
                    <h2 className="font-black text-[#2a1409] text-lg">Top 10 Best-Selling Brick Lines</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr>
                                <th className={th}>Rank</th>
                                <th className={th}>Product Line</th>
                                <th className={th}>Units Sold</th>
                                <th className={th}>Revenue Generated</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f0e8e0]">
                            {topProducts.map((p, i) => (
                                <tr key={p.id} className="hover:bg-[#fdfaf8] transition-colors">
                                    <td className={cell}>
                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-sm ${i < 3 ? 'bg-[#b06040] text-white' : 'bg-[#e0d6cd] text-[#8a7a6c]'}`}>
                                            {i + 1}
                                        </span>
                                    </td>
                                    <td className={cell}>
                                        <p className="font-black text-[#2a1409] text-sm">{p.name}</p>
                                    </td>
                                    <td className={cell}>
                                        <span className="text-[#2a1409] font-black text-sm">{p.qtySold.toLocaleString()}</span> 
                                        <span className="text-[10px] text-[#8a7a6c] ml-1 font-bold uppercase tracking-widest">PCS</span>
                                    </td>
                                    <td className={cell}>
                                        <span className="text-[#15803d] font-black">PKR {p.revenue.toLocaleString()}</span>
                                    </td>
                                </tr>
                            ))}
                            {topProducts.length === 0 && (
                                <tr><td colSpan={4} className="text-center py-12 text-[#8a7a6c] italic">No product metrics recorded.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

