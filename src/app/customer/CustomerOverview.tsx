'use client';

import { formatDate } from '@/lib/utils';
import Link from 'next/link';

type Order = {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: Date;
    admin: { bhattaDetail: { bhattaName: string } | null };
    items: { quantity: number }[];
};

export default function CustomerOverview({
    user,
    orders,
}: {
    user: any;
    orders: Order[];
}) {
    const totalSpent = orders.reduce((sum, order) => order.status !== 'CANCELLED' ? sum + order.totalAmount : sum, 0);
    const activeOrders = orders.filter(o => ['PENDING', 'PROCESSING', 'DISPATCHED'].includes(o.status));
    const recentOrders = orders.slice(0, 3);

    return (
        <div className="space-y-10">
            {/* Premium Header */}
            <div className="flex flex-wrap items-center justify-between gap-6 pb-2">
                <div className="flex items-center gap-6">
                    <div className="relative w-20 h-20 rounded-3xl overflow-hidden shadow-xl border-2 border-amber-900/5 bg-[var(--bg-secondary)] flex-shrink-0">
                        {user.image ? (
                            <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl opacity-10 bg-amber-50">👤</div>
                        )}
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight mb-1">Welcome back, {user.name.split(' ')[0]}!</h1>
                        <p className="text-sm font-medium text-[var(--text-secondary)] opacity-60">Manage your recurring brick supplies and orders.</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Spending', value: `PKR ${totalSpent.toLocaleString()}`, icon: '💰', sub: 'Completed transactions' },
                    { label: 'Orders Placed', value: orders.length, icon: '📦', sub: 'Total brick orders' },
                    { label: 'Active Progress', value: activeOrders.length, icon: '🚚', sub: 'Currently in transit' },
                ].map((stat, i) => (
                    <div key={i} className="rounded-3xl p-8 relative overflow-hidden group bg-white border border-amber-900/5 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                        <div className="absolute top-0 right-0 p-6 opacity-10 text-6xl group-hover:scale-110 transition-transform" style={{ color: '#92400e' }}>{stat.icon}</div>
                        <p className="text-[10px] font-black uppercase tracking-widest mb-3 text-[#92400e] opacity-70">{stat.label}</p>
                        <p className="text-4xl font-black text-[var(--text-primary)] mb-2">{stat.value}</p>
                        <p className="text-[10px] font-bold text-[var(--text-secondary)] opacity-40 uppercase tracking-widest">{stat.sub}</p>
                    </div>
                ))}
            </div>

            {/* Recent Activity Container */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 rounded-3xl p-8 bg-white border border-amber-900/5 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-black text-[var(--text-primary)] tracking-tight">Recent Activity</h2>
                        <Link href="/customer/orders" className="text-[10px] font-black uppercase tracking-widest transition-all px-4 py-2 rounded-xl bg-amber-50 text-[#92400e] hover:bg-amber-100 italic">View History →</Link>
                    </div>

                    {recentOrders.length === 0 ? (
                        <div className="text-center py-16 opacity-30">
                            <div className="text-6xl mb-4">📦</div>
                            <p className="text-sm font-black uppercase tracking-widest">No Recent Activity</p>
                            <Link href="/products" className="inline-block mt-4 text-[#92400e] hover:underline">Browse Products</Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {recentOrders.map(order => (
                                <div key={order.id} className="flex justify-between items-center p-6 rounded-2xl bg-gray-50/50 border border-transparent hover:border-amber-900/5 transition">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-xl bg-white border border-amber-900/5 flex items-center justify-center text-2xl shadow-sm">🧱</div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="text-xs font-mono font-bold text-[var(--text-primary)]">#{order.id.split('-')[0].toUpperCase()}</span>
                                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${order.status === 'DELIVERED' ? 'bg-green-50 text-green-700' :
                                                        order.status === 'CANCELLED' ? 'bg-red-50 text-red-700' :
                                                            'bg-amber-50 text-[#92400e]'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <p className="text-[10px] font-bold text-[var(--text-secondary)] opacity-50">
                                                {formatDate(order.createdAt)} • {order.admin.bhattaDetail?.bhattaName}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-1">
                                        <p className="text-sm font-black text-[#92400e]">PKR {order.totalAmount.toLocaleString()}</p>
                                        <div className="flex gap-3">
                                            {order.status !== 'CANCELLED' && (
                                                <Link href={`/customer/track/${order.id}`} className="text-[9px] font-black uppercase tracking-widest text-blue-600 hover:underline transition-all">Track Order</Link>
                                            )}
                                            <Link href="/customer/orders" className="text-[9px] font-black uppercase tracking-widest hover:opacity-100 opacity-30 text-[var(--text-secondary)] transition-all italic">Quick View</Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar Feature: Support/Pro */}
                <div className="space-y-6">
                    <div className="rounded-3xl p-8 bg-amber-50 border border-amber-200">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#92400e] mb-4">Pro Tips</h3>
                        <ul className="space-y-4">
                            <li className="flex gap-3 text-[11px] font-medium text-amber-900">
                                <span className="text-amber-500 font-bold">●</span>
                                Track live deliveries in the Activity tab.
                            </li>
                            <li className="flex gap-3 text-[11px] font-medium text-amber-900">
                                <span className="text-amber-500 font-bold">●</span>
                                Download invoices directly from order details.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
