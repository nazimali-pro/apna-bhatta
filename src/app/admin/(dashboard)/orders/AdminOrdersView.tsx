'use client';

import { useState } from 'react';
import { formatDateTime } from '@/lib/utils';

type Order = {
    id: string; totalAmount: number; status: string; createdAt: string; address: string; isPaid: boolean;
    customer: { name: string; email: string }; 
    admin: { name: string };
    items: { quantity: number; price: number; product?: { name: string } }[];
    delivery?: { driver?: { name: string } | null, driverId?: string | null } | null;
};

export default function OrdersClient({ initialOrders }: { initialOrders: Order[] }) {
    const [orders, setOrders] = useState(initialOrders);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [busy, setBusy] = useState<string | null>(null);

    const changeOrderStatus = async (id: string, status: string) => {
        setBusy(id);
        const res = await fetch(`/api/admin/orders/${id}`, { 
            method: 'PATCH', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ status }) 
        });
        if (res.ok) {
            setOrders(o => o.map(x => x.id === id ? { ...x, status } : x));
        }
        setBusy(null);
    };

    const deleteOrder = async (id: string) => {
        if (!confirm('Permanently delete this order? It will be removed from system history for all parties.')) return;
        setBusy(id);
        const res = await fetch(`/api/admin/orders/${id}`, { method: 'DELETE' });
        if (res.ok) setOrders(o => o.filter(x => x.id !== id));
        setBusy(null);
    };

    const filtered = orders.filter(o => {
        const matchesSearch = 
            o.customer.name.toLowerCase().includes(search.toLowerCase()) || 
            o.id.toLowerCase().includes(search.toLowerCase()) ||
            o.admin.name.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        const m: Record<string, string> = { 
            PENDING: 'bg-amber-50 text-amber-700 border-amber-200', 
            PROCESSING: 'bg-blue-50 text-blue-700 border-blue-200', 
            DISPATCHED: 'bg-purple-50 text-purple-700 border-purple-200', 
            DELIVERED: 'bg-green-50 text-green-700 border-green-200', 
            CANCELLED: 'bg-red-50 text-red-700 border-red-200' 
        };
        return m[status] || 'bg-gray-50 text-gray-700 border-gray-200';
    };

    const cell = 'px-4 py-4 text-sm border-b border-[var(--border-primary)] align-top text-[var(--text-primary)]';
    const th = 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider border-b border-[var(--border-primary)] text-[var(--text-secondary)] opacity-70';

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">Orders & Logistics</h1>
                    <p className="text-sm text-[var(--text-secondary)]">Track all platform orders, deliveries, and lifecycle states.</p>
                </div>
                <div className="text-sm font-bold bg-[var(--bg-secondary)] border border-[var(--border-primary)] px-3 py-1.5 rounded-lg text-[var(--accent-primary)] shadow-sm">
                    Total Orders: {orders.length}
                </div>
            </div>

            <div className="mb-6 flex gap-4">
                <input 
                    value={search} 
                    onChange={e => setSearch(e.target.value)} 
                    placeholder="Search by ID, customer, or address…"
                    className="flex-1 max-w-sm rounded-lg px-4 py-2 text-sm outline-none bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:border-[var(--accent-primary)] shadow-sm"
                />
                <select 
                    value={statusFilter} 
                    onChange={e => setStatusFilter(e.target.value)}
                    className="rounded-lg px-4 py-2 text-sm outline-none bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:border-[var(--accent-primary)] cursor-pointer shadow-sm"
                >
                    <option value="ALL">All Statuses</option>
                    <option value="PENDING">PENDING</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="DISPATCHED">DISPATCHED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                </select>
            </div>

            <div className="rounded-xl overflow-hidden border border-[var(--border-primary)] bg-[var(--bg-primary)] shadow-sm">
                <table className="min-w-full">
                    <thead className="bg-[var(--bg-secondary)]">
                        <tr>
                            <th className={th}>Order Details</th>
                            <th className={th}>Parties</th>
                            <th className={th}>Status & Payment</th>
                            <th className={th}>Delivery</th>
                            <th className={th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-[var(--text-secondary)] opacity-50 text-sm">No orders match criteria.</td>
                            </tr>
                        ) : filtered.map(o => (
                            <tr key={o.id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                                <td className={cell}>
                                    <p className="font-extrabold text-[var(--accent-primary)] text-xs font-mono mb-1">{o.id.split('-')[0].toUpperCase()}</p>
                                    <div className="text-xs text-[#888] space-y-1 mt-2">
                                        {o.items.map((item, i) => (
                                            <div key={i}>• {item.quantity}x {item.product?.name || 'Deleted Product'}</div>
                                        ))}
                                    </div>
                                    <p className="text-xs mt-3 text-[#666]">{formatDateTime(o.createdAt)}</p>
                                </td>
                                
                                <td className={cell}>
                                    <div className="mb-3">
                                        <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-secondary)] opacity-50">Customer</p>
                                        <p className="font-bold text-[var(--text-primary)]">{o.customer.name}</p>
                                        <p className="text-xs text-[var(--text-secondary)]">{o.customer.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-secondary)] opacity-50">Bhatta / Official</p>
                                        <p className="font-bold text-[var(--text-primary)]">{o.admin.name}</p>
                                    </div>
                                </td>
                                
                                <td className={cell}>
                                    <div className="font-bold text-[var(--accent-primary)] text-lg mb-2">PKR {o.totalAmount.toLocaleString()}</div>
                                    <select 
                                        value={o.status} 
                                        onChange={e => changeOrderStatus(o.id, e.target.value)} 
                                        disabled={busy === o.id}
                                        className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border outline-none cursor-pointer w-full max-w-[140px] appearance-none shadow-sm transition-all hover:scale-105 ${getStatusColor(o.status)}`}
                                    >
                                        {['PENDING', 'PROCESSING', 'DISPATCHED', 'DELIVERED', 'CANCELLED'].map(s => 
                                            <option key={s} value={s}>{s}</option>
                                        )}
                                    </select>
                                    <div className="mt-2 text-xs">
                                        {o.isPaid ? '✅ Paid' : '⏳ Unpaid'}
                                    </div>
                                </td>
                                
                                <td className={cell}>
                                    {o.delivery ? (
                                        o.delivery.driver ? (
                                            <div className="text-sm">
                                                <p className="text-[10px] uppercase font-bold tracking-wider text-blue-600 mb-0.5">Assigned Driver</p>
                                                <p className="font-bold text-[var(--text-primary)] mb-1">🚚 {o.delivery.driver.name}</p>
                                            </div>
                                        ) : (
                                            <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded inline-block">Waiting for Driver</span>
                                        )
                                    ) : (
                                        <span className="text-xs font-bold text-[var(--text-secondary)] opacity-50">No Delivery Record</span>
                                    )}
                                    <p className="text-xs text-[#888] mt-3 truncate max-w-[200px]" title={o.address}>📍 {o.address}</p>
                                </td>
                                
                                <td className={cell}>
                                    <button 
                                        onClick={() => deleteOrder(o.id)} 
                                        disabled={busy === o.id}
                                        className="text-xs px-3 py-1.5 rounded font-bold transition disabled:opacity-40 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                                    >
                                        {busy === o.id ? '…' : 'Delete Order'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
